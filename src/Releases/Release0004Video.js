import React, {PureComponent, Fragment} from 'react';
import * as THREE from "three";
import './Release.css';
import SoundcloudPlayer from '../SoundcloudPlayer';
import Purchase from '../Purchase';
import AudioStreamer from "../Utils/Audio/AudioStreamer";
import {OrbitControls} from "../Utils/OrbitControls";
import {isMobile} from "../Utils/BrowserDetection";
import debounce from "lodash/debounce";

const BPM = 130;
const BEAT_TIME = (60 / BPM);
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;

const BODEGAS = [
  {
    src: 'assets/releases/4/videos/er-99-cts-broadway-1.webm',
    geometry: new THREE.SphereBufferGeometry(100, 100, 100),
    position: [500, 0, 0],
    transparent: false,
    opacity: 1,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  {
    src: 'assets/releases/4/videos/er-bag-1.webm',
    geometry: new THREE.SphereBufferGeometry(100, 100, 100),
    position: [-500, 0, 0],
    transparent: false,
    opacity: 1,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  {
    src: 'assets/releases/4/videos/er-bodega-chill-2.webm',
    geometry: new THREE.SphereBufferGeometry(100, 100, 100),
    position: [0, 500, 0],
    transparent: false,
    opacity: 1,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  {
    src: 'assets/releases/4/videos/er-big-boi-bitcoin-brian.webm',
    geometry: new THREE.SphereBufferGeometry(100, 100, 100),
    position: [0, -500, 0],
    transparent: false,
    opacity: 1,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  {
    src: 'assets/releases/4/videos/er-cholulita-bite.webm',
    geometry: new THREE.SphereBufferGeometry(100, 100, 100),
    position: [0, 0, 500],
    transparent: false,
    opacity: 1,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  {
    src: 'assets/releases/4/videos/er-broadway-tvs-n-elbows.webm',
    geometry: new THREE.SphereBufferGeometry(100, 100, 100),
    position: [0, 0, -500],
    transparent: false,
    opacity: 1,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  {
    src: 'assets/releases/4/videos/er-broadway-spread.webm',
    geometry: new THREE.SphereBufferGeometry(100, 100, 100),
    position: [250, 0, 0],
    transparent: false,
    opacity: 1,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  {
    src: 'assets/releases/4/videos/er-broadway-bongs.webm',
    geometry: new THREE.SphereBufferGeometry(100, 100, 100),
    position: [-250, 0, 0],
    transparent: false,
    opacity: 1,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  {
    src: 'assets/releases/4/videos/er-broadway-fridge-door.webm',
    geometry: new THREE.SphereBufferGeometry(100, 100, 100),
    position: [0, 250, 0],
    transparent: false,
    opacity: 1,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  {
    src: 'assets/releases/4/videos/er-day-and-night-pringles.webm',
    geometry: new THREE.SphereBufferGeometry(100, 100, 100),
    position: [0, -250, 0],
    transparent: false,
    opacity: 1,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  {
    src: 'assets/releases/4/videos/er-eric-mini-makret-central-ave.webm',
    geometry: new THREE.SphereBufferGeometry(100, 100, 100),
    position: [0, 0, 250],
    transparent: false,
    opacity: 1,
    color: 0xFFFFFF,
    playbackRate: 1
  }
];

class Release0004Video extends PureComponent {
  constructor() {
    super();
    this.startTime = new Date();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xFFFFFF);
    this.camera = new THREE.PerspectiveCamera(80, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 3000);
    this.camera.position.x = 200;
    this.camera.position.y = 600;
    this.camera.position.z = 1000;
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.controls = new OrbitControls(this.camera);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
    var size = 2000;
    var divisions = 200;
    var gridHelper = new THREE.GridHelper( size, divisions );
    this.scene.add( gridHelper );
    this.videos = [];
  }

  componentDidMount() {
    window.addEventListener("resize", this.onWindowResize, false);
    window.addEventListener("mousemove", this.onMouseMove, false);
    window.addEventListener("touchstart", this.onTouch, false);
    window.addEventListener("touchend", this.onTouchEnd, false);
    window.addEventListener("load", this.onLoad, false);
    this.init();
    this.animate();
  }

  init = () => {
    this.initAudioProps();
    this.initVideos();
    this.container.appendChild(this.renderer.domElement);
  }

  initVideos = () => {
    for (let i = 0; i < BODEGAS.length; i++) {
      let props = BODEGAS[i];
      let videoMesh = this.initVideoMesh(props);
      this.videos.push(videoMesh);
      this.scene.add(videoMesh);
      videoMesh.position.set(...props.position);
      props.geometry.scale(-1, 1, 1);

    }
  };

  initVideoMesh = (props) => {
    let video = document.createElement('video');
    video.src = props.src;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.autoplay = true;
    video.playbackRate = props.playbackRate;
    video.play();
    console.log('INIT:')
    console.log(video.src);
    let texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;
    let material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: props.transparent,
      opacity: props.opacity
    });
    let mesh = new THREE.Mesh(props.geometry, material);
    mesh.renderOrder = 1;
    return mesh;
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

  componentWillUnmount() {
    this.stop();
    window.removeEventListener("resize", this.onWindowResize, false);
    window.removeEventListener("mousemove", this.onMouseMove, false);
    window.removeEventListener("touchstart", this.onTouch, false);
    window.removeEventListener("touchend", this.onTouchEnd, false);
    window.removeEventListener("load", this.onLoad, false);
    this.container.removeChild(this.renderer.domElement);
  }

  onWindowResize = debounce(() => {
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;
    this.renderer.setSize(WIDTH, HEIGHT);
    this.camera.aspect = WIDTH / HEIGHT;
    this.camera.updateProjectionMatrix();
  }, 50);

  setMouseCoords = (x, y) => {
    this.mouse.x = (x / window.innerWidth) * 2 - 1;
    this.mouse.y = -(y / window.innerHeight) * 2 + 1;
    this.mouseMoved = true;
  }

  onLoad = (event) => {
    this.audioStream.connect()
  }

  stop = () => {
    cancelAnimationFrame(this.frameId);
  }

  updateOrbitControls = () => {
    let time = Date.now();
    this.controls.update(time - this.startTime);
  }

  animate = () => {
    this.frameId = window.requestAnimationFrame(this.animate);
    this.renderScene();
    this.updateOrbitControls();

  }

  renderByTrackSection = (currentTime) => {
  }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (

      <Fragment>
        <div className="release">
          <div ref={element => this.container = element}/>
          <SoundcloudPlayer
            trackId='482138307'
            message='OTHERE'
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
