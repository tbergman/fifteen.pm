import debounce from "lodash/debounce";
import React, { Component } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';

import "../../UI/Player/Player.css";
import "../Release.css";
import { CONSTANTS, OFFICE } from "./constants.js";
import { assetPathClub, assetPath8 } from "./utils.js";

export default class Scene extends Component {

  componentDidMount() {
    this.init();
    console.log(this.props);
    window.addEventListener("touchmove", this.onTouchMove, false);
    window.addEventListener("resize", this.onWindowResize, false);
    this.animate();
  }

  componentWillUnmount() {
    this.stop();
    window.removeEventListener("resize", this.onWindowResize, false);
    window.removeEventListener("touchmove", this.onTouchMove, false);
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
    this.rendererCSS.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }, 50);

  init() {
    // this.scene.background = new THREE.Color(0xFF0FFF);
    
    // main initialization parameters
    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 1, FAR = 5000;
    this.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    this.camera.position.set( 0, 1000, 0 );
    this.sceneCSS = new THREE.Scene();
    this.rendererCSS	= new CSS3DRenderer(SCREEN_WIDTH, SCREEN_HEIGHT );
    this.rendererCSS.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    // this.rendererCSS.domElement.style.position	= 'absolute';
    // this.rendererCSS.domElement.style.top	= 0;
    // this.rendererCSS.domElement.style.margin	= 0;
    // this.rendererCSS.domElement.style.padding	= 0;
    this.container.appendChild(this.rendererCSS.domElement);

    this.controls = new OrbitControls( this.camera, this.rendererCSS.domElement );

    // Live stream
    this.iframe	= document.createElement('iframe')
    this.iframe.style.width = '480px';
    this.iframe.style.height = '360px';
    this.iframe.style.border = '1px';
    this.iframe.style.backgroundColor = '#ffffff';

    this.iframe.src = [ 'http://www.youtube.com/embed/', this.props.content.liveStreamVideoID, '?controls=0' ].join( '' );
    this.iframe3D = new CSS3DObject( this.iframe );
    this.iframe3D.position.set(0, 0,  0);
    this.camera.lookAt(this.iframe3D);
    this.iframe3D.rotation.x = -Math.PI / 2;
    this.sceneCSS.add(this.iframe3D)


    // Grid Helper 
    var size = 10;
    var divisions = 10;
    var gridHelper = new THREE.GridHelper( size, divisions );
    this.sceneCSS.add(gridHelper);
  }

  animate = () => {
    requestAnimationFrame( this.animate );
    this.renderScene();
    console.log(this.camera.position)
  };

  renderScene = () => {
    this.controls.update();
    this.rendererCSS.render(this.sceneCSS, this.camera);
  };

  render() {
    return (
      <div className="release">
        <div ref={element => (this.container = element)} />
      </div>
    );
  }
}
