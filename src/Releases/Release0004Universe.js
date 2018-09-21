import React, {PureComponent, Fragment} from 'react';
import * as THREE from "three";
import './Release.css';
import SoundcloudPlayer from '../SoundcloudPlayer';
import Purchase from '../Purchase';
import debounce from "lodash/debounce";
import {assetPath} from "../Utils/assets";
import {FirstPersonControls} from '../Utils/FirstPersonControls';
import GLTFLoader from 'three-gltf-loader';

const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;

const assetPath4 = (p) => {
  return assetPath("4/" + p);
}

const assetPath4Videos = (p) => {
  return assetPath4("videos/" + p);
}

const assetPath4Models = (p) => {
  return assetPath4("models/" + p);
}

const assetPath4Images = (p) => {
  return assetPath4("images/" + p)
}

const makeSphere = (x) => {
  return new THREE.SphereBufferGeometry(x, x, x);
};


const SUN = {
  type: 'gltf',
  url: assetPath4Models('half_sub/scene.gltf'),
  position: [0, 0, 0],
  relativeScale: 5,
  rotateX: .01
}

const PLANETS = [
  // pluto
  {
    type: 'video',
    url: assetPath4Videos('myrtle-central-girl-notices-cat-er.webm'),
    geometry: makeSphere(20),
    position: [100, 100, 100],
    moons: [
      {
        type: 'gltf',
        url: assetPath4Models('simple_toilet_paper/scene.gltf'),
        position: [150, 100, 100],
        relativeScale: 2,
      }
    ]
  }
];

class Release0004Universe extends PureComponent {
  constructor() {
    super();
    this.startTime = new Date();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.camera = new THREE.PerspectiveCamera(80, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 3000);
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.quaternion = new THREE.Quaternion();

    this.clock = new THREE.Clock();
    let light0 = new THREE.HemisphereLight(0xffffff, 0x444444);
    light0.position.set(0,1000, 0);
    this.scene.add(light0);


    this.controls = new FirstPersonControls(this.camera);
    this.controls.lookSpeed = 0.08;
    this.controls.movementSpeed = 180;
    this.controls.enabled = true;
    this.controls.mouseMotionActive = false;

    // this.raycaster = new THREE.Raycaster();
    // this.mouse = new THREE.Vector3();
    this.wormholePath = undefined;
    this.cameraRadians = 0;
    var size = 2000;
    var divisions = 20;
    var gridHelper = new THREE.GridHelper( size, divisions );
    this.scene.add( gridHelper );
    this.bodegas = new THREE.Object3D();
  }

  componentDidMount() {
    window.addEventListener("resize", this.onWindowResize, false);
    this.renderer.domElement.addEventListener('click', this.onClick, false);
    this.renderer.domElement.addEventListener("load", this.onLoad, false);
    this.init();
    this.animate();
  }

  componentWillUnmount() {
    this.stop();
    window.removeEventListener("resize", this.onWindowResize, false);
    this.renderer.domElement.removeEventListener("click", this.onClick, false);
    this.renderer.domElement.removeEventListener("load", this.onLoad, false);
    this.container.removeChild(this.renderer.domElement);
  }

  init = () => {
    this.initObject(SUN);
    this.initPlanets();
    this.container.appendChild(this.renderer.domElement);
  }

  initCamera = () => {
    this.camera.position.x = -1000;
    this.camera.position.y = 1000;
    this.camera.position.z = 1000;
    this.camera.lookAt(...SUN.position);
  }

  onWindowResize = debounce(() => {
    this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    this.camera.updateProjectionMatrix();
  }, 50);

  onClick = (e) => {
    e.preventDefault();
  }

  onLoad = (event) => {
    console.log('loaded!')
  }

  stop = () => {
    cancelAnimationFrame(this.frameId);
  }

