import React, {Component, Fragment} from 'react';
import '../Release.css';
import * as THREE from "three";
import {OrbitControls} from "../../Utils/OrbitControls";
import {CONSTANTS} from "./constants";
import Footer from '../../Footer';
import GLTFLoader from "three-gltf-loader";
import {loadGLTF} from "../../Utils/Loaders";
import {assetPath} from "../../Utils/assets";
import {CONTENT} from "../../Content";

export const assetPath7 = (p) => {
  return assetPath("7/" + p);
}

class Release0007 extends Component {
  state = {
  }

  componentDidMount() {
    this.init();
    window.addEventListener("resize", this.onResize, false);
    this.animate();
  }

  init = () => {
    this.time = 0;
    this.startTime = Date.now();
    this.clock = new THREE.Clock();
    this.manager = new THREE.LoadingManager();
    this.loader = new GLTFLoader(this.manager);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    // Store the position of the mouse
    // Default is center of the screen
    this.mouse = {
      position: new THREE.Vector2(0, 0),
      target: new THREE.Vector2(0, 0)
    };
    this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 100);
    const light1  = new THREE.AmbientLight(0x111111, 10);
    light1.name = 'ambient_light';
    this.scene.add( light1 );

    const light2  = new THREE.DirectionalLight(0x111111, 10);
    light2.position.set(0.5, 0, 0.866); // ~60º
    light2.name = 'main_light';
    this.scene.add( light2 );

    this.camera.position.set(40, 0, 0);
    this.createHourglass();
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.maxDistance = 1500;
    this.controls.autoRotate = false;
    this.controls.autoRotateSpeed = -10;
    this.controls.screenSpacePanning = true;
  }

  createHourglass() {
    const hourglassPath = assetPath7("objects/hourglass_and_stars.gltf");
    const renderHourglass = gltfObj => this.renderHourglass(gltfObj);
    this.hourglassGroup = new THREE.Group();

    const hourglassLoadGLTFParams = {
      url: hourglassPath,
      name: "hourglass",
      position: [0, 0, 0],
      rotateX: 0,
      rotateY: -33,
      rotateZ: 0,
      relativeScale: 1,
      loader: this.loader,
      onSuccess: renderHourglass,
    }

    loadGLTF({...hourglassLoadGLTFParams});
  }

  renderHourglass = (gltfObj) => {
    gltfObj.scene.updateMatrixWorld();
    gltfObj.scene.position
    this.scene.add(gltfObj.scene);
    return gltfObj;
  }

  onResize = () => {
    // On resize, get new width & height of window
    const ww = document.documentElement.clientWidth || document.body.clientWidth;
    const wh = window.innerHeight;
    // Update camera aspect
    this.camera.aspect = ww / wh;
    // Reset aspect of the camera
    this.camera.updateProjectionMatrix();
    // Update size of the canvas
    this.renderer.setSize(ww, wh);
  };

  animate = () => {
    this.frameId = window.requestAnimationFrame(this.animate);
    let time = Date.now();
    let delta = time - this.startTime;
    this.controls.update(delta);
    this.renderScene();
  }

  renderScene() {
    let delta = this.clock.getDelta();
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <Fragment>
        <div ref={element => this.container = element}/>
        <Footer
          content={CONTENT[window.location.pathname]}
          fillColor="white"
          audioRef={el => this.audioElement = el}
        />
      </Fragment>
    );
  }
}

export default Release0007;
