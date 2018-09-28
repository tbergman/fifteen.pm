import React, {PureComponent, Fragment} from 'react';
import * as THREE from "three";
import {isMobile} from '../../Utils/BrowserDetection';
import debounce from "lodash/debounce";
import GLTFLoader from 'three-gltf-loader';

import SoundcloudPlayer from '../../SoundcloudPlayer';
import Purchase from '../../Purchase';
import {FirstPersonControls} from '../../Utils/FirstPersonControls';
import {loadVideo, loadImage, loadGLTF} from '../../Utils/Loaders';

import * as C from "./constants";
import '../Release.css';
import './index.css';
import {randomChoice, assetPath4Images, sleep } from './utils'

class Release0004 extends PureComponent {
  constructor() {
    super();
    this.clock = new THREE.Clock();
    this.clock.start();
    this.elapsed = 0;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.camera = new THREE.PerspectiveCamera(80, C.SCREEN_WIDTH / C.SCREEN_HEIGHT, 1, 3000);
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(C.SCREEN_WIDTH, C.SCREEN_HEIGHT);

    let lightA = new THREE.HemisphereLight(0xffffff, 0x444444);
    lightA.position.set(1000, 0, 1000);
    this.scene.add(lightA);

    let lightD = new THREE.DirectionalLight( 0xffffff );
    lightD.position.set( -2000, 0, -2000 );
    lightD.target.position.set( 0, 0, 0 );
    this.scene.add(lightD);

    this.controls = new FirstPersonControls(this.camera);
    this.controls.lookSpeed = C.FIRST_PERSON_CONTROL_SPEED;
    this.controls.movementSpeed = C.FIRST_PERSON_CONTROL_MOVEMENT;
    this.controls.enabled = true;
    this.controls.mouseMotionActive = false;

    // this.raycaster = new THREE.Raycaster();
    // this.mouse = new THREE.Vector3();
    this.quaternion = new THREE.Quaternion();
    this.raycaster = new THREE.Raycaster()
    this.path = undefined;
    this.cameraRadians = 0;
    this.initLoader();
    this.objects = {};
  }

  state = {
    curPlanetIdx: 0,
    prevPlanetIdx: 0,
    curVideoState: C.VIDEO_STATE_PAUSED,
    mindState: C.MIND_STATE_FLYING,
    hasChilled: false,
    isLoaded: false
  }

  componentDidMount() {
    window.addEventListener("resize", this.onWindowResize, false);
    this.renderer.domElement.addEventListener("click", this.onClick, false);
    this.renderer.domElement.addEventListener("touchend", this.onClick, false);
    this.progressBar.addEventListener("click", this.onClick, false);
    this.init();
    this.animate();
  }

  componentWillUnmount() {
    this.stop();
    window.removeEventListener("resize", this.onWindowResize, false);
    this.progressBar.domElement.removeEventListener("click", this.onClick, false);
    this.renderer.domElement.removeEventListener("touchend", this.onClick, false);
    this.container.removeChild(this.renderer.domElement);
  }

  init = () => {
    this.initObject(C.SUN);
    this.initPlanets();
    this.initAsteroids();
    this.initPath();
    this.container.appendChild(this.renderer.domElement);
    this.playCurPlanet();
    this.lookAtCurPlanet();
  }

  // event handlers

  onWindowResize = debounce(() => {
    this.renderer.setSize(C.SCREEN_WIDTH, C.SCREEN_HEIGHT);
    this.camera.aspect = C.SCREEN_WIDTH / C.SCREEN_HEIGHT;
    this.camera.updateProjectionMatrix();
  }, 50);

  onClick = (e) => {
    if (this.state.mindState === C.MIND_STATE_CHILLIN) {
      this.setState({
        mindState: C.MIND_STATE_EXITING,
        hasChilled: true,
        prevPlanetIdx: this.state.curPlanetIdx,
        curPlanetIdx: this.state.curPlanetIdx + 1 === C.PLANETS.length ? 0 : this.state.curPlanetIdx + 1
      })
    }
  }

  stop = () => {
    cancelAnimationFrame(this.frameId);
    // RE: https://stackoverflow.com/questions/20997669/memory-leak-in-three-js
    for (let i = 0; i < this.scene.children.length; i++) {
      this.scene.remove(this.scene.children[i]);
      this.renderer.deallocateObject(this.scene.children[i]);
    }
  }