  // initialize an object of type 'gltf'
  initGLTF = (gltf) => {
    let {url, relativeScale, position, rotateX} = gltf;
    const loader = new GLTFLoader();
    loader.load(url, object => {
      gltf.object = object.scene;
      gltf.object.scale.multiplyScalar(gltf.relativeScale);
      gltf.object.position.set(...position);
      gltf.object.rotation.y = Math.sin(0.6);
      this.scene.add(gltf.object);
      let floaterChild = gltf.object.children[0];
      // floaterChild.geometry.computeBoundingBox();
      floaterChild.position.set(0, 0, 0);
      object.scene.scale.multiplyScalar(relativeScale);
      object.scene.position.set(...position);
      return object;
    });
  }

  //  initialize an object of type 'video'
  initImage = (image) => {
    let { geometry, url, position } = image;

    // create material from image texture
    var texture = new THREE.TextureLoader().load(url );
    texture.minFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;
    let material = new THREE.MeshBasicMaterial({map: texture});

    // create mesh from material and geometry
    let imageMesh = new THREE.Mesh(geometry, material);
    imageMesh.renderOrder = 1;

    // configure geometry
    geometry.scale(-1, 1, 1);
    imageMesh.rotation.y = Math.sin(0.6);
    imageMesh.position.set(...position);
    return imageMesh;
  }

  //  initialize an object of type 'video'
  initVideo = (video) => {
    let { geometry, url, position } = video;
    // initialize video element
    let videoElement = document.createElement('video');
    videoElement.src = url;
    videoElement.crossOrigin = 'anonymous';
    videoElement.loop = true;
    videoElement.muted = true;
    videoElement.playbackRate = 1;

    // create material from video texture
    let texture = new THREE.VideoTexture(videoElement);
    texture.minFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;
    let material = new THREE.MeshBasicMaterial({map: texture});


    // create mesh from material and geometry
    let videoMesh = new THREE.Mesh(geometry, material);
    videoMesh.renderOrder = 1;

    // configure geometry
    geometry.scale(-1, 1, 1);
    geometry.computeBoundingBox();

    // set output user data
    videoMesh.userData.type = 'video';
    videoMesh.userData.video = videoElement;
    videoMesh.userData.props = video;
    videoMesh.userData.texture = texture;
    videoMesh.position.set(...position);
    return videoMesh;
  }


  initObject = (obj) => {
    if (obj.type === 'gltf') {
      return this.initGLTF(obj);
    } else if (obj.type === 'video') {
      return this.initVideo(obj);
    } else if (obj.type === 'image') {
      return this.initImage(obj);
    }
  }

  initPlanet = (obj) => {
    let planet = this.initObject(obj);
    for (let i = 0; i < obj.moons.length; i++) {
      let moon = this.initObject(obj.moons[i]);
      this.scene.add(moon);
      planet.add(moon);
    }
    return planet;
  }

  initPlanets = () => {
    this.planets = new THREE.Object3D();
    for (let i = 0; i < PLANETS.length; i++) {
      this.planets.add(this.initPlanet(PLANETS[i]));
    }
    this.scene.add(this.planets);
  }

  updateMoons = () => {
    for (let i = 0; i < this.planets.children.length; i++) {
      let planet = this.planets.children[i];
      for (let j = 0; i < planet.children.length; j++) {
        let moon = planet.children[j];
        moon.rotation.y += 0.05;
      }
    }
  }

  animate = () => {
    this.frameId = window.requestAnimationFrame(this.animate);
    this.renderScene();
  }

  renderScene = () => {
    this.controls.update(this.clock.getDelta());
    this.updateMoons();
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <Fragment>
        <div className="release">
          <div ref={element => this.container = element}/>
        </div>
        <SoundcloudPlayer
        trackId='267037220'
        message='JON CANNON'
        inputRef={el => this.audioElement = el}
        fillColor="red"
        />
        <Purchase fillColor="red" href='https://gltd.bandcamp.com/track/lets-beach'/>
      </Fragment>
    );
  }
}

export default Release0004Universe;
