import React, {PureComponent, Fragment} from 'react';
import * as THREE from "three";
import './Release.css';
import SoundcloudPlayer from '../SoundcloudPlayer';
import Purchase from '../Purchase';
import debounce from "lodash/debounce";
import {assetPath} from "../Utils/assets";
import {FirstPersonControls} from '../Utils/FirstPersonControls';
import {loadVideo, loadImage, loadGLTF} from '../Utils/Loaders';
import GLTFLoader from 'three-gltf-loader';

const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
const GRID_SIZE = 10;

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

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const getRandomZPosition = () => {
  return getRandomInt(GRID_SIZE * 2) - GRID_SIZE;
};

const SUN = {
  type: 'gltf',
  name: 'sun',
  url: assetPath4Models('half_sub/scene.gltf'),
  position: [0, 0, 0],
  relativeScale: 5,
  rotateX: .01
}

const PLANETS = [
  // pluto
  {
    type: 'video',
    name: 'cat-girl-world',
    url: assetPath4Videos('myrtle-central-girl-notices-cat-er.webm'),
    geometry: makeSphere(10),
    position: [-80, -80, 5],
    playbackRate: 1,
    moons: [
      {
        type: 'gltf',
        name: 'cat-girl-moon',
        url: assetPath4Models('cardboard_box_sealed/scene.gltf'),
        position: [-90, -90, 5],
        relativeScale: 1,
      },
      {
        type: 'gltf',
        name: 'cat-girl-potato-chip-moon',
        url: assetPath4Models('potato_chip/scene.gltf'),
        position: [-80, -70, 5],
        relativeScale: 1,
      }
    ]
  }
];

// define gltf loading manager
let manager = new THREE.LoadingManager();
manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
  console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};
manager.onLoad = function ( ) {
  console.log( 'Loading complete!');
};
manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
  console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

};
manager.onError = function ( url ) {
  console.log( 'There was an error loading ' + url );
};

// define gltf loader
let loader = new GLTFLoader( manager );

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
    light0.position.set(0, 1000, 0);
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
    this.objects = {};
    this.state = {isLoaded: false};
  }

  componentDidMount() {
    window.addEventListener("resize", this.onWindowResize, false);
    this.renderer.domElement.addEventListener("click", this.onClick, false);
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
    this.camera.position.x = -100;
    this.camera.position.y = -100;
    this.camera.position.z = 5;
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

  addObjectToScene = (obj) => {
    console.log('adding object', obj.name)
    this.scene.add(obj.scene);
    this.objects[obj.name] = obj;
  }

  initObject = (obj) => {
    let output;
    if (obj.type === 'gltf') {
      output = loadGLTF({...obj, loader: loader, onSuccess: (x) => {this.addObjectToScene(x)} });
    } else if (obj.type === 'video') {
      output = loadVideo(obj);
      this.scene.add(output);
    } else if (obj.type === 'image') {
      output = loadImage(obj);
      this.scene.add(output);
    }
    output = this.objects[obj.name];
    return output;
  }

  initPlanet = (obj) => {
    let planet = this.initObject(obj);

    for (let i = 0; i < obj.moons.length; i++) {



      this.initObject(obj.moons[i]);
    }
    return planet;
  }

  initPlanets = () => {
    this.planets = new THREE.Object3D();
    for (let i = 0; i < PLANETS.length; i++) {
      this.initPlanet(PLANETS[i]);
    }
  }

  updateMoons = () => {
    for (let i = 0; i < PLANETS.length; i++) {
      let planet = PLANETS[i];
      for (let j = 0; j < planet.moons.length; j++) {
        let moonName = planet.moons[j].name;
        let moon = this.objects[moonName];
        if (moon !== undefined) {
          if (planet.geometry.radius === undefined) {
            planet.geometry.computeBoundingSphere();
          }
          let position = new THREE.Vector3(
            planet.position[0],
            planet.position[1],
            planet.position[2]);
          let axis = new THREE.Vector3(1, 1, 1);
          let theta = .01;
          let pointIsWorld = true;// false;
          this.rotateAboutPoint(
            moon.scene.children[0],
            position,
            axis,
            theta,
            pointIsWorld);
        }
      }
    }
  }

  rotateAboutPoint = (obj, point, axis, theta, pointIsWorld) =>{
    pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

    if(pointIsWorld){
      obj.parent.localToWorld(obj.position); // compensate for world coordinate
    }

    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset

    if(pointIsWorld){
      obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
    }

    obj.rotateOnAxis(axis, theta); // rotate the OBJECT
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
