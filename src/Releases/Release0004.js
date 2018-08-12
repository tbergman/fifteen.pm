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
const VIDEO_PLAYBACK_RATE = 0.2;
const VIDEO_NUMBER = 2;
const ROTATION_SPEED = 0.0075;
const A_CROSS_FADER_BUFFER = 1.65;
const B_CROSS_FADER_BUFFER = 1.65;

const SCENES = [
  {
    src: 'assets/straps-0.webm',
    geometry: new THREE.SphereBufferGeometry(500, 10000, 40),
    width: 640,
    height: 360,
    loop: false,
    muted: false,
    transparent: true,
    opacity: 0.9,
    color: 0xFFFFFF,
    playbackRate: 0.5,
    target: new THREE.Vector3(4, -50, 1),
    camera_x: 1,
    camera_y: -90,
    camera_z: 6,
    scaleNotCalled: true
  },
  {
    src: 'assets/straps-0.webm',
    geometry: new THREE.BoxBufferGeometry(500, 500, 500),
    width: 640,
    height: 360,
    loop: false,
    muted: true,
    transparent: true,
    opacity: 0.9,
    color: 0xFFFFFF,
    playbackRate: 0.5,
    target: new THREE.Vector3(4, -35, 1),
    camera_x: 1,
    camera_y: -45,
    camera_z: 10,
    scaleNotCalled: true
  },
  {
    src: 'assets/straps-0.webm',
    geometry: new THREE.SphereBufferGeometry(500, 60, 60),
    width: 640,
    height: 360,
    loop: false,
    muted: true,
    transparent: true,
    opacity: 0.9,
    color: 0xFFFFFF,
    playbackRate: 0.5,
    target: new THREE.Vector3(4, -35, 1),
    camera_x: 1,
    camera_y: -75,
    camera_z: 6,
    scaleNotCalled: true
  },
  {
    src: 'assets/straps-0.webm',
    geometry: new THREE.BoxBufferGeometry(250, 500, 750),
    width: 640,
    height: 360,
    loop: false,
    muted: true,
    transparent: true,
    opacity: 0.9,
    color: 0xFFFFFF,
    playbackRate: 0.5,
    target: new THREE.Vector3(4, -35, 1),
    camera_x: 1,
    camera_y: -45,
    camera_z: 10,
    scaleNotCalled: true
  },
];

class Release0004 extends PureComponent {
  constructor() {
    super();
    this.container = document.getElementById('container');
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
    this.camera.target = new THREE.Vector3(0,0,0);
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.renderer.setClearColor(0xffffff, 0);
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
    this.idx = 0;
    this.AVideo = document.createElement('video');
    this.BVideo = document.createElement('video');
    this.BCrossFaderOn = false;
    this.ACrossFaderOn = false;
    this.AMesh = undefined;
    this.BMesh = undefined;
    // var size = 2000;
    // var divisions = 200;
    // var gridHelper = new THREE.GridHelper( size, divisions );
    // this.scene.add( gridHelper );

  }


  componentDidMount() {
    window.addEventListener("resize", this.onWindowResize, false);
    window.addEventListener("mousemove", this.onMouseMove, false);
    window.addEventListener("touchstart", this.onTouch, false);
    window.addEventListener("touchend", this.onTouchEnd, false);
    window.addEventListener("load", this.onLoad, false);
    document.addEventListener('mousedown', this.onDocumentMouseDown, false);
    document.addEventListener('mousemove', this.onDocumentMouseMove, false);
    document.addEventListener('mouseup', this.onDocumentMouseUp, false);
    document.addEventListener('wheel', this.onDocumentMouseWheel, false);
    this.AVideo.addEventListener('ended', this.removeSceneA, false);
    this.AVideo.addEventListener('timeupdate', this.crossFaderA, false);
    this.BVideo.addEventListener('ended', this.removeSceneB, false);
    this.BVideo.addEventListener('timeupdate', this.crossFaderB, false);
    this.init();
    this.animate();
  }

