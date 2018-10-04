import React, {Component} from 'react';
import '../Release.css';
import * as THREE from "three";
import {OrbitControls} from "../../Utils/OrbitControls";
import {CONSTANTS} from "./constants";
import {Reflector} from '../../Utils/Reflector';
import {Water} from '../../Utils/Water2';

class Release0005 extends Component {
  componentDidMount() {
    this.init();

    // When user resize window
    window.addEventListener("resize", this.onResize, false);
    // When user move the mouse
    document.body.addEventListener(
      "mousemove",
      this.onMouseMove,
      false
    );

    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // this.controls.maxDistance = 400;
    // this.controls.minDistance = 10;
    // this.controls.target.set(0, 40, 0);
    // this.controls.update();

    this.renderScene();

  }

  init = () => {
    // Create an empty scene and define a fog for it
    this.scene = new THREE.Scene();

    // Store the position of the mouse
    // Default is center of the screen
    this.mouse = {
      position: new THREE.Vector2(0, 0),
      target: new THREE.Vector2(0, 0)
    };

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(-16.5, 2.9, 14.7);
    this.camera.lookAt(this.scene.position);


    this.createSkyBox();
    this.createMirror();
    this.createLights();
    this.createWater();
    // this.createTunnelMesh();

    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.container.appendChild(this.renderer.domElement);


  }

  createLights() {
    const {scene} = this;
    var mainLight = new THREE.PointLight(0xcccccc, 1.5, 250);
    mainLight.position.y = 60;
    scene.add(mainLight);
    var greenLight = new THREE.PointLight(0x00ff00, 0.25, 1000);
    greenLight.position.set(550, 50, 0);
    scene.add(greenLight);
    var redLight = new THREE.PointLight(0xff0000, 0.25, 1000);
    redLight.position.set(-550, 50, 0);
    scene.add(redLight);
    var blueLight = new THREE.PointLight(0x7f7fff, 0.25, 1000);
    blueLight.position.set(0, 50, 550);
    scene.add(blueLight);
  }

  createWater() {
    const {scene} = this;
    var params = {
      color: '#ffffff',
      scale: 4,
      flowX: 1,
      flowY: 1
    };
    var waterGeometry = new THREE.PlaneBufferGeometry(25, 25);
    this.water = new Water(waterGeometry, {
      color: params.color,
      scale: params.scale,
      flowDirection: new THREE.Vector2(params.flowX, params.flowY),
      textureWidth: 1024,
      textureHeight: 1024
    });
    this.water.position.y = .1;
    this.water.rotation.x = Math.PI * -0.5;
    scene.add(this.water);

   // this.scene.add(planeBottom);
  }


  createSkyBox() {
    const {scene} = this;
    // sky box
    var cubeTextureLoader = new THREE.CubeTextureLoader();
    cubeTextureLoader.setPath('assets/releases/5/textures/cube/gradients/');
    var cubeTexture = cubeTextureLoader.load([
      '1.jpg', '2.jpg',
      '3.jpg', '4.jpg',
      '5.jpg', '6.jpg',
    ]);
    var cubeShader = THREE.ShaderLib['cube'];
    cubeShader.uniforms['tCube'].value = cubeTexture;
    var skyBoxMaterial = new THREE.ShaderMaterial({
      fragmentShader: cubeShader.fragmentShader,
      vertexShader: cubeShader.vertexShader,
      uniforms: cubeShader.uniforms,
      side: THREE.BackSide
    });
    var skyBox = new THREE.Mesh(new THREE.BoxBufferGeometry(1000, 1000, 1000), skyBoxMaterial);
    scene.add(skyBox);
  }


  createMirror() {
    const mirrorGeometry = new THREE.CircleBufferGeometry(5, 64);
    const mirror = new Reflector(mirrorGeometry, {
      // clipBias: 0.003,
      textureWidth: CONSTANTS.ww * window.devicePixelRatio,
      textureHeight: CONSTANTS.wh * window.devicePixelRatio,
      color: 0xffffff,
      recursion: 1
    });
    mirror.position.y = 0;
    mirror.rotateY(-Math.PI / 2);

    this.mirror = mirror;
    this.scene.add(this.mirror);

    var geometry = new THREE.PlaneBufferGeometry(100, 100);
    var verticalMirror = new Reflector(geometry, {
      // clipBias: 0.003,
      textureWidth: CONSTANTS.ww * window.devicePixelRatio,
      textureHeight: CONSTANTS.wh * window.devicePixelRatio,
      color: 0x889999,
      recursion: 5
    });
    verticalMirror.position.y = 50;
    verticalMirror.position.z = -50;
    // this.scene.add(verticalMirror);

  }