  // object helpers
  loadingText = () => {
    if (isMobile) {
      return "<div class='loading-text-mobile'> A phone cannot contain <br/>the Bodegaverse! </div>"
    } else {
      return  "<div class='loading-text-desktop'> Loading the Bodegaverse </div>"
    }
  }

  initLoader = () => {
    // define gltf loading manager
    this.manager = new THREE.LoadingManager();

    this.manager.onStart = ( url, itemsLoaded, itemsTotal ) => {
      this.emojiProgress = "";
      this.progressBar.innerHTML = "<img class='stretch' src='" + assetPath4Images('wormhole.gif') + "'></img>" +
                                   this.loadingText();
    };

    this.manager.onProgress = ( url, itemsLoaded, itemsTotal ) => {
      let d = this.clock.getDelta();
      this.elapsed += d;
    };

    this.manager.onLoad = ( ) => {
      let sleepTime = C.MIN_LOAD_TIME  - this.elapsed;
      if (sleepTime > 0) {
        sleep(1000 * sleepTime)
      }
      if (!isMobile) {
        this.setState({ isLoaded: true });
        this.progressBar.innerHTML = "";
        this.progressBar.zIndex = -100;
      }
    };

    this.manager.onError = ( url ) => {
      this.progressBar.innerText = 'There was an error! Email dev@globally.lrd';
    };
    this.loader = new GLTFLoader( this.manager );
  }

  addObjectToScene = (obj) => {
    this.scene.add(obj.scene);
    this.objects[obj.name] = obj;
  }

  initObject = (obj) => {
    let output;
    if (obj.type === 'gltf') {
      output = loadGLTF({...obj, loader: this.loader, onSuccess: (x) => {this.addObjectToScene(x)} });
    } else if (obj.type === 'video') {
      output = loadVideo({...obj, computeBoundingSphere: true});
      this.scene.add(output);
      this.objects[obj.name] = output;
    } else if (obj.type === 'image') {
      output = loadImage(obj);
      this.scene.add(output);
      this.objects[obj.name] = output;
    }
    output = this.objects[obj.name];
    return output;
  }

  // asteroids

  initAsteroids = () => {
    for (let i = 0; i < C.ASTEROIDS.length; i++) {
      this.initObject(C.ASTEROIDS[i]);
    }
  }

  // planet utils

  initPlanet = (obj) => {
    this.initObject(obj);
    // down't load moons on mobile
    if (isMobile) {
        return;
    }
    for (let i = 0; i < obj.moons.length; i++) {
      this.initObject(obj.moons[i]);
    }
  }

  initPlanets = () => {
    for (let i = 0; i < C.PLANETS.length; i++) {
      this.initPlanet(C.PLANETS[i]);
    }
  }

  getPlanetByIdx = (idx) => {
    return this.objects[C.PLANETS[idx].name];
  }

  getCurPlanet = () => {
    return this.getPlanetByIdx(this.state.curPlanetIdx);
  }

  lookAtCurPlanet = () => {
    let curPlanet = this.getCurPlanet();
    this.camera.lookAt(curPlanet.position);
  }

  getPrevPlanet = () => {
    return this.getPlanetByIdx(this.state.prevPlanetIdx);
  }

  playCurPlanet = () => {
     this.getCurPlanet().userData.video.play();
  }

  pausePrevPlanet = () => {
    this.getPrevPlanet().userData.video.pause();
  }

  pausePlanets = () => {
    for (var i = 0; i < C.PLANETS.length; i++) {
      if (i !== this.state.prevPlanetIdx) {
        this.getPlanetByIdx(i).userData.video.pause();
      }
    }
  }

  // path

  initPath = () => {

    // add starting point
    let pathVertices = [new THREE.Vector3(...C.STARTING_POINT)];
    for (let i = 0; i < C.PLANETS.length; i++) {
      if (i !== C.PLANETS.length-1) {
        pathVertices.push(new THREE.Vector3(...C.PLANETS[i].position));
      }
    }
    // add sun and asteroids
    pathVertices.push(new THREE.Vector3(0, 0, 0));
    for (let i = 0; i < C.ASTEROIDS.length; i++) {
      pathVertices.push(new THREE.Vector3(...C.ASTEROIDS[i].position));
    }
    // visit the last Planet
    pathVertices.push(new THREE.Vector3(...C.PLANETS[C.PLANETS.length-1].position));
    this.path = new THREE.CatmullRomCurve3(pathVertices);
    this.path.closed = true;
    this.path.arcLengthDivisions = C.PLANETS.length;
  }