  init = () => {
    this.container.appendChild(this.renderer.domElement);
    this.swapScene({channel: 'A'});

  }

  crossFaderA = () => {
    this.AEnd = this.AVideo.duration - A_CROSS_FADER_BUFFER;
    // console.log('A Time', this.AVideo.currentTime );
    // console.log('A Limit',  this.AEnd);
    if (this.AVideo.currentTime  >= this.AEnd && this.AEnd !== NaN) {
      // console.log(this.ACrossFaderOn);
      if (!this.ACrossFaderOn) {
              console.log('switch to B');
              console.log(this.AVideo.currentTime);
              this.swapScene({channel: 'B'});
              this.ACrossFaderOn = true;
              this.scene.remove(this.AMesh);
      }
    }
  }

  crossFaderB = () => {
    // console.log('B Time', this.BVideo.currentTime);
    this.BEnd = (this.BVideo.duration - B_CROSS_FADER_BUFFER);
    // console.log('B Limit',  this.BEnd);
    if ( this.BVideo.currentTime  >=  this.BEnd && this.BEnd !== NaN) {
      if (!this.BCrossFaderOn) {
              console.log('switch to A');
              console.log(this.BVideo.currentTime);
              this.swapScene({channel: 'A'});
              this.BCrossFaderOn = true;
              this.scene.remove(this.BMesh);
      }

    }
  }
  removeSceneA = () => {
    console.log('remove A');
    this.BCrossFaderOn = false;
    this.scene.remove(this.AMesh);
  }

  removeSceneB = () => {
    console.log('remove B');
    this.ACrossFaderOn = false;
    this.scene.remove(this.BMesh);
    // this.swapScene();

  }
  swapScene = (opts) => {

    if (this.idx >= SCENES.length) { 
      this.idx = 0;
    }  
    let props = SCENES[this.idx];
    if (props.scaleNotCalled) {
      props.geometry.scale(-1, 1, 1);
      props.scaleNotCalled = false;
    }
    // this.renderer.setPixelRatio(window.devicePixelRatio);
    if (opts.channel == 'A') {
      this.AVideo.src = props.src; 
      this.AVideo.crossOrigin = 'anonymous';
      this.AVideo.width = props.width;
      this.AVideo.height = props.height;
      this.AVideo.loop =  props.loop;
      this.AVideo.muted = props.muted;
      this.AVideo.autoplay = true;
      this.AVideo.playbackRate = props.playbackRate;
      this.AVideo.currentTime = 36623;
      this.AVideo.play();
      this.activeChannel = opts.channel;
      let texture = new THREE.VideoTexture(this.AVideo);
      texture.minFilter = THREE.LinearFilter;
      texture.format = THREE.RGBFormat;
      let material = new THREE.MeshBasicMaterial({map: texture, transparent: props.transparent, opacity: props.opacity});
      let mesh =  new THREE.Mesh(props.geometry, material);
      mesh.name = 'new_vid_mesh';
      this.camera.position.x = props.camera_x;
      this.camera.position.y = props.camera_y;
      this.camera.position.z = props.camera_z;
      this.camera.target = props.target;
      this.camera.lookAt(this.camera.target);
      mesh.name = 'AMesh';
      this.AMesh = mesh;
      this.AMesh.renderOrder = 2;
      this.scene.add(this.AMesh);
    } else {
      this.BVideo.src = props.src; 
      this.BVideo.crossOrigin = 'anonymous';
      this.BVideo.width = props.width;
      this.BVideo.height = props.height;
      this.BVideo.loop =  props.loop;
      this.BVideo.muted = props.muted;
      this.BVideo.autoplay = true;
      this.BVideo.playbackRate = props.playbackRate;
      this.BVideo.currentTime = 36623;
      this.BVideo.play();
      this.activeChannel = opts.channel; 
      let texture = new THREE.VideoTexture(this.BVideo);
      texture.minFilter = THREE.LinearFilter;
      texture.format = THREE.RGBFormat;
      let material = new THREE.MeshBasicMaterial({map: texture, transparent: props.transparent, opacity: props.opacity});
      let mesh =  new THREE.Mesh(props.geometry, material);
      this.camera.position.x = props.camera_x;
      this.camera.position.y = props.camera_y;
      this.camera.position.z = props.camera_z;
      this.camera.target = props.target;
      this.camera.lookAt(this.camera.target);
      mesh.name = 'vid_mesh';
      this.BMesh = mesh;
      this.BMesh.renderOrder = 1;
      this.AMesh.renderOrder = 0;
      this.scene.add(this.BMesh);
      
    }

  this.idx += 1;
    
  }

