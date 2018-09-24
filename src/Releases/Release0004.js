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
const CAMERA_SPEED = 0.00029;
const FIRST_PERSON_CONTROL_SPEED = 0.07;
const STARTING_POINT = [-875, 0, -875];
const VIDEO_STATE_PLAYING = 'playing';
const VIDEO_STATE_PAUSED = 'paused';
const MIND_STATE_CHILLIN_THRESHOLD = 10;
const MIND_STATE_CHILLIN = 'chillin';
const MIND_STATE_EXITING = 'exiting';
const MIND_STATE_FLYING = 'flying';


const assetPath4 = (p) => {
  return assetPath("4/" + p);
}

const assetPath4Videos = (p) => {
  return assetPath4("videos/" + p);
}

const assetPath4Objects = (p) => {
  return assetPath4("objects/" + p);
}

const makeSphere = (x) => {
  return new THREE.SphereBufferGeometry(x, x, x);
};


const SUN = {
  type: 'gltf',
  name: 'sun',
  url: assetPath4Objects('half_sub/scene.gltf'),
  position: [0, 0, 0],
  relativeScale: 125,
  rotateX: .01
}

const ASTEROIDS = [
  {
    type: 'gltf',
    name: 'chip-asteroid',
    url: assetPath4Objects('potato_chip/scene.gltf'),
    position: [-300, -100, 500],
    rotateX: 0.01,
    rotateY: 0.005,
    rotateZ: -0.001,
    relativeScale: 100,
  },
  {
    type: 'gltf',
    name: 'cat-asteroid',
    url: assetPath4Objects('cat_low_polygon_art_farm_animal/scene.gltf'),
    position: [0, 500, 1200],
    rotateX: 0.005,
    rotateY: -0.05,
    rotateZ: 0.01,
    relativeScale: 5,
  },
  {
    type: 'gltf',
    name: 'cig-asteroid',
    url: assetPath4Objects('cigarette/scene.gltf'),
    position: [0, 200, -800],
    rotateX: 0.001,
    rotateY: -0.005,
    rotateZ: 0.01,
    relativeScale: 50,
  }
]

