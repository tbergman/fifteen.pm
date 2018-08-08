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
const TREBLE = "treble";
const BASS = "bass";
const MIDS = "mids";

// Filter frequency constants
const HOVER_MIN_FILTER_FREQ = 100;
const HOVER_MAX_FILTER_FREQ = 12000;
const FLYTHRU_MIN_FILTER_FREQ = 80;
const FLYTHRU_MAX_FILTER_FREQ = 6000;
const FILTER_RESONANCE = 11;
const FILTER_RADIUS_BUFFER = -40;

const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
const RADIUS = 280;

// Some moments in the song (in seconds)
const INTRO_START = -1;
const INTRO_END = 77;
const BASS_ENTERS = 0;
const MID_ENTERS = 15;
const TREBLE_ENTERS = 29;

const INTERLUDE_1_START = 71;
const INTERLUDE_1_END = 77;
const INTERLUDE_2_START = 161;
const INTERLUDE_2_END = 167;
const INTERLUDE_3_START = 242;
const INTERLUDE_3_END = 247;
const OUTRO_START = 306;
const CAN_U_HEAR = 169;
const SONG_LENGTH = 328;
const USE_ORBIT_CONTROLS_ON_MOBILE = true;

// Scratchy moment generation
let getRandomMoments = (len, size) => {
  var arr = [];
  for (var j = 0; j <= len; j++) {
    arr.push(j);
  }
  let shuffled = arr.slice(0), i = arr.length, temp, index;
  while (i--) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(0, size);
}

const isInterlude = (x) => {
  if (x > INTERLUDE_1_START && x <= INTERLUDE_1_END) {
    return true;
  }
  if (x > INTERLUDE_2_START && x <= INTERLUDE_2_END) {
    return true;
  } else if (x > INTERLUDE_3_START && x <= INTERLUDE_3_END) {
    return true
  }
  return false;
}

