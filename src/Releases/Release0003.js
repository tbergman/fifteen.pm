import React, {PureComponent, Fragment} from 'react';
import * as THREE from "three";
import debounce from 'lodash/debounce';
import './Release.css';
import Player from '../Player';
import Purchase from '../Purchase';
import {isFirefox, isChrome} from '../Utils/BrowserDetection';

class Release0003 extends PureComponent {
  constructor() {
    super();
    this.bpm = 145;
    this.beatTime = (60 / 145) * 1000;
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xFFFFFF);
    this.camera = new THREE.PerspectiveCamera(80, this.screenWidth / this.screenHeight, 1, 3000);
    this.camera.position.z = 1000;
    this.radius = 450;

    this.scratches = this.constructLines();
    let useOrbs = true;
    this.orbs = this.constructLines(useOrbs);

    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.screenWidth, this.screenHeight);


    setInterval(() => {
      let newArr = [];
      let oldArr = [];
      if (useOrbs) {
        newArr = this.orbs;
        oldArr = this.scratches;
        useOrbs = false
      } else {
        newArr = this.scratches;
        oldArr = this.orbs;
        useOrbs = true
      }
      for (let i = 0; i < this.scratches.length; i++) {
        this.scene.remove(oldArr[i]);
        this.scene.add(newArr[i]);
      }
    }, this.beatTime / 2.0);

  }

  componentDidMount() {
    window.addEventListener("touchstart", this.onDocumentMouseMove, false);
    window.addEventListener("touchmove", this.onDocumentMouseMove, false);
    window.addEventListener('resize', this.onWindowResize, false);
    this.init();
    this.animate();
  }

  init = () => {
    // this.scene.add(new THREE.BoxGeometry(10, 10, 10));
    this.container.appendChild(this.renderer.domElement);
  }

  constructLines = (makeCircles) => {
    let parameters = [
      [1, 0x666666, 1, 2],
      [2, 0x111111, 1, 1],
      [3, 0xaaaaaa, 0.75, 1],
      [4, 0xffaa00, 0.5, 1],
      [5, 0x000833, 0.8, 1],
      [4, 0xaaaaaa, 0.75, 2],
      [3, 0x000000, 0.5, 1],
      [2, 0x000000, 0.25, 1],
      [1, 0x000000, 0.125, 1]
    ];
    let geometry = this.createGeometry(makeCircles);
    let lines = [];
    for (let i = 0; i < parameters.length; ++i) {
      let p = parameters[i];
      let material = new THREE.LineBasicMaterial({color: p[1], opacity: p[2], linewidth: p[3]});
      let line = new THREE.LineSegments(geometry, material);
      line.scale.x = line.scale.y = line.scale.z = p[0];
      line.userData.originalScale = p[0];
      // line.rotation.y = Math.random() * Math.PI;
      line.updateMatrix();
      lines.push(line)
    }
    return lines
  }

  createGeometry = (makeCircles = false) => {
    var geometry = new THREE.BufferGeometry();
    var vertices = [];
    var vertex = new THREE.Vector3();
    for (let i = 0; i < 1500; i++) {
      vertex.x = Math.random() * 2 - 1;
      vertex.y = 1; //Math.random() * 2 - 1;
      vertex.z = Math.random() * 2 - 1;
      vertex.normalize();
      vertex.multiplyScalar(this.radius);
      vertices.push(vertex.x, vertex.y, vertex.z);
      if (makeCircles) {
        vertex.multiplyScalar(0.8);
        vertices.push(vertex.x, vertex.y, vertex.z);
      }
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


  addAudio = () => {
    window.onload = () => {
      if (isFirefox === true) {
        this.audioStream = this.audioElement.mozCaptureStream();
      } else if (isChrome) {
        this.audioStream = this.audioElement.captureStream();
      }

      if (this.audioStream !== undefined) {
        if (isChrome) {
          this.audioStream.onactive = () => {
            this.createAudioSource();
          };
        }
        else {
          this.createAudioSource();
        }
      }
    }
  }

  createAudioSource = () => {
    let source = this.audioCtx.createMediaStreamSource(this.audioStream);
    source.connect(this.audioAnalyser);
    source.connect(this.audioCtx.destination);
  }

  animate = () => {
    this.frameId = window.requestAnimationFrame(this.animate);
    this.renderScene();
  }

  renderScene = () => {
    let time = Date.now() * 0.001;
    for (let i = 0; i < this.scene.children.length; i++) {
      let object = this.scene.children[i];
      if (object.isLine) {
        if (i % 2 === 0) {
          object.rotation.x = -time
        } else {
          // determines rotation direction
          // // if (i % 2) {
          object.rotation.x = time
          //object.rotation.y = -time// * 30//  Math.tan(30);	// * Math.tan(30) + 10// ( i < 4 ? ( i + 1 ) : - ( i + 1 ) );
          // // } else {
          // 	object.rotation.x =  time * Math.tan(3) + 10;// time * ( i < 4 ? ( i + 1 ) : - ( i + 1 ) );
        }
        if (i % 3 === 0) {
          // object.position.y = time * .1;
          // object.position.x = time * .1;
          // object.position.z = time * .1;
          // if ( i % 2 ) {
          var scale = .5	//object.userData.originalScale * ( i / 5 + 1 ) * ( 1 + 0.5 * Math.cos( 7 * time ) );
          // // pulsates spheres
          // //object.scale.x = object.scale.y =
          object.scale.y = scale;
        } else {
          object.scale.y = .1
        }
        //}
      }
    }
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <Fragment>
        <div className="release">
          <div ref={element => this.container = element}/>
          <Player
            src='assets/0002-yearunknown.mp3'
            type='audio/mpeg'
            message='OTHERE'
            inputRef={el => this.audioElement = el}/>
          <Purchase/>
        </div>
      </Fragment>
    );
  }
}

export default Release0003;
