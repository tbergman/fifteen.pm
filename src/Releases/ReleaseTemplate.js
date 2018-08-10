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

class ReleaseTemplate extends PureComponent {
  constructor() {
    super();

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xFFFFFF);
    this.camera = new THREE.PerspectiveCamera(80, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 3000);
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    // this.orbitControlsActivated = false;
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
    this.container.appendChild(this.renderer.domElement);
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

  animate = () => {
    this.frameId = window.requestAnimationFrame(this.animate);
    this.renderScene();
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

export default ReleaseTemplate;
