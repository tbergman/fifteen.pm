import React, {PureComponent, Fragment} from 'react';
import * as THREE from "three";
import debounce from 'lodash/debounce';
import './Release.css';
import Player from '../Player';
import Purchase from '../Purchase';
import {AudioStreamer} from "../Utils/Audio/AudioStreamer";

const BPM = 130;
const BEAT_TIME = (60 / BPM);
const TREBLE = "treble";
const BASS = "bass";
const MIDS = "mids";
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
const RADIUS = 250;
// Some moments in the song (in seconds)
const SYNTHS_ENTER = 33;
const INTRO_START = 0;
const INTRO_END = 77;
const INTERLUDE_2_START = 161;
const INTERLUDE_2_END = 167;
const INTERLUDE_3_START = 242;
const INTERLUDE_3_END = 247;
const OUTRO_START = 306;
const CAN_U_HEAR = 169;

class Release0003 extends PureComponent {
  constructor() {
    super();

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xFFFFFF);
    this.camera = new THREE.PerspectiveCamera(80, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 3000);
    this.camera.position.z = 1000;

    this.numLines = 800;

    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  }

  state = {
    allOrbs: false
  }

  componentDidMount() {
    window.addEventListener("touchstart", this.onDocumentMouseMove, false);
    window.addEventListener("touchmove", this.onDocumentMouseMove, false);
    window.addEventListener('resize', this.onWindowResize, false);
    this.init();
    this.animate();
  }

  init = () => {
    this.initAudioProps();
    this.initOrbs();
    this.container.appendChild(this.renderer.domElement);
  }

  initAudioProps = () => {
    this.audioStream = new AudioStreamer(this.audioElement);
    this.audioStream.analyser.fftSize = 256;
    this.volArray = new Uint8Array(this.audioStream.analyser.fftSize);
    this.numVolBuckets = 4;
    this.bassIndex = 0; // the vol bucket indices, assigned by freq range
    this.midIndex1 = 1;
    this.midIndex2 = 2;
    this.trebIndex = 3;
    this.bassThresh = 100; // a val
    this.midThresh = 130;
    this.trebThresh = 140.0;
    this.normalizingConst = 200.0;
  }

  initOrbs = () => {
    let bassParams = {
      numSpheres: 3,
      color: 0x000000,
      scale: 2,
      radiusScale: 1,
      scalarOffset: 1.1,
      makeScratchy: true,
      makeSphere: true,
      name: BASS
    };

    let midParams = {
      numSpheres: 20,
      color: 0xf0f0f0,
      scale: 3,
      radiusScale: 2,
      scalarOffset: 1.1,
      makeSphere: false,
      makeScratchy: false,
      name: MIDS
    };

    let trebleParams = {
      numSpheres: 3,
      color: 0xaaaaaa,
      scale: 1,
      radiusScale: 2,
      scalarOffset: 1.1,
      makeSphere: false,
      makeScratchy: false,
      name: TREBLE
    };

    // let canUHearParams = {
    //   numSpheres: 1,
    //   color: 0x49fb35,
    //   scale: 1,
    //   radiusScale: 3,
    //   scalarOffet: 1.1,
    //   useCatmull: true,
    //   name: "can_u_hear"
    // }
    //
    // this.canUHearOrbs = this.initOrbsGroup(canUHearParams)
    this.trebleOrbs = this.initOrbsGroup(trebleParams);
    this.bassOrbs = this.initOrbsGroup(bassParams);
    this.midOrbs = this.initOrbsGroup(midParams);
    this.orbs = [this.trebleOrbs, this.bassOrbs, this.midOrbs];
    // initially only add some of the orbs
    for (let orbGroup of this.orbs) {
      for (let orb of orbGroup) {
        if (orb.userData.idx === 0) {
          this.scene.add(orb);
          orb.userData.inScene = true;
        } else {
          orb.userData.inScene = false;
        }
      }
    }
  }

  initOrbsGroup = (params) => {

    let orbs = [];
    for (let i = 0; i < params.numSpheres; ++i) {
      let material = new THREE.LineBasicMaterial({color: params.color});
      let geometry = this.createOrbGeometry(params, i);
      let orb = new THREE.LineSegments(geometry, material);
      orb.scale.x = orb.scale.y = orb.scale.z = params.scale;
      orb.rotation.z = Math.random() * Math.PI;
      orb.userData.originalScale = 1;
      orb.updateMatrix();
      orb.name = params.name;
      orb.userData.idx = i;
      orbs.push(orb)
    }
    return orbs;
  }

  createOrbGeometry = (params, idx) => {
    let geometry = new THREE.BufferGeometry();
    let vertices = [];
    let vertex = new THREE.Vector3();
    for (let i = 0; i < this.numLines; i++) {
      vertex.x = Math.random() * 2 - 1;
      vertex.y = params.makeSphere && idx == 0 ? Math.random() * 2 - 1 : 0;
      vertex.z = Math.random() * 2 - 1;
      vertex.normalize();
      vertex.multiplyScalar(RADIUS * params.radiusScale);
      vertices.push(vertex.x, vertex.y, vertex.z);
      // if (idx > 0 || !params.makeScratchy) {
        vertex.multiplyScalar(params.scalarOffset);
        vertices.push(vertex.x, vertex.y, vertex.z);
      // }
    }
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return geometry;
  }

  componentWillUnmount() {
    this.stop();
    window.removeEventListener('mousemove', this.onDocumentMouseMove, false);
    window.removeEventListener('resize', this.onWindowResize, false);
    window.removeEventListener("touchstart", this.onDocumentMouseMove, false);
    window.removeEventListener("touchmove", this.onDocumentMouseMove, false);
    this.container.removeChild(this.renderer.domElement);
  }

  onWindowResize = debounce(() => {
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;
    this.renderer.setSize(WIDTH, HEIGHT);
  }, 100);

  stop = () => {
    cancelAnimationFrame(this.frameId);
  }

  animate = () => {
    this.frameId = window.requestAnimationFrame(this.animate);
    this.renderScene();
  }

  getAverageVolume = (start, end, array) => {
    let values = 0;
    let average;
    // get all the frequency amplitudes
    for (let i = start; i <= end; i++) {
      values += array[i];
    }
    average = values / (end - start);
    return average;
  }

  getVolBuckets = () => {
    let buckets = [];
    let bucketSize = this.volArray.length / this.numVolBuckets;
    this.audioStream.analyser.getByteTimeDomainData(this.volArray);
    for (let i = 0; i < this.numVolBuckets; i++) {
      let start = i * bucketSize;
      let end = (i + 1) * bucketSize - 1;
      buckets.push(this.getAverageVolume(start, end, this.volArray))
    }
    return buckets;
  }

  addAllOrbs = () => {
    for (let orbGroup of this.orbs) {
      for (let orb of orbGroup) {
        if (!orb.userData.inScene) {
          this.scene.add(orb);
          orb.userData.inScene = true;
        }
      }
    }
    this.setState({allOrbs: true});
  }

  removeAllButFirstOrb = () => {
    for (let orbGroup of this.orbs) {
      for (let orb of orbGroup) {
        if (orb.userData.idx !== 0) {
          this.scene.remove(orb);
          orb.userData.inScene = false;
        }
      }
    }
    this.setState({allOrbs: false});
  }
  
  renderByTrackSection = () => {
    const {allOrbs} = this.state;
    let currentTime = this.audioStream.audioCtx.currentTime;

    // you need to check for intro_start since we're looping audio
    if (currentTime >= INTRO_START && currentTime < INTRO_END && allOrbs) {
      this.removeAllButFirstOrb();
    }

    if (currentTime >= INTRO_END && currentTime < INTERLUDE_2_START && !allOrbs) {
      this.addAllOrbs();
    }

    if (currentTime >= INTERLUDE_2_START && currentTime < INTERLUDE_2_END && allOrbs) {
      this.removeAllButFirstOrb();
    }

    if (currentTime >= INTERLUDE_2_END && currentTime < INTERLUDE_3_START && !allOrbs) {
      this.addAllOrbs();
    }

    if (currentTime >= INTERLUDE_3_START && currentTime < INTERLUDE_3_END && allOrbs) {
      this.removeAllButFirstOrb();
    }

    if (currentTime >= INTERLUDE_3_END && currentTime < OUTRO_START && !allOrbs) {
      this.addAllOrbs();
    }

    if (currentTime >= OUTRO_START && allOrbs) {
      this.removeAllButFirstOrb();
    }


  }

  renderOrbs = () => {
    this.renderByTrackSection();

    let volBuckets = this.getVolBuckets();

    // explicit for loops to avoid checking for types/names
    // these are the flat gray circles directly orbiting the center black core
    for (let orb of this.trebleOrbs) {
      let rotationDenominator = this.state.allOrbs ? 3.0 : 16.0;
      let rotationDirection = THREE.Math.randInt(-1, 1) > 0 ? 1 : -1;
      orb.rotation.x += BEAT_TIME / rotationDenominator;// * rotationDirection;
      let trebVol = volBuckets[this.trebIndex];
      if (trebVol > this.trebThresh) {
        orb.scale.x = orb.scale.y = orb.scale.z = trebVol / this.normalizingConst;
      }
    }

    // these are the background lightest colored orbs
    for (let orb of this.midOrbs) {
      let midVol = (volBuckets[this.midIndex1] + volBuckets[this.midIndex2]) / 2.0;
      let midRotation = 0;
      if (midVol < this.midThresh) {
        midRotation = BEAT_TIME / 8.0;
      } else {
        midRotation = BEAT_TIME / 32.0;
      }
      orb.rotation.x += midRotation;
      orb.rotation.y += midRotation;
      orb.rotation.z += midRotation;
    }

    // these are the dark orbs in the center
    for (let orb of this.bassOrbs) {
      orb.rotation.x += -BEAT_TIME / 16.0;
      let bassVol = volBuckets[this.bassIndex];
      if (bassVol > this.bassThresh) {
        orb.scale.x = orb.scale.y = orb.scale.z = bassVol / this.normalizingConst;
      }
    }
  }

  renderScene = () => {
    this.renderOrbs();
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <Fragment>
        <div className="release">
          <div ref={element => this.container = element}/>
          <Player
            src='https://api.soundcloud.com/tracks/480414720/stream?secret_token=s-HRFYz&client_id=ad6375f4b6bc0bcaee8edf53ab37e7f2'
            type='audio/mpeg'
            message='OTHERE'
            inputRef={el => this.audioElement = el}
            fillColor="red"
          />
          <Purchase fillColor="red" href='https://gltd.bandcamp.com/track/TODO'/>
        </div>
      </Fragment>
    );
  }
}

export default Release0003;