  createTunnelMesh() {
    var points = [];

    for (var i = 0; i < 5; i += 1) {
      points.push(new THREE.Vector3(0, 0, 2.5 * (i / 4)));
    }
    points[4].y = -0.06;

    this.curve = new THREE.CatmullRomCurve3(points);

    var geometry = new THREE.Geometry();
    geometry.vertices = this.curve.getPoints(70);
    this.splineMesh = new THREE.Line(geometry, new THREE.LineBasicMaterial());

    var loader = new THREE.TextureLoader();

    var textures = loader.load(CONSTANTS.textures.galaxy.url, function (texture) {
      return texture;
    });

    this.tubeMaterial = new THREE.MeshStandardMaterial({
      side: THREE.BackSide,
      map: textures
    });

    this.tubeMaterial.map.wrapS = THREE.RepeatWrapping;
    this.tubeMaterial.map.wrapT = THREE.RepeatWrapping;

    this.tubeGeometry = new THREE.TubeGeometry(this.curve, 70, 0.02, 50, false);
    this.tubeMesh = new THREE.Mesh(this.tubeGeometry, this.tubeMaterial);
    this.scene.add(this.tubeMesh);

    // original tube geometry
    this.tubeGeometry_o = this.tubeGeometry.clone();
  };

  onMouseMove = (e) => {
    // Save mouse X & Y position
    this.mouse.target.x = (e.clientX - (CONSTANTS.ww * 0.5)) / (CONSTANTS.ww * 0.5);
    this.mouse.target.y = ((CONSTANTS.wh * 0.5) - e.clientY) / (CONSTANTS.wh * 0.5);
  };

  onResize = () => {
    // On resize, get new width & height of window
    const ww = document.documentElement.clientWidth || document.body.clientWidth;
    const wh = window.innerHeight;

    // Update camera aspect
    this.camera.aspect = ww / wh;
    // Reset aspect of the camera
    this.camera.updateProjectionMatrix();
    // Update size of the canvas
    this.renderer.setSize(ww, wh);
  };

  updateMaterialOffset() {
    // Update the offset of the material
    this.tubeMaterial.map.offset.x += this.speed * 0.5;
  };

  updateCurve() {
    var index = 0, vertice_o = null, vertice = null;
    // For each vertice of the tube, move it a bit based on the spline
    for (var i = 0, j = this.tubeGeometry.vertices.length; i < j; i += 1) {
      // Get the original tube vertice
      vertice_o = this.tubeGeometry_o.vertices[i];
      // Get the visible tube vertice
      vertice = this.tubeGeometry.vertices[i];
      // Calculate index of the vertice based on the Z axis
      // The tube is made of 50 rings of vertices
      index = Math.floor(i / 50);
      // Update tube vertice
      vertice.x +=
        (vertice_o.x + this.splineMesh.geometry.vertices[index].x - vertice.x) /
        10;
      vertice.y +=
        (vertice_o.y + this.splineMesh.geometry.vertices[index].y - vertice.y) /
        5;
    }
    // Warn ThreeJs that the points have changed
    this.tubeGeometry.verticesNeedUpdate = true;

    // Update the points along the curve base on mouse position
    this.curve.points[2].x = -this.mouse.position.x * 0.1;
    this.curve.points[4].x = -this.mouse.position.x * 0.1;
    this.curve.points[2].y = this.mouse.position.y * 0.1;

    // Warn ThreeJs that the spline has changed
    this.splineMesh.geometry.verticesNeedUpdate = true;
    this.splineMesh.geometry.vertices = this.curve.getPoints(70);
  };

  updateCameraPosition() {
    // Update the mouse position with some lerp
    this.mouse.position.x += (this.mouse.target.x - this.mouse.position.x) / 30;
    this.mouse.position.y += (this.mouse.target.y - this.mouse.position.y) / 30;

    // Rotate Z & Y axis
    this.camera.rotation.z = this.mouse.position.x * 0.2;
    this.camera.rotation.y = Math.PI - this.mouse.position.x * 0.06;
    // Move a bit the camera horizontally & vertically
    this.camera.position.x = this.mouse.position.x * 0.015;
    this.camera.position.y = -this.mouse.position.y * 0.015;
  };

  renderScene() {
    // console.log(this.camera.position);
    // Update material offsetObject { x: -16.55902138729872, y: 2.9442435235951203, z: 14.701368669915082 }

    // this.updateMaterialOffset();

    // Update camera position & rotation
    // this.updateCameraPosition();

    // Update the tunnel
    // this.updateCurve();

    // render the scene
    this.renderer.render(this.scene, this.camera);

    // Animation loop
    window.requestAnimationFrame(this.renderScene.bind(this));
  }

  render() {
    return (
      <div ref={element => this.container = element}/>
    );
  }
}

export default Release0005;
