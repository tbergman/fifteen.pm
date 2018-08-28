import React, {PureComponent, Fragment} from 'react';
import * as THREE from "three";
import './Release.css';
import SoundcloudPlayer from '../SoundcloudPlayer';
import Purchase from '../Purchase';
import AudioStreamer from "../Utils/Audio/AudioStreamer";
import {OrbitControls} from "../Utils/OrbitControls";
import {isMobile} from "../Utils/BrowserDetection";
import debounce from "lodash/debounce";
import {assetPath} from "../Utils/assets";

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

const WORLD_UNIT = 500;

const BODEGAS = [
  {
    src: assetPath4Videos('er-99-cts-broadway-1.webm'),
    geometry: new THREE.SphereBufferGeometry(120 * Math.random(), 120 * Math.random(), 120 * Math.random()),
    position: [WORLD_UNIT, 0, 0],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.01,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  {
    src: assetPath4Videos('er-bag-1.webm'),
    geometry: new THREE.SphereBufferGeometry(120 * Math.random(), 120 * Math.random(), 120 * Math.random()),
    position: [-WORLD_UNIT, 0, 0],
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
    position: [0, WORLD_UNIT, 0],
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
    position: [0, -WORLD_UNIT, 0],
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
    position: [0, 0, WORLD_UNIT],
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
    position: [0, 0, -WORLD_UNIT],
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

const FLOATING_OBJECTS = [
  {
    url: 'assets/releases/4/models/Doritos_01.fbx',
    mass: 1,
    relativeScale: 1,
    object: undefined,
    physics: undefined,
  },
  {
    url: 'assets/releases/4/models/Doritos_02.fbx',
    mass: 1,
    relativeScale: 1,
    object: undefined,
    physics: undefined,
  },
  {
    url: 'assets/releases/4/models/Doritos_03.fbx',
    mass: 1,
    relativeScale: 1,
    object: undefined,
    physics: undefined,
  },
  {
    url: 'assets/releases/4/models/Doritos_04.fbx',
    mass: 1,
    relativeScale: 1,
    object: undefined,
    physics: undefined,
  },
  {
    url: 'assets/releases/4/models/Doritos_05.fbx',
    mass: 1,
    relativeScale: 1,
    object: undefined,
    physics: undefined,
  },
  {
    url: 'assets/releases/4/models/Doritos_06.fbx',
    mass: 1,
    relativeScale: 1,
    object: undefined,
    physics: undefined,
  },
  {
    url: 'assets/releases/4/models/Doritos_06.fbx',
    mass: 5,
    relativeScale: .01,
    object: undefined,
    physics: undefined,
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
    this.controls = new OrbitControls(this.camera);
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector3();
    this.curBodegaIdx = 0;
    this.prevBodega = undefined;
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
    this.initWormholePath();
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
    this.wormholePath.arcLengthDivisions = numPathVertices; // this didnt work in class init



    // this.wormholePath.curveType = "catmullrom";
    this.visualizeWormhole(); // for devving
  }

  visualizeWormhole = () => {
    // let points = this.wormholePath.getPoints(this.wormholePath.arcLengthDivisions);
    let geometry = new THREE.Geometry();
    geometry.vertices = this.wormholePath.getSpacedPoints(100);//this.wormholePath.arcLengthDivisions);
    // let geometry = new THREE.BufferGeometry().setFromPoints(points);
    let material = new THREE.LineBasicMaterial({color: 0xff0000});
    let curveObject = new THREE.Line(geometry, material);
    this.scene.add(curveObject);
  };

   indexOnWormholePath = (bodegaIdx) => {
     return Math.floor(this.wormholePath.points.length / (bodegaIdx + 1)) - 1;
   }

  initBodegas = () => {
    let bodegaPositions = this.wormholePath.getPoints(BODEGAS.length);
    for (let i = 0; i < BODEGAS.length; i++) {
      let props = BODEGAS[i];
      props.geometry.scale(-1, 1, 1);
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
  }

  randomBodega = () => {
    return this.bodegas.children[Math.floor(Math.random() * this.bodegas.children.length)];
  }

  enterWormhole = () => {
    console.log("ENTER WORMHOLE")
    this.advanceBodega();
    // this.pauseBodegas();
    // bodega.userData.video.play();
    this.setState({inWormhole: true});
  };

  updateOrbitControls = () => {
    let time = Date.now();
    this.controls.update(time - this.startTime);
  }

  animate = () => {
    this.frameId = window.requestAnimationFrame(this.animate);
    this.renderScene();
  }

  enteredCurBodega = (holePos) => {

  }

  updateCameraPos = () => {
    if (this.state.inWormhole === true) {
      this.cameraRadians += .0003;
      let holePos = this.wormholePath.getPoint(this.cameraRadians);
      this.camera.position.set(holePos.x, holePos.y, holePos.z);
      // console.log("WORM HOLE POINT", holePos);
      // console.log("NEXT BODEGA POS", this.bodegas.children[this.curBodegaIdx].position)
      // console.log("TANGENT", this.wormholePath.getTangent(this.cameraRadians));
      // if (-1){
        // this.setState({inWormhole: false});
      // }
    }
  }

  renderScene = () => {
    this.rotateBodegas();
    this.updateOrbitControls();
    this.updateCameraPos();
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <Fragment>
        <div className="release">
          <div ref={element => this.container = element}/>
          {/*<SoundcloudPlayer*/}
            {/*trackId='267037220'*/}
            {/*message='BODEGA CHILL'*/}
            {/*inputRef={el => this.audioElement = el}*/}
            {/*fillColor="red"*/}
          {/*/>*/}
          <Purchase fillColor="red" href='https://gltd.bandcamp.com/track/lets-beach'/>
        </div>
      </Fragment>
    );
  }
}

export default Release0004Video;
