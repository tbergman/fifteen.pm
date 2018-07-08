import React, {Component} from 'react';
import * as THREE from 'three';
import {MarchingCubes, EffectComposer, ShaderPass, FXAAShader, HorizontalTiltShiftShader, VerticalTiltShiftShader, RenderPass} from '../Utils/ShaderPass';
import {OrbitControls} from '../Utils/OrbitControls';
import './Release.css';
import debounce from 'lodash/debounce';

const MARGIN = 0;
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight - 2 * MARGIN;
let resolution = 50;
const numBlobs = 10;

class MorphingBalls extends Component {
  shouldComponentUpdate() {
    return false;
  }

  constructor(props, context) {
    super(props, context);

    this.clock = new THREE.Clock();
    this.camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0x050505 );
    this.scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );

    this.ambientLight = new THREE.AmbientLight( 0x666666 );

    this.light = new THREE.DirectionalLight( 0xdfebff, 1 );
    this.loader = new THREE.TextureLoader();
    this.clothTexture = loader.load( 'textures/patterns/circuit_pattern.png' );
    this.clothTexture.anisotropy = 16;
    this.clothMaterial = new THREE.MeshLambertMaterial( {
      map: this.clothTexture,
      side: THREE.DoubleSide,
      alphaTest: 0.5
    });
    this.clothGeometry = new THREE.ParametricGeometry( clothFunction, cloth.w, cloth.h );
    this.object = new THREE.Mesh( this.clothGeometry, this.clothMaterial );
    this.object.customDepthMaterial = new THREE.MeshDepthMaterial( {
      depthPacking: THREE.RGBADepthPacking,
      map: this.clothTexture,
      alphaTest: 0.5
    });

    this.ballGeo = new THREE.SphereBufferGeometry( ballSize, 32, 16 );
    this.ballMaterial = new THREE.MeshLambertMaterial();
    this.sphere = new THREE.Mesh( this.ballGeo, this.ballMaterial );

    this.groundMaterial = new THREE.MeshLambertMaterial( { map: this.groundTexture } );
    this.mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), this.groundMaterial );

  }

  componentDidMount() {
  }

  init = () => {
    const {scene, camera, light, ambientLight, object, sphere, mesh} = this;
    const container = this.container;
    const d = 300;

    camera.position.set( 1000, 50, 1500 );
    scene.add(ambientLight);

    light.position.set( 50, 200, 100 );
    light.position.multiplyScalar( 1.3 );
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.camera.left = - d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = - d;
    light.shadow.camera.far = 1000;
    scene.add( light );

    object.position.set( 0, 0, 0 );
    object.castShadow = true;
    scene.add( object );

    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add( sphere );

    this.groundTexture = loader.load( 'textures/terrain/grasslight-big.jpg' );
    this.groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    this.groundTexture.repeat.set( 25, 25 );
    this.groundTexture.anisotropy = 16;

    mesh.position.y = - 250;
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );


  }
  render() {
    return (
      <div
        id="container"
        ref={element => this.container = element}
      ></div>
    );
  }
}

export default MorphingBalls;
