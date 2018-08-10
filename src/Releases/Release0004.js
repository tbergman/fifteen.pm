import React, {PureComponent, Fragment} from 'react';
import * as THREE from "three";
import debounce from 'lodash/debounce';
import './Release.css';
import SoundcloudPlayer from '../SoundcloudPlayer';
import Purchase from '../Purchase';
import AudioStreamer from "../Utils/Audio/AudioStreamer";
import {OrbitControls} from "../Utils/OrbitControls";
import {isMobile} from "../Utils/BrowserDetection";

const BPM = 130;
const BEAT_TIME = (60 / BPM);
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;

class Release0004 extends PureComponent {
  constructor() {
    super();
    this.container = document.getElementById('container');
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
    this.camera.target = new THREE.Vector3(0, 0, 0);
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  }


  componentDidMount() {
    window.addEventListener("resize", this.onWindowResize, false);
    // window.addEventListener("mousemove", this.onMouseMove, false);
    window.addEventListener("touchstart", this.onTouch, false);
    window.addEventListener("touchend", this.onTouchEnd, false);
    window.addEventListener("load", this.onLoad, false);
    document.addEventListener('mousedown', this.onDocumentMouseDown, false);
    document.addEventListener('mousemove', this.onDocumentMouseMove, false);
    document.addEventListener('mouseup', this.onDocumentMouseUp, false);
    document.addEventListener('wheel', this.onDocumentMouseWheel, false);
    this.init();
    this.animate();
  }

  init = () => {
    this.initAudioProps();
    this.demoExample();
    this.container.appendChild(this.renderer.domElement);
  }


  demoExample = () => {
    var camera, scene, renderer;

    this.lat = 0;
    this.lon = 0;
    this.onMouseDownLon = 0;
    this.texture_placeholder;
    this.isUserInteracting = false;
    this.onMouseDownMouseX = 0;
    this.onMouseDownMouseY = 0;
    this.onMouseDownLat = 0;
    this.phi = 0;
    this.theta = 0;
    this.distance = 50;
    this.onPointerDownPointerX = 0;
    this.onPointerDownPointerY = 0;
    this.onPointerDownLon = 0;
    this.onPointerDownLat = 0;

    var geometry = new THREE.SphereBufferGeometry(500, 60, 40);
    // invert the geometry on the x-axis so that all of the faces point inward
    geometry.scale(-1, 1, 1);

    this.video = document.createElement('video');
    this.video.crossOrigin = 'anonymous';
    this.video.width = 640;
    this.video.height = 360;
    this.video.loop = true;
    this.video.muted = true;
    this.video.src = 'assets/straps.webm'; //pano.webm';
    this.video.setAttribute('webkit-playsinline', 'webkit-playsinline');
    this.video.play();

    let texture = new THREE.VideoTexture(this.video);
    texture.minFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;
    let material = new THREE.MeshBasicMaterial({map: texture});
    let mesh = new THREE.Mesh(geometry, material);

    this.scene.add(mesh);


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

    // this.bassIndex = 0; // the vol bucket indices, assigned by freq range
    // this.midIndex1 = 1;
    // this.midIndex2 = 2;
    // this.trebIndex = 3;
    // this.bassThresh = 100;
    // this.midThresh = 130;
    // this.trebThresh = 140.0;
    // this.normalizingConst = 200.0;


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

  onDocumentMouseDown = (event) => {
    event.preventDefault();
    this.isUserInteracting = true;
    this.onPointerDownPointerX = event.clientX;
    this.onPointerDownPointerY = event.clientY;
    this.onPointerDownLon = this.lon;
    this.onPointerDownLat = this.lat;
  }

  onDocumentMouseMove = (event) => {
    if (this.isUserInteracting === true) {
      this.lon = (this.onPointerDownPointerX - event.clientX) * 0.1 + this.onPointerDownLon;
      this.lat = (event.clientY - this.onPointerDownPointerY) * 0.1 + this.onPointerDownLat;
    }
  }

  onDocumentMouseUp = () => {
    this.isUserInteracting = false;
  }

  onDocumentMouseWheel = (event) => {
    this.distance += event.deltaY * 0.05;
    this.distance = THREE.Math.clamp(this.distance, 1, 50);
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
  //
  // onMouseMove = (event) => {
  //   this.setMouseCoords(event.clientX, event.clientY);
  // };
  //
  // onTouch = (event) => {
  //   // event.preventDefault();
  //   if (event.touches) {
  //     this.setMouseCoords(event.touches[0].clientX, event.touches[0].clientY);
  //   }
  // };
  //
  // // turn off filter if no touch
  // onTouchEnd = (event) => {
  //   // event.preventDefault();
  //   this.mouse.x = 10000;
  //   this.mouse.y = 10000;
  // }
  //
  // onWindowResize = debounce(() => {
  //   const WIDTH = window.innerWidth;
  //   const HEIGHT = window.innerHeight;
  //   this.renderer.setSize(WIDTH, HEIGHT);
  //   this.camera.aspect = WIDTH / HEIGHT;
  //   this.camera.updateProjectionMatrix();
  // }, 50);

  stop = () => {
    cancelAnimationFrame(this.frameId);
  }

  animate = () => {
    this.frameId = window.requestAnimationFrame(this.animate);
    this.renderScene();
  }

  // getAverage = (start, end, array) => {
  //   let values = 0;
  //   let average;
  //   // get all the frequency amplitudes
  //   for (let i = start; i <= end; i++) {
  //     values += array[i];
  //   }
  //   average = values / (end - start);
  //   return average;
  // }
  //
  // getBuckets = (numBuckets, bucketSize, array) => {
  //   let buckets = [];
  //   for (let i = 0; i < numBuckets; i++) {
  //     let start = i * bucketSize;
  //     let end = (i + 1) * bucketSize - 1;
  //     buckets.push(this.getAverage(start, end, array))
  //   }
  //   return buckets;
  // }
  //
  // getFreqBuckets = () => {
  //   this.audioStream.analyser.getByteFrequencyData(this.freqArray);
  //   return this.getBuckets(this.numFreqBuckets, this.freqBucketSize, this.volArray)
  // }
  //
  // getVolBuckets = () => {
  //   this.audioStream.analyser.getByteTimeDomainData(this.volArray);
  //   return this.getBuckets(this.numVolBuckets, this.volBucketSize, this.volArray)
  // }

  renderByTrackSection = (currentTime) => {
  }

  renderScene = () => {
    this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
    this.phi = THREE.Math.degToRad( 90 - this.lat );
    this.theta = THREE.Math.degToRad( this.lon );

    this.camera.position.x = this.distance * Math.sin( this.phi ) * Math.cos( this.theta );
    this.camera.position.y = this.distance * Math.cos( this.phi );
    this.camera.position.z = this.distance * Math.sin( this.phi ) * Math.sin( this.theta );

    this.camera.lookAt( this.camera.target );

    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (

      <Fragment>
        <div className="release">
          <div ref={element => this.container = element}/>
          <SoundcloudPlayer
            trackId='482138307'
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

export default Release0004;
