import React, {PureComponent, Fragment} from 'react';
import * as THREE from "three";
import './Release.css';
import SoundcloudPlayer from '../SoundcloudPlayer';
import Purchase from '../Purchase';
import AudioStreamer from "../Utils/Audio/AudioStreamer";
import {OrbitControls} from "../Utils/OrbitControls";
import {isMobile} from "../Utils/BrowserDetection";
import debounce from "lodash/debounce";
import { assetPath } from "../Utils/assets";

const LOCAL = false;
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

const BODEGAS = [
  {
    src: assetPath4Videos('er-99-cts-broadway-1.webm'),
    geometry: new THREE.SphereBufferGeometry(120, 120, 120),
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
    geometry: new THREE.SphereBufferGeometry(120, 120, 120),
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
    geometry: new THREE.SphereBufferGeometry(120, 120, 120),
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
    geometry: new THREE.SphereBufferGeometry(120, 120, 120),
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
    geometry: new THREE.SphereBufferGeometry(120, 120, 120),
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
    geometry: new THREE.SphereBufferGeometry(120, 120, 120),
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
    geometry: new THREE.SphereBufferGeometry(120, 120, 120),
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
    geometry: new THREE.SphereBufferGeometry(120, 120, 120),
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
    geometry: new THREE.SphereBufferGeometry(120, 120, 120),
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
    geometry: new THREE.SphereBufferGeometry(120, 120, 120),
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
    geometry: new THREE.SphereBufferGeometry(120, 120, 120),
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
    geometry: new THREE.SphereBufferGeometry(120, 120, 120),
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
    geometry: new THREE.SphereBufferGeometry(120, 120, 120),
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
    geometry: new THREE.SphereBufferGeometry(120, 120, 120),
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
    geometry: new THREE.SphereBufferGeometry(120, 120, 120),
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
    // var size = 2000;
    // var divisions = 200;
    // var gridHelper = new THREE.GridHelper( size, divisions );
    // this.scene.add( gridHelper );
    this.videos = new THREE.Object3D();
  }

  componentDidMount() {
    window.addEventListener("resize", this.onWindowResize, false);
    window.addEventListener('mousemove', this.onMouseMove, false );
    window.addEventListener('mousedown', this.onMouseDown, false );
    window.addEventListener("load", this.onLoad, false);
    this.init();
    this.animate();
  }

  componentWillUnmount() {
    this.stop();
    window.removeEventListener("resize", this.onWindowResize, false);
    window.removeEventListener("mousemove", this.onMouseMove, false);
    window.removeEventListener('mousedown', this.onMouseDown, false );
    window.removeEventListener("touchstart", this.onTouch, false);
    window.removeEventListener("touchend", this.onTouchEnd, false);
    window.removeEventListener("load", this.onLoad, false);
    this.container.removeChild(this.renderer.domElement);
  }

  init = () => {
    this.initAudioProps();
    this.initVideos();
    this.container.appendChild(this.renderer.domElement);
  }

  initVideos = () => {
    for (let i = 0; i < BODEGAS.length; i++) {
      let props = BODEGAS[i];
      props.geometry.scale(-1, 1, 1);
      let videoMesh = this.initVideoMesh(props);
      videoMesh.position.set(...props.position);
      this.videos.add(videoMesh);
    }
    this.scene.add(this.videos);
  };

  initVideoMesh = (props) => {
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
    let videoMesh = new THREE.Mesh(props.geometry, material);
    videoMesh.renderOrder = 1;
    videoMesh.rotation.y = Math.sin(0.6);
    videoMesh.userData.video = video;
    videoMesh.userData.props = props;
    videoMesh.userData.texture = texture;
    return videoMesh;
  }

  rotateVideos = () => {

    for (let i =0; i < this.videos.children.length; i++) {
      this.quaternion.setFromAxisAngle(
        this.videos.children[i].userData.props.axis,
        this.videos.children[i].userData.props.angle);
      this.videos.children[i].applyQuaternion(this.quaternion);
    }
  }

  pauseVideos = () => {
    for (var i = 0; i < this.videos.children.length; i++) {
      this.videos.children[i].userData.video.pause();
    }
  }

  deallocateVideos = () => {
    // RE: https://stackoverflow.com/questions/20997669/memory-leak-in-three-js
    for (let i =0; i < this.videos.children.length; i++) {
        this.scene.remove(this.videos.children[i]);
        this.renderer.deallocateObject(this.videos.children[i].object);
        this.renderer.deallocateTexture(this.videos.children[i].texture);
    }
  }

  initAudioProps = () => {
    this.audioStream = new AudioStreamer(this.audioElement);
    this.audioStream.analyser.fftSize = 256;
    this.volArray = new Uint8Array(this.audioStream.analyser.fftSize);
    this.numVolBuckets = 4;
    this.volBucketSize = this.volArray.length / this.numVolBuckets;
    this.freqArray = new Uint8Array(this.audioStream.analyser.frequencyBinCount);
    this.numFreqBuckets = 64;
    this.freqBucketSize = this.freqArray.length / this.numFreqBuckets;
  }

  onWindowResize = debounce(() => {
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;
    this.renderer.setSize(WIDTH, HEIGHT);
    this.camera.aspect = WIDTH / HEIGHT;
    this.camera.updateProjectionMatrix();
  }, 50);

  onMouseMove = ( e ) => {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  onMouseDown  = ( e ) => {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    let intersects = this.raycaster.intersectObjects( this.videos.children );
    // stop all other videos
    this.pauseVideos();
    // start the video we've clicked on an zoom to camera.
    for( var i = 0; i < intersects.length; i++ ) {
      var intersection = intersects[ i ];
      this.camera.position.x = intersection.object.position.x;
      this.camera.position.y = intersection.object.position.y;
      this.camera.position.z = intersection.object.position.z;
      intersection.object.userData.video.play();
      // this.controls.target.x = intersection.object.position.x;
      // this.controls.target.y = intersection.object.position.y;
      // this.controls.target.z = intersection.object.position.z;
    }
  }

  onLoad = (event) => {
    this.audioStream.connect()
  }

  stop = () => {
    cancelAnimationFrame(this.frameId);
    this.deallocateVideos();
  }

  updateOrbitControls = () => {
    let time = Date.now();
    this.controls.update(time - this.startTime);
  }

  animate = () => {
    this.frameId = window.requestAnimationFrame(this.animate);
    this.renderScene();
  }

  renderScene = () => {
    this.rotateVideos();
    this.updateOrbitControls();
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