  componentWillUnmount() {
    this.stop();
    window.removeEventListener("resize", this.onWindowResize, false);
    window.removeEventListener("mousemove", this.onMouseMove, false);
    window.removeEventListener("touchstart", this.onTouch, false);
    window.removeEventListener("touchend", this.onTouchEnd, false);
    window.removeEventListener("load", this.onLoad, false);
    this.AVideo.removeEventListener('ended', this.removeSceneA, false);
    this.AVideo.removeEventListener('timeupdate', this.crossFaderA, false);
    this.BVideo.removeEventListener('ended', this.removeSceneB, false);
    this.BVideo.removeEventListener('timeupdate', this.crossFaderB, false);
    this.container.removeChild(this.renderer.domElement);
  }

  onDocumentMouseDown = (event) => {
    event.preventDefault();
    this.isUserInteracting = true;
    this.onPointerDownPointerX = event.clientX;
    this.onPointerDownPointerY = event.clientY;
    this.onPointerDownLon = this.lon;
    this.onPointerDownLat = this.lat;
    this.isUserInteracting = true;
  }

  onDocumentMouseMove = (event) => {
    if (this.isUserInteracting === true) {
      this.lon = (this.onPointerDownPointerX - event.clientX) * 0.1 + this.onPointerDownLon;
      this.lat = (event.clientY - this.onPointerDownPointerY) * 0.1 + this.onPointerDownLat;
      this.isUserInteracting = true;
    }
  }

  onDocumentMouseUp = () => {
    this.isUserInteracting = false;
  }

  onDocumentMouseWheel = (event) => {
    this.isUserInteracting = true;
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


  onLoad = (event) => {
    // this.audioStream.connect();
  }

  stop = () => {
    cancelAnimationFrame(this.frameId);
  }

  animate = () => {
    this.frameId = window.requestAnimationFrame(this.animate);
    this.renderScene();
  }

  renderScene = () => {

    if (this.isUserInteracting) {
      this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
      this.phi = THREE.Math.degToRad( 90 - this.lat );
      this.theta = THREE.Math.degToRad( this.lon );
      this.camera.position.x = this.distance * Math.sin( this.phi ) * Math.cos( this.theta );
      this.camera.position.y = this.distance * Math.cos( this.phi );
      this.camera.position.z = this.distance * Math.sin( this.phi ) * Math.sin( this.theta );
    } else {
      let x = this.camera.position.x;
      let z = this.camera.position.z;
      this.camera.position.x = x * Math.cos(ROTATION_SPEED) + z * Math.sin(ROTATION_SPEED);
      this.camera.position.z = z * Math.cos(ROTATION_SPEED) - x * Math.sin(ROTATION_SPEED);
    }
    // console.log(this.camera.position.x, this.camera.position.y, this.camera.position.z);
    this.camera.lookAt(this.camera.target);
    this.renderer.render(this.scene, this.camera);

    // console.log(this.camera.position.x, this.camera.position.y, this.camera.position.z);
    // console.log(this.distance, this.lat, this.lon);
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


export default Release0004;
