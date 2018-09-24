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
  relativeScale: 125,
  rotateX: .01
}

const PLANETS = [
  // 1
  {
    type: 'video',
    name: 'cat-girl-world',
    url: assetPath4Videos('myrtle-central-girl-notices-cat-er.webm'),
    geometry: makeSphere(100),
    position: [-800, 0, -800],
    playbackRate: 1,
    moons: [
      {
        type: 'gltf',
        name: 'cat-girl-moon',
        url: assetPath4Models('cardboard_box_sealed/scene.gltf'),
        position: [-800, 0, -1050],
        relativeScale: 20,
      }
    ]
  },
  // 2
  {
    type: 'video',
    name: 'broadway-bongs-video',
    url: assetPath4Videos('er-broadway-bongs.webm'),
    geometry: makeSphere(75),
    position: [800, 0, -200],
    playbackRate: 1,
    moons: [
      {
        type: 'gltf',
        name: 'vape-moon',
        url: assetPath4Models('vape/scene.gltf'),
        position: [800, 0, -450],
        relativeScale: 3,
      }
    ]
  },
  // 3
  {
    type: 'video',
    name: 'evergreen-bike-passing-newport-sign-video',
    url: assetPath4Videos('evergreen-bike-passing-newport-sign-er.webm'),
    geometry: makeSphere(200),
    position: [-500, 0, 900],
    playbackRate: 1,
    moons: [
      {
        type: 'gltf',
        name: 'cigarette-box-moon',
        url: assetPath4Models('marlboro_cigarettes/scene.gltf'),
        position: [-700, 0, 1150],
        relativeScale: 2,
      }
    ]
  },
  // 4
  {
    type: 'video',
    name: 'eric-mini-market-central-video',
    url: assetPath4Videos('er-eric-mini-market-central-ave.webm'),
    geometry: makeSphere(33),
    position: [-250, 0, -250],
    playbackRate: 1,
    moons: [
      {
        type: 'gltf',
        name: 'vape-moon',
        url: assetPath4Models('doritos/doritos_cool_ranch.gltf'),
        position: [-250, 0, -325],
        relativeScale: 1,
      }
    ]
  },
  // 5
  {
    type: 'video',
    name: 'myrtle-red-bull-fridge-video',
    url: assetPath4Videos('myrtle-red-bull-fridge-er.webm'),
    geometry: makeSphere(40),
    position: [800, 0, 800],
    playbackRate: 1,
    moons: [
      {
        type: 'gltf',
        name: 'soda-can-moon',
        url: assetPath4Models('soda_can/scene.gltf'),
        position: [700, 0, 700],
        relativeScale: 3,
      }
    ]
  },
  // 6
  {
    type: 'video',
    name: 'myrtle-omg-video',
    url: assetPath4Videos('myrtle-omg-er.webm'),
    geometry: makeSphere(120),
    position: [200, 0, 600],
    playbackRate: 1,
    moons: [
      {
        type: 'gltf',
        name: 'doritos-nacho-cheese-moon',
        url: assetPath4Models('doritos/doritos_nacho_cheese.gltf'),
        position: [200, 0, 350],
        relativeScale: 3,
      }
    ]
  },
  // 7
  {
    type: 'video',
    name: 'pomegranite-ice-box-video',
    url: assetPath4Videos('er-pomegranite-ice-box.webm'),
    geometry: makeSphere(100),
    position: [-900, 0, 300],
    playbackRate: 1,
    moons: [
      {
        type: 'gltf',
        name: 'drumstick-moon',
        url: assetPath4Models('drumstick/scene.gltf'),
        position: [-700, -50, 200],
        relativeScale: 33,
      }
    ]
  },
  // 8
  {
    type: 'video',
    name: 'broadway-big-boi-bitcoin-video',
    url: assetPath4Videos('broadway-big-boi-bitcoin-er.webm'),
    geometry: makeSphere(50),
    position: [100, 0, -500],
    playbackRate: 1,
    moons: []
  },
  // 9
  {
    type: 'video',
    name: 'day-and-night-pringles-video',
    url: assetPath4Videos('er-day-and-night-pringles.webm'),
    geometry: makeSphere(40),
    position: [300, 0, -200],
    playbackRate: 1,
    moons: [
      {
        type: 'gltf',
        name: 'drumstick-moon',
        url: assetPath4Models('pringles/scene.gltf'),
        position: [350, 0, -250],
        relativeScale: 0.25,
      }
    ]
  },
  // 10
  {
    type: 'video',
    name: 'day-and-night-pringles-video',
    url: assetPath4Videos('er-day-and-night-pringles.webm'),
    geometry: makeSphere(40),
    position: [-500, 0, -400],
    playbackRate: 1,
    moons: [
      {
        type: 'gltf',
        name: 'lighter-moon',
        url: assetPath4Models('a_lighter/scene.gltf'),
        position: [-600, 0, -300],
        relativeScale: 5,
      }
    ]
  },
  // 11
  {
    type: 'video',
    name: '99-cts-broadway-1-video',
    url: assetPath4Videos('er-99-cts-broadway-1.webm'),
    geometry: makeSphere(40),
    position: [-1000, 0, 1000],
    playbackRate: 1,
    moons: [
      {
        type: 'gltf',
        name: 'tp-moon',
        url: assetPath4Models('simple_toilet_paper/scene.gltf'),
        position: [-900, 0, 900],
        relativeScale: 10,
      }
    ]
  },
  // 12
  {
    type: 'video',
    name: 'johnson-roof-jon-phone-video',
    url: assetPath4Videos('johnson-roof-jon-phone-er.webm'),
    geometry: makeSphere(200),
    position: [1000, 0, -1000],
    playbackRate: 1,
    moons: [
      {
        type: 'gltf',
        name: 'beer-moon',
        url: assetPath4Models('german_beer_bottle_with_crown_cap/scene.gltf'),
        position: [800, 0, -800],
        relativeScale: 1,
      },
      {
        type: 'gltf',
        name: 'water-bottle-moon',
        url: assetPath4Models('water_bottle/scene.gltf'),
        position: [700, 0, -700],
        relativeScale: 100,
      }
    ]
  }
];

// define gltf loading manager
let manager = new THREE.LoadingManager();
manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
  // console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};
manager.onLoad = function ( ) {
  console.log( 'Loading complete!');
};
manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
  // console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

};
manager.onError = function ( url ) {
  // console.log( 'There was an error loading ' + url );
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
    this.camera.position.x = -1000;
    this.camera.position.y = -1000;
    this.camera.position.z = 500;
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
        // if (moon !== undefined) {
        //   let time = Date.now() * 0.0005;
        //   moon.scene.rotation.x = Math.cos( time * 10 ) * 5;
        // }
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
