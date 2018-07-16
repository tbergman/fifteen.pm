import React, {PureComponent} from 'react';
import * as THREE from 'three';
import {ImprovedNoise} from "./Utils/ImprovedNoise";
import {FirstPersonControls} from "./Utils/FirstPersonControls";
import './Releases/Release.css';
import debounce from 'lodash/debounce';
import {generatePitchShiftProcessor} from "./Utils/PitchShifterProcessor"

const MARGIN = 0;
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight - 2 * MARGIN;
const WORLD_WIDTH = 256;
const WORLD_DEPTH = 256;
const MIN_CAMERA_Y = 450;
const NEAR = .5;
const FAR = 1000;
const NUM_FLIES = 10;

class Home extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.clock = new THREE.Clock();

    this.fogData = this.generateFogHeight(WORLD_WIDTH, WORLD_DEPTH);
    this.fogGeometry = new THREE.PlaneBufferGeometry(7500, 7500, WORLD_WIDTH - 1, WORLD_DEPTH - 1);

    this.fogVector3 = new THREE.Vector3(0, 0, 0);
    this.sun = new THREE.Vector3(1, 1, 1);
    this.fogTexture = new THREE.CanvasTexture(this.generateTexture(this.fogData, WORLD_WIDTH, WORLD_DEPTH));
    this.fogMesh = new THREE.Mesh(
      this.fogGeometry,
      new THREE.MeshBasicMaterial({map: this.fogTexture, transparent: true, opacity: .9}));

    this.camera = new THREE.PerspectiveCamera(75, SCREEN_WIDTH / SCREEN_HEIGHT, NEAR, FAR);
    this.camera.position.y = 450;//this.fogData[WORLD_WIDTH / 2 + WORLD_DEPTH / 2 * WORLD_WIDTH] * 10 + 200; //* 10 + 400;

    this.controls = new FirstPersonControls(this.camera);
    this.controls.lookSpeed = 0.1;
    this.controls.movementSpeed = 20;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x363dc2);
    this.scene.fog = new THREE.FogExp2(0x363dc2, 0.0025);
    this.renderer = new THREE.WebGLRenderer();
    this.flyGroup = new THREE.Group();
    this.flies = [];
    this.flyPaths = [];
    this.flyRadianPosition = 0;
    for (let i = 0; i < NUM_FLIES; i++) {

      let flyPath = this.generateFlyPath(this.camera.position);

      this.flyPaths.push(flyPath);
      let fly = this.generateFly(flyPath);
      this.flies.push(fly);
      this.flyGroup.add(fly);
    }
    this.scene.add(this.flyGroup);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize, false);
    this.init();
    this.animate();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize, false);
  }

  init = () => {
    const {controls, fogGeometry, fogTexture, fogMesh, scene, renderer, fogData} = this;

    const container = document.getElementById('container');
    fogGeometry.rotateX(-Math.PI / 2);
    controls.movementSpeed = 150;
    controls.lookSpeed = 0.1;

    let vertices = fogGeometry.attributes.position.array;
    for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
      vertices[j + 1] = fogData[i] * 10;
    }

    fogTexture.wrapS = THREE.ClampToEdgeWrapping;
    fogTexture.wrapT = THREE.ClampToEdgeWrapping;
    scene.add(fogMesh);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container.appendChild(renderer.domElement);
  }

  onWindowResize = debounce(() => {
    const {camera, renderer, controls} = this;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.handleResize();
  }, 100);

  generateFlyPath = (pos) => {
    let flyPathVertices = [];
    let numFlyPathVertices = 200;
    // let cameraPos = this.camera.position;
    let maxX = 5 + pos.x;
    let minX = -1 + pos.x;
    let maxY = 1 + pos.y;
    let minY = 0 + pos.y;
    let maxZ = 2 + pos.z;
    let minZ = -10 + pos.z;
    for (let i = 0; i < numFlyPathVertices; i++) {
      if (i === numFlyPathVertices / 2) {
        // ensure fly path goes through center
        flyPathVertices.push(new THREE.Vector3(
          pos.x,
          pos.y,
          pos.z + NEAR
        )); // don't go str8 thru camera
      }
      let randVect3 = new THREE.Vector3(
        THREE.Math.randInt(minX, maxX),
        THREE.Math.randInt(minY, maxY),
        THREE.Math.randInt(minZ, maxZ)
      );
      if (pos.distanceTo(randVect3) < NEAR) {
        // nudge the position off the center
        randVect3.y += NEAR;
      }
      flyPathVertices.push(randVect3)
    }
    return new THREE.CatmullRomCurve3(flyPathVertices);
  }

  generateFly = (flyPath) => {
    const {camera} = this;

    let flyGeometry = new THREE.SphereGeometry(.08, .01, .01);
    let flyMaterial = new THREE.MeshPhongMaterial(
      {color: 0xFFFF00, transparent: true, opacity: .2});

    let fly = new THREE.Mesh(flyGeometry, flyMaterial);

    let light = new THREE.PointLight( 0xff0000, 10, 1000 );
    fly.add( light );

    fly.material.lights = true;
    fly.castShadow = true;

    // create an AudioListener and add it to the camera
    let listener = new THREE.AudioListener();
    camera.add(listener);
    // create the PositionalAudio object (passing in the listener)
    let sound = new THREE.PositionalAudio(listener);
    let buffSource = sound.context.createBufferSource();
    buffSource.connect(generatePitchShiftProcessor(sound));
    let audioLoader = new THREE.AudioLoader();
    sound.setVolume(.01);
    sound.loop = true;
    audioLoader.load('assets/fly.mp3', (buffer) => {
      sound.setBuffer(buffer);
      sound.setRefDistance(20);
      sound.play();
    });
    fly.add(sound);

    fly.position.set(
      flyPath.points[0].x,
      flyPath.points[0].y,
      flyPath.points[0].z
    );


    return fly;

  }

  generateFogHeight(width, height) {
    let size = width * height, data = new Uint8Array(size),
      perlin = new ImprovedNoise(), quality = 1, z = Math.random() * 100;
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < size; i++) {
        let x = i % width, y = ~~(i / width);
        data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * .75);
      }
      quality *= 5;
    }

    return data;
  }

  generateTexture(data, width, height) {
    const {fogVector3, sun} = this;

    sun.normalize();

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    let context = canvas.getContext('2d');
    context.fillStyle = '#000';
    context.fillRect(0, 0, width, height);

    let image = context.getImageData(0, 0, canvas.width, canvas.height);
    let imageData = image.data;

    for (var i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {
      fogVector3.x = data[j - 2] - data[j + 2];
      fogVector3.y = 1;
      fogVector3.z = data[j - width * 2] - data[j + width * 2];
      fogVector3.normalize();

      let shade = fogVector3.dot(sun);

      imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
      imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
      imageData[i + 2] = (shade * 96) * (0.5 + data[j] * 0.007);
    }

    context.putImageData(image, 0, 0);

    // Scaled 4x
    let canvasScaled = document.createElement('canvas');
    canvasScaled.width = width * 4;
    canvasScaled.height = height * 4;

    context = canvasScaled.getContext('2d');
    context.scale(4, 4);
    context.drawImage(canvas, 0, 0);

    image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
    imageData = image.data;

    for (var i = 0, l = imageData.length; i < l; i += 4) {
      var v = ~~(Math.random() * 5);
      imageData[i] += v;
      imageData[i + 1] += v;
      imageData[i + 2] += v;
    }

    context.putImageData(image, 0, 0);
    return canvasScaled;
  }

  animate = () => {

    requestAnimationFrame(this.animate);

    this.animateFly();

    this.controls.update(this.clock.getDelta());
    if ( this.camera.position.y < MIN_CAMERA_Y ) {
      this.camera.position.y = MIN_CAMERA_Y;
    }

    this.renderer.render(this.scene, this.camera);

  }

  animateFly = () => {
    this.flyRadianPosition += .0003;
    for (let i = 0; i < NUM_FLIES; i++) {
      let flyPos = this.flyPaths[i].getPoint(this.flyRadianPosition);
      this.flies[i].position.copy(flyPos);
    }
  }

  render() {
    return (
      <div
        id="container"
        ref={element => this.container = element}
      >
      </div>
    );
  }
}

export default Home;
