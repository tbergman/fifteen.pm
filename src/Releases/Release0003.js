import React, {PureComponent, Fragment} from 'react';
import * as THREE from "three";
import debounce from 'lodash/debounce';
import './Release.css';
import SoundcloudPlayer from '../SoundcloudPlayer';
import Purchase from '../Purchase';
import AudioStreamer from "../Utils/Audio/AudioStreamer";
import {OrbitControls} from "../Utils/OrbitControls";

const BPM = 130;
const BEAT_TIME = (60 / BPM);
const TREBLE = "treble";
const BASS = "bass";
const MIDS = "mids";

// Filter frequency constants
const MIN_FILTER_FREQ = 50;
const MAX_FILTER_FREQ = 12000;
const MIN_FILTER_RANGE = 0;
const MAX_FILTER_RANGE = 0.3;
const FILTER_RESONANCE = 15;

const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
const RADIUS = 280;
// Some moments in the song (in seconds)
const SYNTHS_SWIRLS = [33, 36, 38];
const INTRO_START = 0;
const BASS_ENTERS = 0;
const MID_ENTERS = 19;
const TREBLE_ENTERS = 38;
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
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.startTime = Date.now();
  }

  state = {
    allOrbs: false,
    loPass: false
  }

  componentDidMount() {
    // window.addEventListener("touchstart", this.onDocumentMouseMove, false);
    window.addEventListener('mousemove', this.onMouseMove, false);
    // window.addEventListener("touchmove", this.onDocumentMouseMove, false);
    window.addEventListener('resize', this.onWindowResize, false);
    this.init();
    this.animate();
  }

  init = () => {
    this.initAudioProps();
    this.initOrbs();
    this.initRaycaster();
    this.container.appendChild(this.renderer.domElement);
  }

  initAudioProps = () => {
    this.audioStream = new AudioStreamer(this.audioElement);
    this.audioStream.connect();
    this.audioStream.analyser.fftSize = 256;
    this.audioStream.filter.type = "lowpass";
    this.audioStream.filter.frequency.value = 25000;
    // this.audioStream.filter.Q.value = 2.5;
    this.volArray = new Uint8Array(this.audioStream.analyser.fftSize);
    this.numVolBuckets = 4;
    this.volBucketSize = this.volArray.length / this.numVolBuckets;

    this.freqArray = new Uint8Array(this.audioStream.analyser.frequencyBinCount);
    this.numFreqBuckets = 64;
    this.freqBucketSize = this.freqArray.length / this.numFreqBuckets;

    this.bassIndex = 0; // the vol bucket indices, assigned by freq range
    this.midIndex1 = 1;
    this.midIndex2 = 2;
    this.trebIndex = 3;
    this.bassThresh = 100;
    this.midThresh = 130;
    this.trebThresh = 140.0;
    this.normalizingConst = 200.0;


  }

  initOrbs = () => {
    let bassParams = {
      numSpheres: 3,
      offFilterColor: 0x000000,
      onFilterColor: 0xFFFFFF,
      scale: 2,
      numLines: 800,
      radiusScale: 1,
      scalarOffset: 1.1,
      makeScratchy: true,
      makeSphere: true,
      name: BASS
    };

    let midParams = {
      numSpheres: 20,
      offFilterColor: 0xe3e3e3,
      onFilterColor: 0xa4a4a4,
      scale: 3,
      numLines: 800,
      radiusScale: 2,
      scalarOffset: 1.1,
      makeSphere: false,
      makeScratchy: false,
      name: MIDS
    };

    let trebleParams = {
      numSpheres: 3,
      offFilterColor: 0xaaaaaa,
      onFilterColor: 0x555555,
      scale: 1,
      numLines: 800,
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
    // add an invisible sphere for raycasting
    let geometry = new THREE.SphereGeometry(RADIUS);

    var material = new THREE.MeshBasicMaterial({transparent: true, opacity: 0.0});
    var sphere = new THREE.Mesh(geometry, material);
    sphere.name = "filterSphere";
    // sphere.position = new THREE.Vector3();
    this.scene.add(sphere);


    this.midOrbs = this.initOrbsGroup(midParams);
    this.orbs = [this.trebleOrbs, this.bassOrbs, this.midOrbs];
    // initially only add some of the orbs
    // for (let orbGroup of this.orbs) {
    //   for (let orb of orbGroup) {
    //     if (orb.userData.idx === 0) {
    //       this.scene.add(orb);
    //       orb.userData.inScene = true;
    //     } else {
    //       orb.userData.inScene = false;
    //     }
    //   }
    // }
  }

  initOrbsGroup = (params) => {
    let orbs = [];
    for (let i = 0; i < params.numSpheres; ++i) {
      let material = new THREE.LineBasicMaterial({color: params.offFilterColor});
      let geometry = this.createOrbGeometry(params, i);
      let orb = new THREE.LineSegments(geometry, material);
      orb.scale.x = orb.scale.y = orb.scale.z = params.scale;
      orb.rotation.z = Math.random() * Math.PI;
      orb.userData.originalScale = 1;
      orb.updateMatrix();
      orb.name = params.name;
      orb.userData.idx = i;
      orb.userData.offFilterColor = params.offFilterColor;
      orb.userData.onFilterColor = params.onFilterColor;
      orbs.push(orb)
    }
    return orbs;
  }

  createOrbGeometry = (params, idx) => {
    let geometry = new THREE.BufferGeometry();
    let vertices = [];
    let vertex = new THREE.Vector3();
    for (let i = 0; i < params.numLines; i++) {
      vertex.x = Math.random() * 2 - 1;
      vertex.y = params.makeSphere && idx === 0 ? Math.random() * 2 - 1 : 0;
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

  initRaycaster = () => {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(100, 100);
  }

  componentWillUnmount() {
    this.stop();
    window.addEventListener('mousemove', this.onMouseMove, false);
    window.addEventListener('resize', this.onWindowResize, false);
    window.removeEventListener("touchstart", this.onDocumentMouseMove, false);
    window.removeEventListener("touchmove", this.onDocumentMouseMove, false);
    this.container.removeChild(this.renderer.domElement);
  }

  onMouseMove = (event) => {

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
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
    let time = Date.now();
    this.controls.update(time - this.startTime);
    this.renderScene();
  }

  getAverage = (start, end, array) => {
    let values = 0;
    let average;
    // get all the frequency amplitudes
    for (let i = start; i <= end; i++) {
      values += array[i];
    }
    average = values / (end - start);
    return average;
  }

  getBuckets = (numBuckets, bucketSize, array) => {
    let buckets = [];
    for (let i = 0; i < numBuckets; i++) {
      let start = i * bucketSize;
      let end = (i + 1) * bucketSize - 1;
      buckets.push(this.getAverage(start, end, array))
    }
    return buckets;
  }

  getFreqBuckets = () => {
    this.audioStream.analyser.getByteFrequencyData(this.freqArray);
    return this.getBuckets(this.numFreqBuckets, this.freqBucketSize, this.volArray)
  }

  getVolBuckets = () => {
    this.audioStream.analyser.getByteTimeDomainData(this.volArray);
    return this.getBuckets(this.numVolBuckets, this.volBucketSize, this.volArray)
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


  handleIntroOrbGroup = (currentTime, entranceTime, orbGroup) => {
    if (currentTime > entranceTime && !orbGroup[0].userData.inScene) {
      this.scene.add(orbGroup[0]);
      orbGroup[0].userData.inScene = true;
    }
  }

  handleIntroOrbs = (currentTime) => {
    this.handleIntroOrbGroup(currentTime, BASS_ENTERS, this.bassOrbs);
    this.handleIntroOrbGroup(currentTime, MID_ENTERS, this.midOrbs);
    this.handleIntroOrbGroup(currentTime, TREBLE_ENTERS, this.trebleOrbs);
  }

  renderByTrackSection = () => {
    const {allOrbs} = this.state;
    let currentTime = this.audioElement.currentTime;

    // you need to check for intro_start since we're looping audio
    if (currentTime >= INTRO_START && currentTime < INTRO_END) {//} && allOrbs) {
      this.handleIntroOrbs(currentTime);

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
    let freqBuckets = this.getFreqBuckets();
    // explicit for loops to avoid checking for types/names
    // these are the flat gray circles directly orbiting the center black core
    for (let orb of this.trebleOrbs) {
      let rotationDenominator = this.state.allOrbs ? 3.0 : 16.0;
      let rotationDirection = THREE.Math.randInt(-1, 1) > 0 ? 1 : -1;
      orb.rotation.x += BEAT_TIME / rotationDenominator;// * rotationDirection;
      let trebVol = volBuckets[this.trebIndex];
      let chordFreqIdx = 16;
      let chordFreqVal = freqBuckets[chordFreqIdx];
      // if (chordFreqVal > 350) {
      orb.scale.x = orb.scale.y = orb.scale.z = chordFreqVal / 310;
      // }
      // if (trebVol > this.trebThresh) {
      //   orb.scale.x = orb.scale.y = orb.scale.z = trebVol / this.normalizingConst;
      // }
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


  scaleFreq = (range) => {
    return (MAX_FILTER_FREQ - MIN_FILTER_FREQ) *
      (range - MIN_FILTER_RANGE) / (MAX_FILTER_RANGE - MIN_FILTER_RANGE) + MIN_FILTER_FREQ;
  }

  applyFilter = () => {
    const {raycaster, mouse, camera, scene} = this;

    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    //// calculate objects intersecting the picking ray
    let intersects = raycaster.intersectObjects(scene.children);
    let onLoPassSphere = false;
    for (let i = 0; i < intersects.length; i++) {
      if (intersects[i].object.name === 'filterSphere') {
        this.scene.background = new THREE.Color(0x000000);
        let range = Math.log(1 + Math.abs(this.mouse.x) + Math.abs(this.mouse.y));
        // console.log(Math.log(1 + range));
        this.audioStream.filter.frequency.value = this.scaleFreq(range)
        this.audioStream.filter.Q.value = FILTER_RESONANCE;
        onLoPassSphere = true;
        for (let orbGroup of this.orbs) {
          for (let orb of orbGroup) {
            orb.material.color.setHex(orb.userData.onFilterColor);
          }
        }
      }
    }
    if (!onLoPassSphere) {
      this.scene.background = new THREE.Color(0xFFFFFF);
      this.audioStream.filter.frequency.value = 20000;
      this.audioStream.filter.Q.value = 0;
      for (let orbGroup of this.orbs) {
        for (let orb of orbGroup) {
          orb.material.color.setHex(orb.userData.offFilterColor);
        }
      }
    }
  }

  renderScene = () => {
    this.renderOrbs();
    this.applyFilter();
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <Fragment>
        <div className="release">
          <div ref={element => this.container = element}/>
          <SoundcloudPlayer
            trackId='480414720'
            secretToken='s-HRFYz'
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