const N_SCRATCHY_MOMENTS = 58;
const NO_SCRATCHY_MOMENTS_BEFORE = 46;
const SCRATCHY_TIME_BUFFERS = [
  BEAT_TIME / 4,
  BEAT_TIME / 2, 
  BEAT_TIME
];
const SCRATCHY_MOMENTS = getRandomMoments(SONG_LENGTH, N_SCRATCHY_MOMENTS)
                                  .filter(m => !isInterlude(m) && m >= NO_SCRATCHY_MOMENTS_BEFORE);

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
    this.orbitControlsActivated = false;
  }

  state = {
    allOrbs: false
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
    this.initOrbs();
    this.initRaycaster();
    this.initOrbitContols();
    // this.initGridHelper();
    this.container.appendChild(this.renderer.domElement);
  }

  initOrbitContols = () => {
    if (!isMobile || USE_ORBIT_CONTROLS_ON_MOBILE) {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.startTime = Date.now();
      this.orbitControlsActivated = true;    
    }
  }

  initGridHelper = () => {
    this.gridHelper = new THREE.GridHelper( 1000, 1000 );
    this.scene.add( this.gridHelper );
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
      // makeScratchy: true,
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
      // makeScratchy: false,
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
      // makeScratchy: false,
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


    this.smoothOrbs = {
      treble: this.initOrbsGroup(trebleParams),
      bass: this.initOrbsGroup(bassParams),
      mid: this.initOrbsGroup(midParams)
    };

    this.scratchyOrbs = {
      treble: this.initOrbsGroup(trebleParams, true),
      bass: this.initOrbsGroup(bassParams),
      mid: this.initOrbsGroup(midParams, true)
    };

    this.onOrbs = this.smoothOrbs;
    this.offOrbs = this.scratchyOrbs;

    // FILTER SPHERE add an invisible sphere for raycasting (TODO move)
    let geometry = new THREE.SphereGeometry(RADIUS + FILTER_RADIUS_BUFFER);
    var material = new THREE.MeshBasicMaterial({transparent: true, opacity: 0.0});
    var sphere = new THREE.Mesh(geometry, material);
    sphere.name = "filterSphere";
    // sphere.position = new THREE.Vector3();
    this.scene.add(sphere);
    // add first sphere
    this.scene.add(this.smoothOrbs.bass[0])
    this.smoothOrbs.bass[0].userData.inScene = true;
    this.scene.add(this.scratchyOrbs.bass[0])
    this.scratchyOrbs.bass[0].userData.inScene = false;
  }

  initOrbsGroup = (params, scratchy) => {
    let orbs = [];
    for (let i = 0; i < params.numSpheres; ++i) {
      let material = new THREE.LineBasicMaterial({color: params.offFilterColor});
      let geometry = this.createOrbGeometry(params, i, scratchy);
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

  createOrbGeometry = (params, idx, scratchy) => {
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
      if (!scratchy) {
        vertex.multiplyScalar(params.scalarOffset);
        vertices.push(vertex.x, vertex.y, vertex.z);
      }
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
    window.removeEventListener("resize", this.onWindowResize, false);
    window.removeEventListener("mousemove", this.onMouseMove, false);
    window.removeEventListener("touchstart", this.onTouch, false);
    window.removeEventListener("touchend", this.onTouchEnd, false);
    window.removeEventListener("load", this.onLoad, false);
    this.container.removeChild(this.renderer.domElement);
  }

  setMouseCoords = (x, y) => {
    this.mouse.x = (x / window.innerWidth) * 2 - 1;
    this.mouse.y = -(y / window.innerHeight) * 2 + 1;
    this.mouseMoved = true;
  }

  onLoad = (event) => {
    this.audioStream.connect()
  }

  onMouseMove = (event) => {
    this.setMouseCoords(event.clientX, event.clientY);
  };

  onTouch = (event) => {
    // event.preventDefault();
    if (event.touches) {
      this.setMouseCoords(event.touches[0].clientX, event.touches[0].clientY);
    }
  };

  // turn off filter if no touch
  onTouchEnd = (event) => {
    // event.preventDefault();
    this.mouse.x = 10000;
    this.mouse.y = 10000;
  }

  onWindowResize = debounce(() => {
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;
    this.renderer.setSize(WIDTH, HEIGHT);
    this.camera.aspect = WIDTH / HEIGHT;
    this.camera.updateProjectionMatrix();
  }, 50);

  stop = () => {
    cancelAnimationFrame(this.frameId);
  }

  animate = () => {
    this.frameId = window.requestAnimationFrame(this.animate);
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
    for (let orbGroup in this.onOrbs) {
      for (let orb of this.onOrbs[orbGroup]) {
        if (!orb.userData.inScene) {
          this.scene.add(orb);
          orb.userData.inScene = true;
        }
      }
    }
    this.setState({allOrbs: true});
  }

  removeAllButFirstOrb = () => {
    for (let orbGroup in this.onOrbs) {
      for (let orb of this.onOrbs[orbGroup]) {
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
    // this.handleIntroOrbGroup(currentTime, BASS_ENTERS, this.onOrbs.bass);
    this.handleIntroOrbGroup(currentTime, MID_ENTERS, this.onOrbs.mid);
    this.handleIntroOrbGroup(currentTime, TREBLE_ENTERS, this.onOrbs.treble);
  }

  getOrbs = (currentTime) => {
    let timeBuffer = SCRATCHY_TIME_BUFFERS[Math.floor(Math.random() * SCRATCHY_TIME_BUFFERS.length)];
    for (let moment of SCRATCHY_MOMENTS) {
      if (Math.abs(currentTime - moment) < timeBuffer) {
        return [this.scratchyOrbs, this.smoothOrbs];
      }
    }
    return [this.smoothOrbs, this.scratchyOrbs];
  }

  toggleOrbs = (currentTime) => {
    [this.onOrbs, this.offOrbs] = this.getOrbs(currentTime);
    for (let orbGroup in this.offOrbs) {
      for (let orb of this.offOrbs[orbGroup]) {
        orb.visible = false;
      }
    }
    for (let orbGroup in this.onOrbs) {
      for (let orb of this.onOrbs[orbGroup]) {
        orb.visible = true;
      }
    }
  }

  updateOrbitControls = () => {
    if (this.orbitControlsActivated) {
      let time = Date.now();
      this.controls.update(time - this.startTime);
    }
  }

  renderByTrackSection = (currentTime) => {
    const {allOrbs} = this.state;

    // toggle orbs
    this.toggleOrbs(currentTime);

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

  renderOrbsWithAnalyser = () => {
    let volBuckets = this.getVolBuckets();
    let freqBuckets = this.getFreqBuckets();
    // explicit for loops to avoid checking for types/names
    // these are the flat gray circles directly orbiting the center black core
    for (let orb of this.onOrbs.treble) {
      let rotationDenominator = this.state.allOrbs ? 3.0 : 16.0;
      orb.rotation.x += BEAT_TIME / rotationDenominator;
      let chordFreqIdx = 16;
      let chordFreqVal = freqBuckets[chordFreqIdx];
      orb.scale.x = orb.scale.y = orb.scale.z = chordFreqVal / 310;
    }

    // these are the background lightest colored orbs
    for (let orb of this.onOrbs.mid) {
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

    // these are the dark center orbs
    for (let orb of this.onOrbs.bass) {
      orb.rotation.x += -BEAT_TIME / 16.0;
      let bassVol = volBuckets[this.bassIndex];
      if (bassVol > this.bassThresh) {
        orb.scale.x = orb.scale.y = orb.scale.z = bassVol / this.normalizingConst;
      }
    }
  }

  renderOrbsSansAnalyser = (currentTime) => {
    let beatPos = Math.floor(currentTime / BEAT_TIME * 8) % 4;
    let smallScale = .65;
    let medScale = .70;
    let largeScale = .75;
    let scale = smallScale;
    if (beatPos % 4 === 0) {
      scale = largeScale;
    } else if (beatPos % 2 === 0){
      scale = medScale;
    }

    // these are the middle orbs
    for (let orb of this.onOrbs.treble) {
      let rotationDenominator = this.state.allOrbs ? 3.0 : 16.0;
      orb.rotation.x += BEAT_TIME / rotationDenominator;
      orb.scale.x = orb.scale.y = orb.scale.z = scale;
    }

    // these are the background lightest colored orbs
    for (let orb of this.onOrbs.mid) {
      let midRotation = 0;
      midRotation = BEAT_TIME / 8.0;
      orb.rotation.x += midRotation;
      orb.rotation.y += midRotation;
      orb.rotation.z += midRotation;
    }

    // these are the center orbs
    for (let orb of this.onOrbs.bass) {
      orb.rotation.x += -BEAT_TIME / 16.0;
      orb.scale.x = orb.scale.y = orb.scale.z = scale;
    }
  }

  renderOrbs = () => {
    let currentTime = this.audioElement.currentTime;
    this.renderByTrackSection(currentTime);
    if (this.audioStream.deactivated) {
      this.renderOrbsSansAnalyser(currentTime);
    } else {
      this.renderOrbsWithAnalyser();
    }
  }


  scaleFreq = (range, minFilterRange, maxFilterRange, targetFilterMinRange, targetFilterMaxRange) => {
    return (targetFilterMaxRange - targetFilterMinRange) *
      (range - minFilterRange) / (maxFilterRange - minFilterRange) + targetFilterMinRange;
  }

  applyFilter = () => {
    const {raycaster, mouse, camera, scene} = this;

    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    //// calculate objects intersecting the picking ray
    let intersects = raycaster.intersectObjects(scene.children);
    let onLoPassSphere = false;

    // first check if the mouse has intersected with the inner sphere
    if (Math.abs(this.camera.position.z) < (RADIUS + FILTER_RADIUS_BUFFER) && 
        Math.abs(this.camera.position.x) < (RADIUS + FILTER_RADIUS_BUFFER) &&
        Math.abs(this.camera.position.y) < (RADIUS + FILTER_RADIUS_BUFFER)) {
      let minFilterRange = 0.0;
      let maxFilterRange = (RADIUS + FILTER_RADIUS_BUFFER);
      let adj = Math.max(Math.abs(this.camera.position.z), Math.abs(this.camera.position.y), Math.abs(this.camera.position.x));
      let freq = this.scaleFreq(adj, minFilterRange, maxFilterRange, FLYTHRU_MIN_FILTER_FREQ, FLYTHRU_MAX_FILTER_FREQ);
      this.audioStream.filter.frequency.value = freq;
      this.audioStream.filter.Q.value = FILTER_RESONANCE;
      onLoPassSphere = true;
      this.scene.background = new THREE.Color(0x000000);
      for (let orbGroup in this.onOrbs) {
        for (let orb of this.onOrbs[orbGroup]) {
          orb.material.color.setHex(orb.userData.onFilterColor);
        }
      }
    } else {
      this.scene.background = new THREE.Color(0xFFFFFF);
      for (let orbGroup in this.onOrbs) {
        for (let orb of this.onOrbs[orbGroup]) {
          orb.material.color.setHex(orb.userData.offFilterColor);
        }
      }
    }

    // second, check if the camera is within the radius of the inner sphere
    if (!onLoPassSphere) { 
      for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.name === 'filterSphere') {
          this.scene.background = new THREE.Color(0x000000);
          let minFilterRange = 0.0;
          let maxFilterRange = 0.3;
          let adj = Math.log(1 + Math.abs(this.mouse.x) + Math.abs(this.mouse.y));
          let freq = this.scaleFreq(adj, minFilterRange, maxFilterRange, HOVER_MIN_FILTER_FREQ, HOVER_MAX_FILTER_FREQ);
          this.audioStream.filter.frequency.value = freq;
          this.audioStream.filter.Q.value = FILTER_RESONANCE;
          onLoPassSphere = true;
          for (let orbGroup in this.onOrbs) {
            for (let orb of this.onOrbs[orbGroup]) {
              orb.material.color.setHex(orb.userData.onFilterColor);
            }
          }
        }
      }
    }

    if (!onLoPassSphere) {
      this.scene.background = new THREE.Color(0xFFFFFF);
      this.audioStream.filter.frequency.value = 22000;
      this.audioStream.filter.Q.value = 0;
      for (let orbGroup in this.onOrbs) {
        for (let orb of this.onOrbs[orbGroup]) {
          orb.material.color.setHex(orb.userData.offFilterColor);
        }
      }
    }
  }

  renderScene = () => {
    this.renderOrbs();
    this.updateOrbitControls();
    this.applyFilter();
    this.renderer.render(this.scene, this.camera);
  }

  safariDebuggerLog = (msg) => {
    document.getElementById("log").innerHTML = msg;
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

export default Release0003;
