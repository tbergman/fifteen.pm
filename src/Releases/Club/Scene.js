/* eslint import/no-webpack-loader-syntax: off */
import chromaFragmentShader from "!raw-loader!glslify-loader!../../Shaders/chromaKeyFragment.glsl";
/* eslint import/no-webpack-loader-syntax: off */
import chromaVertexShader from "!raw-loader!glslify-loader!../../Shaders/chromaKeyVertex.glsl";
import debounce from "lodash/debounce";
import React, { Component } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

import "../../UI/Player/Player.css";
import { loadGLTF } from "../../Utils/Loaders";
import {
  initFoamGripMaterial,
  initPinkRockMaterial,
  initPinkShinyMaterial,
  initRockMaterial,
  initTransluscentMaterial
} from "../../Utils/materials.js";
import { Water } from "three/examples/jsm/objects/Water2";
import "../Release.css";
import { CONSTANTS, OFFICE } from "./constants.js";
import { assetPathClub, assetPath8 } from "./utils.js";

export default class Scene extends Component {
  state = {};

  componentDidMount() {
    this.init();
    window.addEventListener("touchmove", this.onTouchMove, false);
    window.addEventListener("resize", this.onWindowResize, false);
    this.animate();
  }

  componentWillUnmount() {
    this.stop();
    window.removeEventListener("resize", this.onWindowResize, false);
    window.removeEventListener("touchmove", this.onTouchMove, false);
    this.container.removeChild(this.renderer.domElement);
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { section } = this.state;
  };

  onTouchMove(e) {
    if (e.scale !== 1) {
      event.preventDefault();
    }
  }

  stop = () => {
    cancelAnimationFrame(this.frameId);
  };

  // onDocumentMouseMove() {
  // }

  onWindowResize = debounce(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }, 50);

  init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xFF0FFF);
    // main initialization parameters
    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
    this.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    this.scene.add(this.camera);
    this.camera.position.set(0,150,400);
    this.camera.lookAt(this.scene.position);		
    
    // LIGHT
	  this.light = new THREE.PointLight(0xffffff);
	  this.light.position.set(0,250,0);
    this.scene.add(this.light);
	  // added ambient light and color for better results
	  this.ambientLight = new THREE.AmbientLight(0x444444);
	  this.scene.add(this.ambientLight);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);

    const manager = new THREE.LoadingManager();
    this.gltfLoader = new GLTFLoader(manager);
    this.textureLoader = new THREE.TextureLoader();

    // CONTROLS
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = 4;
    this.controls.maxDistance = 40;
    this.controls.autoRotate = true;
    this.clock = new THREE.Clock();
    // release-specific objects

    // release-specific initilization
    this.initScene();
    // this.muteMainAudio();
  }

  setVideoTransform() {
    const { chromaMesh } = this;
    chromaMesh.position.set(0, 0, 0);
    chromaMesh.rotation.set(0, 0, 0);
    chromaMesh.scale.set(5, 5, 5);
  }

  // TODO setup callback pattern on gltf loads rather than set interval...
  initScene = () => {
    this.initFog();
    this.initFloor();
    this.initVideo('oMo2afi7BGY');
    this.initLights();
  };


  initFog() {
	  // SKYBOX/FOG
	  this.scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );
  }

  initFloor() {
    // FLOOR
    this.floorTexture = new THREE.ImageUtils.loadTexture(assetPathClub('images/checkerboard.jpg'));
    this.floorTexture.wrapS = this.floorTexture.wrapT = THREE.RepeatWrapping; 
    this.floorTexture.repeat.set( 10, 10 );
    this.floorMaterial = new THREE.MeshBasicMaterial( { map: this.floorTexture, side: THREE.DoubleSide } );
    this.floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
    this.floor = new THREE.Mesh(this.floorGeometry, this.floorMaterial);
    this.floor.position.y = -25;
    this.floor.rotation.x = Math.PI / 2;
    this.scene.add(this.floor);
  }


  initVideo = (id) => {

    var div = document.createElement( 'div' );
    div.style.width = '480px';
    div.style.height = '360px';
    div.style.backgroundColor = '#000';

    var iframe = document.createElement( 'iframe' );
    iframe.style.width = '480px';
    iframe.style.height = '360px';
    iframe.style.border = '0px';
    iframe.src = [ 'https://www.youtube.com/embed/', id, '?rel=0' ].join( '' );
    div.appendChild( iframe );

    var object = new CSS3DObject( div );
    object.position.set( 0, 0, 0 );

    this.scene.add(object);
  };

  initLights() {
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1).normalize();
    this.scene.add(directionalLight);
    var pointLight = new THREE.PointLight(0xffffff);
    this.pointLight = pointLight;
    this.scene.add(this.pointLight);
  }

  animate = () => {
    setTimeout(() => {
      this.frameId = window.requestAnimationFrame(this.animate);
    }, 1000 / 30);
    this.renderScene();
  };

  updateLights() {
    const { clock, pointLight } = this;
    pointLight.userData.angle -= 0.025;
    let lightIntensity =
      0.75 + 0.25 * Math.cos(clock.getElapsedTime() * Math.PI);
    pointLight.position.x = 10 + 10 * Math.sin(pointLight.userData.angle);
    pointLight.position.y = 10 + 10 * Math.cos(pointLight.userData.angle);
    pointLight.color.setHSL(lightIntensity, 1.0, 0.5);
    return lightIntensity;
  }

  getVideoCurrentTime() {
    const { chromaMesh } = this;
    if (!chromaMesh) return 0;
    return chromaMesh.material.uniforms.iChannel0.value.image.currentTime;
  }

  renderScene = () => {
    const { renderer, scene, camera, controls, clock } = this;
    controls.update(clock.getDelta());
    this.updateLights();
    renderer.render(scene, camera);
  };

  render() {
    return (
      <div className="release">
        <div ref={element => (this.container = element)} />
      </div>
    );
  }
}