  updateSun = () => {
    let sun = this.objects[C.SUN.name];
    if (sun !== undefined) {
      sun.scene.rotation.x += 0.01
    }
  }

  updateAsteroids = () => {
    for (let i = 0; i < C.ASTEROIDS.length; i++) {
      let asteroid = this.objects[C.ASTEROIDS[i].name];
      if (asteroid !== undefined) {
        asteroid.scene.rotation.x += C.ASTEROIDS[i].rotateX;
        asteroid.scene.rotation.y += C.ASTEROIDS[i].rotateY;
        asteroid.scene.rotation.z += C.ASTEROIDS[i].rotateZ;
      }
    }
  }

  updatePlanets = () => {
    for (let i = 0; i < C.PLANETS.length; i++) {
     let planet = this.getPlanetByIdx(i);
      this.quaternion.setFromAxisAngle(C.PLANETS[i].axis, C.PLANETS[i].angle);
      planet.applyQuaternion(this.quaternion);
    }
  }

  rotateAboutPoint = (obj, point, axis, theta, pointIsWorld) => {
    pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;
    if(pointIsWorld){
      obj.parent.localToWorld(obj.position); // compensate for world coordinate
    }
    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset
    if(pointIsWorld){
      obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
    }
    obj.rotateOnAxis(axis, theta); // rotate the OBJECT
  }

  updateMoons = () => {
    // down't update moons on mobile
    if (isMobile) {
      return;
    }
    for (let i = 0; i < C.PLANETS.length; i++) {
      let planet = C.PLANETS[i];
      for (let j = 0; j < planet.moons.length; j++) {
        let moonName = planet.moons[j].name;
        let moon = this.objects[moonName];
        if (moon !== undefined) {
          let position = new THREE.Vector3(...planet.position);
          let pointIsWorld = true;// false;
          this.rotateAboutPoint(
            moon.scene.children[0],
            position,
            planet.moons[j].axis,
            planet.moons[j].theta,
            pointIsWorld);
        }
      }
    }
  }

  updateCameraPos = () => {
    let curPlanet = this.getCurPlanet();
    let distanceFromPlanet = this.camera.position.distanceTo(curPlanet.position);

    // have we arrived at the next Planet?
    // todo: fix this constant
    if (distanceFromPlanet < C.MIND_STATE_CHILLIN_THRESHOLD &&
      this.state.mindState !== C.MIND_STATE_EXITING &&
      this.state.mindState !== C.MIND_STATE_CHILLIN) {
      this.setState({mindState: C.MIND_STATE_CHILLIN, hasChilled: true});

    }
    // are we in transit ?
    if (this.state.mindState !== C.MIND_STATE_CHILLIN) {

      // check if we're exiting the previous Planet
      if (this.state.mindState !== C.MIND_STATE_FLYING) {
        if (this.state.curVideoState !== C.VIDEO_STATE_PLAYING) {
          this.pausePlanets();
          this.playCurPlanet();
          this.setState({curVideoState: C.VIDEO_STATE_PLAYING});
          this.setState({
            curVideoState: C.VIDEO_STATE_PAUSED,
            mindState: C.MIND_STATE_FLYING
          });
        }
      }
      // advance
      this.cameraRadians += C.CAMERA_SPEED;
      let holePos = this.path.getPoint(this.cameraRadians);
      this.camera.position.set(holePos.x, holePos.y, holePos.z);
    }
  }

  animate = () => {
    this.frameId = window.requestAnimationFrame(this.animate);
    this.renderScene();
  }

  renderScene = () => {
    if (this.state.isLoaded) {
      this.controls.update(this.clock.getDelta());
      this.updateSun();
      this.updatePlanets();
      this.updateMoons();
      this.updateAsteroids();
      this.updateCameraPos();
      this.renderer.render(this.scene, this.camera);
    }
  }

  render() {
    return (
      <Fragment>
        <div className="release">
          <div ref={element => this.container = element}>
            <div id={"progress-bar"} ref={element => this.progressBar = element}/>
          </div>
        </div>
        <SoundcloudPlayer
        trackId='267037220'
        message='JON CANNON'
        inputRef={el => this.audioElement = el}
        fillColor="white"/>
        <Purchase fillColor="white" href='https://gltd.bandcamp.com/track/lets-beach'/>
      </Fragment>
    );
  }
}

export default Release0004;
