import React, {PureComponent, Fragment} from 'react';
import * as THREE from "three";
import './Release.css';
import SoundcloudPlayer from '../SoundcloudPlayer';
import Purchase from '../Purchase';
import AudioStreamer from "../Utils/Audio/AudioStreamer";
import {OrbitControls} from "../Utils/OrbitControls";
import {PointerLockControls} from "../Utils/PointerLockControls.js"
import {isMobile} from "../Utils/BrowserDetection";
import debounce from "lodash/debounce";
import {assetPath} from "../Utils/assets";
import * as CANNON from "cannon";
import {CannonDebugRenderer} from "../Utils/CannonDebugRenderer";
import {FBXLoader} from "../Utils/FBXLoader";

const BPM = 130;
const RANGE = 1000;
const BEAT_TIME = (60 / BPM);
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

const MAX_VELOCITY = 10;
const MIN_VELOCITY = -10;

const CRAZY_GREEN_BODEGA_IDX = 1;

const BODEGAS = [
  {
    src: assetPath4Videos('er-99-cts-broadway-1.webm'),
    geometry: new THREE.SphereBufferGeometry(120 * Math.random(), 120 * Math.random(), 120 * Math.random()),
    position: [500, 0, 0],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.01,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  {
    src: assetPath4Videos('er-bag-1.webm'),
    geometry: new THREE.SphereBufferGeometry(5000 * Math.random(), 120 * Math.random(), 120 * Math.random()),
    position: [-500, 0, 0],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.01,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  {
    src: assetPath4Videos('er-bodega-chill-2.webm'),
    geometry: new THREE.SphereBufferGeometry(120 * Math.random(), 120 * Math.random(), 120 * Math.random()),
    position: [0, 500, 0],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.01,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  {
    src: assetPath4Videos('er-big-boi-bitcoin-brian.webm'),
    geometry: new THREE.SphereBufferGeometry(120 * Math.random(), 120 * Math.random(), 120 * Math.random()),
    position: [0, -500, 0],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.01,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  {
    src: assetPath4Videos('er-cholulita-bite.webm'),
    geometry: new THREE.SphereBufferGeometry(120 * Math.random(), 120 * Math.random(), 120 * Math.random()),
    position: [0, 0, 500],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.01,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  {
    src: assetPath4Videos('er-broadway-tvs-n-elbows.webm'),
    geometry: new THREE.SphereBufferGeometry(120 * Math.random(), 120 * Math.random(), 120 * Math.random()),
    position: [0, 0, -500],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.01,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  {
    src: assetPath4Videos('er-broadway-spread.webm'),
    geometry: new THREE.SphereBufferGeometry(120 * Math.random(), 120 * Math.random(), 120 * Math.random()),
    position: [250, 0, 0],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(1, 0, 0).normalize(),
    angle: 0.01,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  {
    src: assetPath4Videos('er-broadway-bongs.webm'),
    geometry: new THREE.SphereBufferGeometry(120 * Math.random(), 120 * Math.random(), 120 * Math.random()),
    position: [-250, 0, 0],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(1, 0, 0).normalize(),
    angle: 0.01,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  {
    src: assetPath4Videos('er-broadway-fridge-door.webm'),
    geometry: new THREE.SphereBufferGeometry(120 * Math.random(), 120 * Math.random(), 120 * Math.random()),
    position: [0, 250, 0],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(1, 0, 0).normalize(),
    angle: 0.01,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  {
    src: assetPath4Videos('er-day-and-night-pringles.webm'),
    geometry: new THREE.SphereBufferGeometry(120 * Math.random(), 120 * Math.random(), 120 * Math.random()),
    position: [0, -250, 0],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.01,
    visible: false,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  {
    src: assetPath4Videos('er-eric-mini-market-central-ave.webm'),
    geometry: new THREE.SphereBufferGeometry(120 * Math.random(), 120 * Math.random(), 120 * Math.random()),
    position: [0, 0, 250],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.01,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  {
    src: assetPath4Videos('er-broadway-bougie-ceiling-fan.webm'),
    geometry: new THREE.SphereBufferGeometry(120 * Math.random(), 120 * Math.random(), 120 * Math.random()),
    position: [250, 250, 0],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.01,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  {
    src: assetPath4Videos('er-mr-kiwi-cat-in-the-cabbage.webm'),
    geometry: new THREE.SphereBufferGeometry(120 * Math.random(), 120 * Math.random(), 120 * Math.random()),
    position: [-250, 250, 0],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(0, 0, 1).normalize(),
    angle: 0.01,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  {
    src: assetPath4Videos('er-pomegranite-deli.webm'),
    geometry: new THREE.SphereBufferGeometry(120 * Math.random(), 120 * Math.random(), 120 * Math.random()),
    position: [-250, -250, 0],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(0, 0, 1).normalize(),
    angle: 0.01,
    visible: false,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  {
    src: assetPath4Videos('er-99-cts-broadway-5.webm'),
    geometry: new THREE.SphereBufferGeometry(120 * Math.random(), 120 * Math.random(), 120 * Math.random()),
    position: [-250, -250, 0],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(0, 0, 1).normalize(),
    angle: 0.01,
    visible: false,
    color: 0xFFFFFF,
    playbackRate: 1
  }
];

const FLOATERS = [
  {
    url: assetPath4Models('Doritos_01.fbx'),
    mass: 1,
    relativeScale: 1,
    object: undefined,
    physics: undefined,
    bbox: undefined,
  },
  {
    url: assetPath4Models('Doritos_02.fbx'),
    mass: 1,
    relativeScale: 1,
    object: undefined,
    physics: undefined,
    bbox: undefined,
  },
  {
    url: assetPath4Models('Doritos_03.fbx'),
    mass: 1,
    relativeScale: 1,
    object: undefined,
    physics: undefined,
    bbox: undefined,
  },
  {
    url: assetPath4Models('Doritos_04.fbx'),
    mass: 1,
    relativeScale: 1,
    object: undefined,
    physics: undefined,
    bbox: undefined,
  },
  {
    url: assetPath4Models('Doritos_05.fbx'),
    mass: 1,
    relativeScale: 1,
    object: undefined,
    physics: undefined,
    bbox: undefined,
  },
  {
    url: assetPath4Models('Doritos_06.fbx'),
    mass: 1,
    relativeScale: 1,
    object: undefined,
    physics: undefined,
    bbox: undefined,
  },
  {
    url: assetPath4Models('Doritos_06.fbx'),
    mass: 5,
    relativeScale: 1,
    object: undefined,
    physics: undefined,
    bbox: undefined,
  }, /////////// REPEAT STARTS HERE
  {
    url: assetPath4Models('Doritos_01.fbx'),
    mass: 1,
    relativeScale: 1,
    object: undefined,
    physics: undefined,
    bbox: undefined,
  },
  {
    url: assetPath4Models('Doritos_02.fbx'),
    mass: 1,
    relativeScale: 1,
    object: undefined,
    physics: undefined,
    bbox: undefined,
  },
  {
    url: assetPath4Models('Doritos_03.fbx'),
    mass: 1,
    relativeScale: 1,
    object: undefined,
    physics: undefined,
    bbox: undefined,
  },
  {
    url: assetPath4Models('Doritos_04.fbx'),
    mass: 1,
    relativeScale: 1,
    object: undefined,
    physics: undefined,
    bbox: undefined,
  },
  {
    url: assetPath4Models('Doritos_05.fbx'),
    mass: 1,
    relativeScale: 1,
    object: undefined,
    physics: undefined,
    bbox: undefined,
  },
  {
    url: assetPath4Models('Doritos_06.fbx'),
    mass: 1,
    relativeScale: 1,
    object: undefined,
    physics: undefined,
    bbox: undefined,
  },
  {
    url: assetPath4Models('Doritos_06.fbx'),
    mass: 5,
    relativeScale: 1,
    object: undefined,
    physics: undefined,
    bbox: undefined,
  },
  {
    url: assetPath4Models('Doritos_01.fbx'),
    mass: 1,
    relativeScale: 1,
    object: undefined,
    physics: undefined,
    bbox: undefined,
  }
];

class Release0004Video extends PureComponent {
  constructor() {
    super();
    this.startTime = new Date();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.camera = new THREE.PerspectiveCamera(80, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 3000);
    this.camera.position.x = 200;
    this.camera.position.y = 600;
    this.camera.position.z = 1000;
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.quaternion = new THREE.Quaternion();

    let light0 = new THREE.HemisphereLight(0xffffff, 0x444444);
    light0.position.set(0, 200, 0);
    this.scene.add(light0);

    // this.controls = new PointerLockControls( this.camera );
    // this.controls.enabled = true;
    // this.scene.add( this.controls.getObject() );
    // this.controls = new OrbitControls(this.camera);
    // this.controls.screenSpacePanning = true;
    // this.controls.autoRotate = false;
    // this.controls.enablePan = true;
    // this.controls.enableZoom = false;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector3();
    this.curBodegaIdx = 0;
    this.prevBodegaIdx = -1;
    this.wormholePath = undefined;
    this.cameraRadians = 0;
    // var size = 2000;
    // var divisions = 200;
    // var gridHelper = new THREE.GridHelper( size, divisions );
    // this.scene.add( gridHelper );
    this.bodegas = new THREE.Object3D();
  }

  state = {
    inWormhole: false
  }

  componentDidMount() {
    window.addEventListener("resize", this.onWindowResize, false);
    window.addEventListener('mousedown', this.onMouseDown, false);
    window.addEventListener("load", this.onLoad, false);
    this.init();
    this.animate();
  }

  componentWillUnmount() {
    this.stop();
    window.removeEventListener("resize", this.onWindowResize, false);
    window.removeEventListener('mousedown', this.onMouseDown, false);
    window.removeEventListener("load", this.onLoad, false);
    this.container.removeChild(this.renderer.domElement);
  }

  init = () => {
    this.initCannon();
    this.initWormholePath();
    this.initFloaters();
    this.initBodegas();
    this.container.appendChild(this.renderer.domElement);
  }

  onWindowResize = debounce(() => {
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;
    this.renderer.setSize(WIDTH, HEIGHT);
    this.camera.aspect = WIDTH / HEIGHT;
    this.camera.updateProjectionMatrix();
  }, 50);

  onMouseDown = (e) => {
    this.enterWormhole();
  }

  onLoad = (event) => {
    console.log('loaded!')
  }

  stop = () => {
    cancelAnimationFrame(this.frameId);
    this.deallocateBodegas();
  }

  initCannon = () => {
    this.timeStep = 1 / 30;
    this.world = new CANNON.World();
    this.world.gravity.set(0, 0, 0);
    this.world.broadphase = new CANNON.NaiveBroadphase();
    this.world.solver.iterations = 1;
    this.cannonDebugRenderer = new CannonDebugRenderer(this.scene, this.world);
  }

  initFloaters = () => {
    let floaterPositions = this.wormholePath.getPoints(FLOATERS.length);
    for (let i = 0; i < FLOATERS.length; i++) {
      this.initFloater(FLOATERS[i], floaterPositions[i]);
    }
  }


  initFloater = (floater, floaterPos) => {
    let loader = new FBXLoader();
    loader.load(floater.url, object => {
      floater.object = object;
      floater.object.scale.multiplyScalar(floater.relativeScale);
      floater.object.position.set(floaterPos.x, floaterPos.y, floaterPos.z);
      this.scene.add(floater.object);
      let floaterChild = floater.object.children[0];
      floaterChild.geometry.computeBoundingBox();
      floaterChild.position.set(0, 0, 0);//floaterPos.x, floaterPos.y, floaterPos.z);
      let floaterSize = floaterChild.geometry.boundingBox.getSize();
      let physicsSize = new CANNON.Vec3(floaterSize.x / 2.0, floaterSize.y / 2.0, floaterSize.z / 2.0);
      let shape = new CANNON.Box(physicsSize);
      let mass = floater.mass;
      let material = new CANNON.Material();
      floater.physics = new CANNON.Body({
        mass: mass,
        material: material,
        position: new CANNON.Vec3(floaterPos.x, floaterPos.y, floaterPos.z)
      });

      floater.physics.addShape(shape);
      let polarity = THREE.Math.randInt(-1, 1) > 0 ? 1 : -1;
      let velocityUnit = 1;
      let velocity = polarity * velocityUnit;
      floater.physics.velocity.set(velocity, velocity, velocity);
      floater.physics.linearDamping = 0.01;
      floater.physics.angularVelocity.set(velocity, velocity, velocity );
      floater.physics.angularDamping = 0.5;
      this.world.addBody(floater.physics);


      // create physics bounding box
      let pos = floater.object.position;
      let boxSize = 30;
      floater.bbox = new THREE.Box3(
        new THREE.Vector3(
          -Math.abs(pos.x - boxSize),
          -Math.abs(pos.y - boxSize),
          -Math.abs(pos.z - boxSize)
        ),
        new THREE.Vector3(
          Math.abs(pos.x + boxSize),
          Math.abs(pos.y + boxSize),
          Math.abs(pos.z + boxSize)
        )
      )
    });
  }

  initWormholePath = () => {
    let pathVertices = [];
    let numPathVertices = 30;
    let maxVertexDistance = 240;
    pathVertices.push(new THREE.Vector3(0, 0, 0));
    for (let i = 1; i < numPathVertices; i++) {
      let prevPos = pathVertices[i - 1];
      let randVect3 = new THREE.Vector3(
        THREE.Math.randInt(prevPos.x - maxVertexDistance, prevPos.x + maxVertexDistance),
        THREE.Math.randInt(prevPos.y - maxVertexDistance, prevPos.y + maxVertexDistance),
        THREE.Math.randInt(prevPos.z - maxVertexDistance, prevPos.z + maxVertexDistance)
      );
      pathVertices.push(randVect3)
    }
    this.wormholePath = new THREE.CatmullRomCurve3(pathVertices);
    this.wormholePath.closed = true;
    this.wormholePath.arcLengthDivisions = numPathVertices;
    // this.visualizeWormhole(); // for devving
  }

  visualizeWormhole = () => {
    // let points = this.wormholePath.getPoints(this.wormholePath.arcLengthDivisions);
    let geometry = new THREE.Geometry();
    geometry.vertices = this.wormholePath.getSpacedPoints(100);//this.wormholePath.arcLengthDivisions);
    let material = new THREE.LineBasicMaterial({color: 0xff0000});
    let curveObject = new THREE.Line(geometry, material);
    this.scene.add(curveObject);
  };

  initBodegas = () => {
    let bodegaPositions = this.wormholePath.getPoints(BODEGAS.length);
    for (let i = 0; i < BODEGAS.length; i++) {
      let props = BODEGAS[i];
      props.geometry.scale(-1, 1, 1);
      props.geometry.computeBoundingBox();
      let videoMesh = this.initBodegaMesh(props);
      let videoPos = bodegaPositions[i];
      videoMesh.position.set(videoPos.x, videoPos.y, videoPos.z);
      this.bodegas.add(videoMesh);
    }
    this.scene.add(this.bodegas);
  }

  initBodegaMesh = (props) => {
    let video = document.createElement('video');
    video.src = props.src;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playbackRate = props.playbackRate;
    let texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;
    let material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: props.transparent,
      opacity: props.opacity
    });
    let bodegaMesh = new THREE.Mesh(props.geometry, material);
    bodegaMesh.renderOrder = 1;
    bodegaMesh.rotation.y = Math.sin(0.6);
    bodegaMesh.userData.video = video;
    bodegaMesh.userData.props = props;
    bodegaMesh.userData.texture = texture;
    return bodegaMesh;
  }

  rotateBodegas = () => {
    for (let i = 0; i < this.bodegas.children.length; i++) {
      this.quaternion.setFromAxisAngle(
        this.bodegas.children[i].userData.props.axis,
        this.bodegas.children[i].userData.props.angle);
      this.bodegas.children[i].applyQuaternion(this.quaternion);
    }
  }

  pauseBodegas = () => {
    for (var i = 0; i < this.bodegas.children.length; i++) {
      this.bodegas.children[i].userData.video.pause();
    }
  }

  deallocateBodegas = () => {
    // RE: https://stackoverflow.com/questions/20997669/memory-leak-in-three-js
    for (let i = 0; i < this.bodegas.children.length; i++) {
      this.scene.remove(this.bodegas.children[i]);
      this.renderer.deallocateObject(this.bodegas.children[i].object);
      this.renderer.deallocateTexture(this.bodegas.children[i].texture);
    }
  }

  advanceBodega = () => {
    this.prevBodegaIdx = this.curBodegaIdx;
    this.curBodegaIdx = this.prevBodegaIdx + 1 === this.bodegas.children.length ? 0 : this.prevBodegaIdx + 1;
    if (this.prevBodegaIdx >= 0 && this.prevBodegaIdx != CRAZY_GREEN_BODEGA_IDX) { // TODO - green vid hack
      this.bodegas.children[this.prevBodegaIdx].userData.video.pause();
    }
    this.bodegas.children[this.curBodegaIdx].userData.video.play();
  }

  randomBodega = () => {
    return this.bodegas.children[Math.floor(Math.random() * this.bodegas.children.length)];
  }

  enterWormhole = () => {
    this.advanceBodega();
    this.setState({inWormhole: true});
  };

  updateOrbitControls = () => {
    let time = Date.now();
    this.controls.update(time - this.startTime);
  }

  animate = () => {
    this.time = Date.now();
    this.frameId = window.requestAnimationFrame(this.animate);
    this.renderScene();
  }

  updateCameraPos = () => {
    if (this.state.inWormhole === true) {
      this.cameraRadians += .0003;
      let holePos = this.wormholePath.getPoint(this.cameraRadians);
      this.camera.position.set(holePos.x, holePos.y, holePos.z);
      let curBodega = this.bodegas.children[this.curBodegaIdx]
      let distanceFromBodega = this.camera.position.distanceTo(curBodega.position);
      if (distanceFromBodega < (curBodega.geometry.boundingBox.getSize().x / 20)) {
        this.setState({inWormhole: false});
      }
    }
  }

  updateControls = () => {
    // this.controls.isOnObject( false );
    // this.controls.update( Date.now() - this.time );
  }

  updateFloaters = () => {
    for (let i = 0; i < FLOATERS.length; i++) {
      this.updateFloater(FLOATERS[i], i);
    }
  }

  clampVelocity = (body) => {
    // TODO how to do this elegantly?
    if (body.velocity.x > MAX_VELOCITY) {
      body.velocity.x = MAX_VELOCITY
    }
    if (body.velocity.x < MIN_VELOCITY) {
      body.velocity.x = MIN_VELOCITY
    }
    if (body.velocity.y > MAX_VELOCITY) {
      body.velocity.y = MAX_VELOCITY
    }
    if (body.velocity.y < MIN_VELOCITY) {
      body.velocity.y = MIN_VELOCITY
    }
    if (body.velocity.z > MAX_VELOCITY) {
      body.velocity.z = MAX_VELOCITY
    }
    if (body.velocity.z < MIN_VELOCITY) {
      body.velocity.z = MIN_VELOCITY
    }
  }

  checkRoomCollisions = (floater, idx) => {
    // TODO we need to make a hollowed out object to have the space itself act as a physics collision object
    // let curScene = CURRENT_SCENE; // TODO switch out with this.getCurrentScene()

    if (floater.object.position.y <= floater.bbox.min.y) {
      // console.log("THE OBJ IS Y LESS THAN THE VIDEO", idx)
      floater.physics.position.y = floater.bbox.min.y + 1;
      floater.physics.velocity.y *= -1;
    }
    if (floater.object.position.y >= floater.bbox.max.y) {
      // console.log("THE OBJ IS Y GREATER THAN THE VIDEO", idx)
      floater.physics.position.y = floater.bbox.max.y - 1;
      floater.physics.velocity.y *= -1;
    }
    if (floater.object.position.x <= floater.bbox.min.x) {
      // console.log("THE OBJ IS X LESS THAN THE VIDEO", idx)
      floater.physics.position.x = floater.bbox.min.x + 1;
      floater.physics.velocity.x *= -1;
    }
    if (floater.object.position.x >= floater.bbox.max.x) {
      // console.log("THE OBJ IS X GREATER THAN THE VIDEO", idx)
      floater.physics.position.x = floater.bbox.max.x - 1;
      floater.physics.velocity.x *= -1;
    }
    if (floater.object.position.z <= floater.bbox.min.z) {
      // console.log("THE OBJ IS Z GREATER THAN THE VIDEO",idx)
      floater.physics.position.z = floater.bbox.min.z + 1;
      floater.physics.velocity.z *= -1;
    }
    if (floater.object.position.z >= floater.bbox.max.z) {
      // console.log("THE OBJ IS Z LESS THAN THE VIDEO", idx)
      floater.physics.position.z = floater.bbox.max.z - 1;
      floater.physics.velocity.z *= -1;
    }
  }

  updateFloater = (floater, idx) => {
    if (floater.object !== undefined) {
      this.checkRoomCollisions(floater, idx);
      this.clampVelocity(floater.physics);
      // Copy coordinates from Cannon.js to Three.js
      floater.object.position.copy(floater.physics.position);
      floater.object.quaternion.copy(floater.physics.quaternion);
    }
  }

  updatePhysics = () => {
    // Step the physics world
    this.world.step(this.timeStep);
    this.updateFloaters();
  }

  renderScene = () => {
    this.rotateBodegas();
    this.updateControls();
    this.updateCameraPos();
    this.updatePhysics();
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <Fragment>
        <div className="release">
          <div ref={element => this.container = element}/>
          <SoundcloudPlayer
            trackId='267037220'
            message='BODEGA CHILL'
            inputRef={el => this.audioElement = el}
            fillColor="red"
          />
          <Purchase fillColor="red" href='https://gltd.bandcamp.com/track/lets-beach'/>
        </div>
      </Fragment>
    );
  }
}

export default Release0004Video;