const PLANETS = [
  // 1
  {
    type: 'video',
    name: 'cat-girl-world',
    url: assetPath4Videos('myrtle-central-girl-notices-cat-er.webm'),
    geometry: makeSphere(60),
    position: [-800, 0, -800],
    playbackRate: 1,
    loop: true,
    invert: true,
    volume: 0.005,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.005,
    moons: [
      {
        type: 'gltf',
        theta: 0.01,
        name: 'cardboard-box-moon',
        url: assetPath4Objects('cardboard_box_sealed/scene.gltf'),
        position: [-800, 0, -1050],
        relativeScale: 25,
      }
    ]
  },
  // 2
  {
    type: 'video',
    name: 'broadway-bongs-video',
    url: assetPath4Videos('er-broadway-bongs.webm'),
    geometry: makeSphere(75),
    position: [800, -100, -200],
    playbackRate: 1,
    loop: true,
    invert: true,
    volume: 0.01,
    muted: true,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.007,
    moons: [
      {
        type: 'gltf',
        theta: 0.01,
        name: 'vape-moon',
        url: assetPath4Objects('vape/scene.gltf'),
        position: [800, -100, -450],
        relativeScale: 3.5,
      }
    ]
  },
  // 3
  {
    type: 'video',
    name: 'evergreen-bike-passing-newport-sign-video',
    url: assetPath4Videos('evergreen-bike-passing-newport-sign-er.webm'),
    geometry: makeSphere(200),
    position: [-500, 200, 900],
    playbackRate: 1,
    loop: true,
    invert: true,
    volume: 0.01,
    muted: true,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.005,
    moons: [
      {
        type: 'gltf',
        theta: 0.01,
        name: 'cigarette-box-moon',
        url: assetPath4Objects('marlboro_cigarettes/scene.gltf'),
        position: [-800, 200, 1150],
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
    position: [-250, -200, -250],
    playbackRate: 1,
    loop: true,
    invert: true,
    volume: 0.01,
    muted: true,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.005,
    moons: [
      {
        type: 'gltf',
        theta: 0.01,
        name: 'cool-ranch-moon',
        url: assetPath4Objects('doritos/doritos_cool_ranch.gltf'),
        position: [-250, -200, -325],
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
    position: [800, 300, 800],
    playbackRate: 1,
    loop: true,
    invert: true,
    volume: 0.01,
    muted: true,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.01,
    moons: [
      {
        type: 'gltf',
        theta: 0.01,
        name: 'soda-can-moon',
        url: assetPath4Objects('soda_can/scene.gltf'),
        position: [700, 300, 700],
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
    position: [200, -300, 600],
    playbackRate: 1,
    loop: true,
    invert: true,
    volume: 0.01,
    muted: true,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.005,
    moons: [
      {
        type: 'gltf',
        theta: 0.01,
        name: 'doritos-nacho-cheese-moon',
        url: assetPath4Objects('doritos/doritos_nacho_cheese.gltf'),
        position: [200, -300, 350],
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
    position: [-900, 200, 300],
    playbackRate: 1,
    loop: true,
    invert: true,
    volume: 0.01,
    muted: true,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.03,
    moons: [
      {
        type: 'gltf',
        theta: 0.01,
        name: 'drumstick-moon',
        url: assetPath4Objects('drumstick/scene.gltf'),
        position: [-700, 200, 200],
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
    position: [100, -550, -500],
    playbackRate: 1,
    loop: true,
    invert: true,
    volume: 0.01,
    muted: true,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.005,
    moons: []
  },
  // 9
  {
    type: 'video',
    name: 'day-and-night-pringles-video',
    url: assetPath4Videos('er-day-and-night-pringles.webm'),
    geometry: makeSphere(40),
    position: [300, 150, -200],
    playbackRate: 1,
    loop: true,
    invert: true,
    volume: 0.01,
    muted: true,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.005,
    moons: [
      {
        type: 'gltf',
        theta: 0.01,
        name: 'pringles-moon',
        url: assetPath4Objects('pringles/scene.gltf'),
        position: [350, 150, -250],
        relativeScale: 0.25,
      }
    ]
  },
  // 10
  {
    type: 'video',
    name: 'cholulita-bite-video',
    url: assetPath4Videos('er-cholulita-bite.webm'),
    geometry: makeSphere(40),
    position: [-500, -100, -400],
    playbackRate: 1,
    loop: true,
    invert: true,
    volume: 0.01,
    muted: true,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.005,
    moons: [
      {
        type: 'gltf',
        theta: 0.01,
        name: 'hot-sauce-moon',
        url: assetPath4Objects('hot_sauce/scene.gltf'),
        position: [-600, -50, -300],
        relativeScale: 20,
      }
    ]
  },
  // 11
  {
    type: 'video',
    name: '99-cts-broadway-1-video',
    url: assetPath4Videos('er-99-cts-broadway-1.webm'),
    geometry: makeSphere(40),
    position: [300, 450, 300],
    playbackRate: 1,
    loop: true,
    invert: true,
    volume: 0.01,
    muted: true,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.005,
    moons: [
      {
        type: 'gltf',
        theta: 0.01,
        name: 'tp-moon',
        url: assetPath4Objects('simple_toilet_paper/scene.gltf'),
        position: [-350, 450, -350],
        relativeScale: 20,
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
    loop: true,
    invert: true,
    volume: 0.01,
    muted: true,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.005,
    moons: [
      {
        type: 'gltf',
        theta: 0.01,
        name: 'water_bottle-moon',
        url: assetPath4Objects('water_bottle/scene.gltf'),
        position: [800, 0, -800],
        relativeScale: 1,
      }
    ]
  }
];

class Release0004 extends PureComponent {
  constructor() {
    super();
    this.startTime = new Date();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.camera = new THREE.PerspectiveCamera(80, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 3000);
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

    this.clock = new THREE.Clock();
    let light0 = new THREE.HemisphereLight(0xffffff, 0x444444);
    light0.position.set(0, 1000, 0);
    let light1 = new THREE.HemisphereLight(0xffffff, 0x444444);
    light1.position.set(1000, 0, 1000);
    this.scene.add(light1);
    let light2 = new THREE.HemisphereLight(0xffffff, 0x444444);
    light2.position.set(500, -1000, 500);
    this.scene.add(light2);

    this.controls = new FirstPersonControls(this.camera);
    this.controls.lookSpeed = FIRST_PERSON_CONTROL_SPEED;
    this.controls.movementSpeed = 200;
    this.controls.enabled = true;
    this.controls.mouseMotionActive = false;

    // this.raycaster = new THREE.Raycaster();
    // this.mouse = new THREE.Vector3();
    this.quaternion = new THREE.Quaternion();
    this.raycaster = new THREE.Raycaster()
    this.path = undefined;
    this.cameraRadians = 0;
    this.initLoader();
    this.objects = {};
  }

  state = {
    curPlanetIdx: 0,
    prevPlanetIdx: 0,
    curVideoState: VIDEO_STATE_PAUSED,
    mindState: MIND_STATE_FLYING,
    hasChilled: false,
    isLoaded: false
  }

  initLoader = () => {
    // define gltf loading manager
    this.manager = new THREE.LoadingManager();
    this.manager.onStart = ( url, itemsLoaded, itemsTotal ) => {
      // console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    };
    this.manager.onLoad = ( ) => {
      this.setState({isLoaded: true});
    };
    this.manager.onProgress = ( url, itemsLoaded, itemsTotal ) => {
      console.log( 'Loaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    };
    this.manager.onError = ( url ) => {
      // console.log( 'There was an error loading ' + url );
    };
    this.loader = new GLTFLoader( this.manager );
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
    this.initAsteroids();
    this.initPath();
    this.container.appendChild(this.renderer.domElement);
    this.playCurPlanet();
    this.lookAtCurPlanet();
  }


  onWindowResize = debounce(() => {
    this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    this.camera.updateProjectionMatrix();
  }, 50);

  onClick = (e) => {
    e.preventDefault();
    if (this.state.mindState === MIND_STATE_CHILLIN) {
      this.setState({
        mindState: MIND_STATE_EXITING,
        prevPlanetIdx: this.state.curPlanetIdx,
        curPlanetIdx: this.state.curPlanetIdx + 1 === PLANETS.length ? 0 : this.state.curPlanetIdx + 1
      })
    }
  }

  onLoad = (event) => {
    console.log('loaded!')
  }

  stop = () => {
    cancelAnimationFrame(this.frameId);
    // RE: https://stackoverflow.com/questions/20997669/memory-leak-in-three-js
    for (let i = 0; i < this.scene.children.length; i++) {
      this.scene.remove(this.scene.children[i]);
      this.renderer.deallocateObject(this.scene.children[i]);
    }
  }

  addObjectToScene = (obj) => {
    this.scene.add(obj.scene);
    this.objects[obj.name] = obj;
  }

  initPath = () => {
    // add starting point
    let pathVertices = [new THREE.Vector3(...STARTING_POINT)];
    for (let i = 0; i < PLANETS.length; i++) {
      if (i !== PLANETS.length-1) {
        pathVertices.push(new THREE.Vector3(...PLANETS[i].position));
      }
    }
    // add sun and asteroids
    pathVertices.push(new THREE.Vector3(0, 0, 0));
    for (let i = 0; i < ASTEROIDS.length; i++) {
      pathVertices.push(new THREE.Vector3(...ASTEROIDS[i].position));
    }
    pathVertices.push(new THREE.Vector3(...PLANETS[PLANETS.length-1].position));
    this.path = new THREE.CatmullRomCurve3(pathVertices);
    this.path.closed = true;
    this.path.arcLengthDivisions = PLANETS.length;
    // this.visualizePath();
  }

  visualizePath = () => {
    // let points = this.wormholePath.getElementsByTagName('')Points(this.wormholePath.arcLengthDivisions);
    let geometry = new THREE.Geometry();
    // let texture = new THREE.TextureLoader().load(assetPath4Images('kitkat.png'));
    // let material = new THREE.MeshBasicMaterial( { map: texture } );
    // console.log(material);
    geometry.vertices = this.path.getSpacedPoints(100);//this.wormholePath.arcLengthDivisions);
    let material = new THREE.LineBasicMaterial({color: 0xff0000});
    let curveObject = new THREE.Line(geometry, material);
    this.scene.add(curveObject);
  };

  initObject = (obj) => {
    let output;
    if (obj.type === 'gltf') {
      output = loadGLTF({...obj, loader: this.loader, onSuccess: (x) => {this.addObjectToScene(x)} });
    } else if (obj.type === 'video') {
      output = loadVideo({...obj, computeBoundingSphere: true});
      this.scene.add(output);
      this.objects[obj.name] = output;
    } else if (obj.type === 'image') {
      output = loadImage(obj);
      this.scene.add(output);
      this.objects[obj.name] = output;
    }
    output = this.objects[obj.name];
    return output;
  }

  initAsteroids = () => {
    for (let i = 0; i < ASTEROIDS.length; i++) {
      this.initObject(ASTEROIDS[i]);
    }
  }

  // planet utils

  initPlanet = (obj) => {
    this.initObject(obj);
    for (let i = 0; i < obj.moons.length; i++) {
      this.initObject(obj.moons[i]);
    }
  }

  initPlanets = () => {
    for (let i = 0; i < PLANETS.length; i++) {
      this.initPlanet(PLANETS[i]);
    }
  }

  getPlanetByIdx = (idx) => {
    return this.objects[PLANETS[idx].name];
  }

  getCurPlanet = () => {
    return this.getPlanetByIdx(this.state.curPlanetIdx);
  }

  lookAtCurPlanet = () => {
    let curPlanet = this.getCurPlanet();
    this.camera.lookAt(curPlanet.position);
  }

  getPrevPlanet = () => {
    return this.getPlanetByIdx(this.state.prevPlanetIdx);
  }

  playCurPlanet = () => {
     this.getCurPlanet().userData.video.play();
  }

  pausePrevPlanet = () => {
    this.getPrevPlanet().userData.video.pause();
  }

  pausePlanets = () => {
    for (var i = 0; i < PLANETS.length; i++) {
      if (i !== this.state.prevPlanetIdx) {
        this.getPlanetByIdx(i).userData.video.pause();
      }
    }
  }

  // updaters
  updateSun = () => {
    let sun = this.objects[SUN.name];
    if (sun !== undefined) {
      sun.scene.rotation.x += 0.01
    }
  }

  updateAsteroids = () => {
    for (let i = 0; i < ASTEROIDS.length; i++) {
      let asteroid = this.objects[ASTEROIDS[i].name];
      if (asteroid !== undefined) {
        asteroid.scene.rotation.x += ASTEROIDS[i].rotateX;
        asteroid.scene.rotation.y += ASTEROIDS[i].rotateY;
        asteroid.scene.rotation.z += ASTEROIDS[i].rotateZ;
      }
    }
  }

  updatePlanets = () => {
    for (let i = 0; i < PLANETS.length; i++) {
     let planet = this.getPlanetByIdx(i);
      this.quaternion.setFromAxisAngle(PLANETS[i].axis, PLANETS[i].angle);
      planet.applyQuaternion(this.quaternion);
    }
  }

  updateMoons = () => {
    for (let i = 0; i < PLANETS.length; i++) {
      let planet = PLANETS[i];
      for (let j = 0; j < planet.moons.length; j++) {
        let moonName = planet.moons[j].name;
        let moon = this.objects[moonName];
        if (moon !== undefined) {
          let position = new THREE.Vector3(...planet.position);
          let axis = new THREE.Vector3(1, 0, 0);
          let pointIsWorld = true;// false;
          this.rotateAboutPoint(
            moon.scene.children[0],
            position,
            axis,
            planet.moons[j].theta,
            pointIsWorld);
        }
      }
    }
  }

  isCameraInObject = (obj) => {
    this.raycaster.set(this.camera.position, new THREE.Vector3(1,1,1));
    let intersects = this.raycaster.intersectObject(obj);
    if( intersects.length %2 === 1) { // Points is in objet
      return true;
    } else {
      return false;
    }
  }

  updateCameraPos = () => {
    let curPlanet = this.getCurPlanet();
    let prevPlanet = this.getPrevPlanet();
    let distanceFromPlanet = this.camera.position.distanceTo(curPlanet.position);

    // have we arrived at the next Planet?
    // todo: fix this constant
    if (distanceFromPlanet < MIND_STATE_CHILLIN_THRESHOLD &&
      this.state.mindState !== MIND_STATE_EXITING &&
      this.state.mindState !== MIND_STATE_CHILLIN) {
      this.setState({mindState: MIND_STATE_CHILLIN, hasChilled: true});

    }
    // are we in transit ?
    if (this.state.mindState !== MIND_STATE_CHILLIN) {

      // check if we're exiting the previous Planet
      if (this.state.mindState !== MIND_STATE_FLYING) {
        if (this.state.curVideoState !== VIDEO_STATE_PLAYING) {
          this.pausePlanets();
          this.playCurPlanet();
          this.setState({curVideoState: VIDEO_STATE_PLAYING});
          this.setState({
            curVideoState: VIDEO_STATE_PAUSED,
            mindState: MIND_STATE_FLYING
          });
        }
      }
      // advance
      this.cameraRadians += CAMERA_SPEED;
      let holePos = this.path.getPoint(this.cameraRadians);
      this.camera.position.set(holePos.x, holePos.y, holePos.z);
    }
  }

  rotateAboutPoint = (obj, point, axis, theta, pointIsWorld) => {
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
    if (this.state.isLoaded) {
      this.controls.update(this.clock.getDelta());
      this.updateSun();
      this.updatePlanets();
      this.updateMoons();
      this.updateAsteroids();
      this.updateCameraPos();
      this.renderer.render(this.scene, this.camera);
    }
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
        fillColor="white"
        />
        <Purchase fillColor="white" href='https://gltd.bandcamp.com/track/lets-beach'/>
      </Fragment>
    );
  }
}

export default Release0004;
