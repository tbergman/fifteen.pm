import React, {Component} from 'react';
import * as THREE from 'three';
import {OrbitControls} from '../Utils/OrbitControls';

import './Release.css';
import debounce from 'lodash/debounce';
import * as Cloth from "../Utils/Cloth";

const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;

class Network extends Component {
  shouldComponentUpdate() {
    return false;
  }

  constructor(props, context) {
    super(props, context);

    this.clock = new THREE.Clock();
    this.camera = new THREE.PerspectiveCamera( 30, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0x050505 );
    this.scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );

    this.ambientLight = new THREE.AmbientLight( 0x666666 );

    this.light = new THREE.DirectionalLight( 0xdfebff, 1 );
    this.loader = new THREE.TextureLoader();
    this.clothTexture = this.loader.load( 'assets/circuit_pattern.png' );
    this.clothTexture.anisotropy = 16;
    this.clothMaterial = new THREE.MeshLambertMaterial( {
      map: this.clothTexture,
      side: THREE.DoubleSide,
      alphaTest: 0.5
    });

    this.object = new THREE.Mesh( this.clothGeometry, this.clothMaterial );
    this.object.customDepthMaterial = new THREE.MeshDepthMaterial( {
      depthPacking: THREE.RGBADepthPacking,
      map: this.clothTexture,
      alphaTest: 0.5
    });

    this.ballGeo = new THREE.SphereBufferGeometry( Cloth.ballSize, 32, 16 );
    this.ballMaterial = new THREE.MeshLambertMaterial();

    this.sphere = new THREE.Mesh( this.ballGeo, this.ballMaterial );

    this.groundMaterial = new THREE.MeshLambertMaterial( { map: this.groundTexture } );
    this.groundMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), this.groundMaterial );

    this.poleGeo = new THREE.BoxBufferGeometry( 5, 375, 5 );
    this.poleMat = new THREE.MeshLambertMaterial();
    this.poleMesh = new THREE.Mesh( this.poleGeo, this.poleMat );

    this.poleMatMesh = new THREE.Mesh( new THREE.BoxBufferGeometry( 255, 5, 5 ), this.poleMat );

    this.gg = new THREE.BoxBufferGeometry( 10, 10, 10 );
    this.ggMesh = new THREE.Mesh( this.gg, this.poleMat );

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.windForce = Cloth.windForce;
    this.cloth = Cloth.cloth;
    this.clothGeometry = Cloth.clothGeometry;
    this.simulate = Cloth.simulate;
    this.ballPosition = Cloth.ballPosition;
  }

  componentDidMount() {
    window.addEventListener( 'resize', this.onWindowResize, false );
    this.init();
    this.animate();
  }

  init = () => {
    const {scene, camera, light, ambientLight, object, sphere, groundMesh, poleMesh, controls, poleMatMesh, ggMesh, renderer} = this;
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

    this.groundTexture = this.loader.load( 'textures/terrain/grasslight-big.jpg' );
    this.groundTexture.wrapS = this.groundTexture.wrapT = THREE.RepeatWrapping;
    this.groundTexture.repeat.set( 25, 25 );
    this.groundTexture.anisotropy = 16;

    groundMesh.position.y = - 250;
    groundMesh.rotation.x = - Math.PI / 2;
    groundMesh.receiveShadow = true;
    scene.add( groundMesh );

    poleMesh.position.x = 125;
    poleMesh.position.y = - 62;
    poleMesh.receiveShadow = true;
    poleMesh.castShadow = true;
    scene.add( poleMesh );

    poleMatMesh.position.y = - 250 + ( 750 / 2 );
    poleMatMesh.position.x = 0;
    poleMatMesh.receiveShadow = true;
    poleMatMesh.castShadow = true;
    scene.add( poleMatMesh );

    ggMesh.position.y = - 250;
    ggMesh.position.x = 125;
    ggMesh.receiveShadow = true;
    ggMesh.castShadow = true;
    scene.add( ggMesh );

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    this.container.appendChild( renderer.domElement);

    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;

    controls.maxPolarAngle = Math.PI * 0.5;
    controls.minDistance = 1000;
    controls.maxDistance = 5000;
  }

  onWindowResize = debounce(() => {
    const {camera, renderer} = this;
    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    camera.updateProjectionMatrix();

    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
  }, 100);

  animate = () => {

    const {windForce, simulate} = this;
    requestAnimationFrame( this.animate );

    var time = Date.now();

    var windStrength = Math.cos( time / 7000 ) * 20 + 40;

    windForce.set( Math.sin( time / 2000 ), Math.cos( time / 3000 ), Math.sin( time / 1000 ) )
    windForce.normalize()
    windForce.multiplyScalar( windStrength );

    simulate( time );
    this.renderScene();
  }

  renderScene = () => {
    const {clothGeometry, sphere, renderer, ballPosition, scene, camera} = this;

    var p = this.cloth.particles;

    for ( var i = 0, il = p.length; i < il; i ++ ) {
      clothGeometry.vertices[ i ].copy( p[ i ].position );
    }

    clothGeometry.verticesNeedUpdate = true;
    clothGeometry.computeFaceNormals();
    clothGeometry.computeVertexNormals();

    sphere.position.copy( ballPosition );

    renderer.render( scene, camera );
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

export default Network;
