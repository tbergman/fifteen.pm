import React, {Component} from 'react';
import * as THREE from 'three';
import {OrbitControls} from '../Utils/OrbitControls';

import './Release.css';
import debounce from 'lodash/debounce';
import * as Cloth from "../Utils/Cloth";
import {plane} from "../Utils/Cloth";

const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;

class Network extends Component {
  shouldComponentUpdate() {
    return false;
  }

  constructor(props, context) {
    super(props, context);

    this.clock = new THREE.Clock();
    this.camera = new THREE.PerspectiveCamera( 30, SCREEN_WIDTH  / SCREEN_HEIGHT, 1, 10000 );

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog( 0x363dc2, 500, 10000 );

    this.loader = new THREE.TextureLoader();

    // this.sphere = Cloth.sphere;
    // this.ballPosition = Cloth.ballPosition;

    this.renderer = new THREE.WebGLRenderer( { antialias: true, devicePixelRatio: 1 } );
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.ambientLight = new THREE.AmbientLight( 0x666666 );
    this.light = new THREE.DirectionalLight( 0xdfebff, 1.75 );

    this.clothMaterial = new THREE.MeshPhongMaterial( {
      color: 0xaa2929,
      specular: 0x030303,
      wireframeLinewidth: 2,
      //map: clothTexture,
      side: THREE.DoubleSide,
      alphaTest: 0.5
    } );

    // cloth geometry
    // the geometry contains all the points and faces of an object
    this.clothInitialPosition = this.plane( 500, 500 );
    this.cloth = Cloth.cloth;

    this.clothGeometry = new THREE.ParametricGeometry( this.clothInitialPosition , this.cloth.w, this.cloth.h);
    // cloth mesh
    // a mesh takes the geometry and applies a material to it
    // so a mesh = geometry + material
    this.clothObject = new THREE.Mesh( this.clothGeometry, this.clothMaterial );

    // ground material
    this.groundMaterial = new THREE.MeshPhongMaterial(
      {
        color: 0x000000,//0x3c3c3c,
        specular: 0x404761//0x3c3c3c//,
        //map: groundTexture
      } );

    this.groundMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), this.groundMaterial );

    // poles

    this.poleGeo = new THREE.BoxGeometry( 5, 250+125, 5 );
    this.poleMat = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, shininess: 100, side: THREE.DoubleSide} );
    this.pole1 = new THREE.Mesh( this.poleGeo, this.poleMat );
    this.pole2 = new THREE.Mesh( this.poleGeo, this.poleMat );
    this.pole3 = new THREE.Mesh( this.poleGeo, this.poleMat );
    this.pole4 = new THREE.Mesh( this.poleGeo, this.poleMat );
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize, false);

    this.init();
    this.animate();

  }

  init = () => {
    const {scene, camera, ambientLight, light, controls, renderer, clothGeometry, clothObject, groundMesh, pole1, pole2, pole3, pole4} = this;


    camera.position.y = 450;
    camera.position.z = 1500;
    camera.lookAt( scene.position );
    scene.add( camera );

    // sphere.castShadow = true;
    // sphere.receiveShadow = true;
    // scene.add(sphere);

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.setClearColor( scene.fog.color );
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;

    controls.maxPolarAngle = Math.PI * 0.5;
    controls.minDistance = 1000;
    controls.maxDistance = 5000;

    light.position.set( 50, 200, 100 );
    light.position.multiplyScalar( 1.3 );
    light.castShadow = true;
    // light.shadowCameraVisible = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    scene.add(light);
    scene.add(ambientLight);

    clothGeometry.dynamic = true;

    clothObject.position.set( 0, 0, 0 );
    clothObject.castShadow = true;
    scene.add( clothObject ); // add cloth to the scene

    groundMesh.position.y = -250;
    groundMesh.rotation.x = - Math.PI / 2;
    groundMesh.receiveShadow = true;
    scene.add( groundMesh ); // add ground to scene

    pole1.position.x = -250;
    pole1.position.z = 250;
    pole1.position.y = -(125-125/2);
    pole1.receiveShadow = true;
    pole1.castShadow = true;
    scene.add( pole1 );

    pole2.position.x = 250;
    pole2.position.z = 250;
    pole2.position.y = -(125-125/2);
    pole2.receiveShadow = true;
    pole2.castShadow = true;
    scene.add( pole2 );

    pole3.position.x = 250;
    pole3.position.z = -250;
    pole3.position.y = -(125-125/2);
    pole3.receiveShadow = true;
    pole3.castShadow = true;
    scene.add( pole3 );

    pole4.position.x = -250;
    pole4.position.z = -250;
    pole4.position.y = -62;
    pole4.receiveShadow = true;
    pole4.castShadow = true;
    scene.add( pole4 );

    // pinCloth sets how the cloth is pinned
    Cloth.pinCloth('Corners');

    const fontJson = require("../fonts/helvetiker_bold.typeface.json");
    const font = new THREE.Font(fontJson);
    var textGeo = new THREE.TextGeometry("Network", {
      font: font,
      size: 130,
      height: 1,
      curveSegments: 4,
      bevelEnabled: true
    });
    var textMaterial = new THREE.MeshPhongMaterial({color: 0xff0000});
    var mesh = new THREE.Mesh(textGeo, textMaterial);
    mesh.position.set(-100, -280, 0);
    this.scene.add(mesh);

    this.container.appendChild(renderer.domElement);
  }

  onWindowResize = debounce(() => {
    const {camera, renderer} = this;
    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    camera.updateProjectionMatrix();

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  }, 100);

  plane = ( width, height ) => {

    return function( u, v ) {

      var x = u * width - width/2;
      var y = 125; //height/2;
      var z = v * height - height/2;

      return new THREE.Vector3( x, y, z );

    };

  }
  animate = () => {
    requestAnimationFrame(this.animate);


    var time = Date.now();

    Cloth.simulate(time); // run physics simulation to create new positions of cloth
    this.renderScene();
  }

  wireFrame = () =>{
    const {poleMat, clothMaterial, ballMaterial} = this;
    poleMat.wireframe = !poleMat.wireframe;
    clothMaterial.wireframe = !clothMaterial.wireframe;
    ballMaterial.wireframe = !ballMaterial.wireframe;

  }

  renderScene = () => {
    const {sphere, renderer, scene, camera, clothGeometry} = this;


    // update position of the cloth
    // i.e. copy positions from the particles (i.e. result of physics simulation)
    // to the cloth geometry
    // update position of the cloth
    // i.e. copy positions from the particles (i.e. result of physics simulation)
    // to the cloth geometry
    var p = this.cloth.particles;
    for ( var i = 0, il = p.length; i < il; i ++ ) {

      clothGeometry.vertices[ i ] =  p[ i ].position;
    }

    // recalculate cloth normals
    clothGeometry.computeFaceNormals();
    clothGeometry.computeVertexNormals();

    clothGeometry.normalsNeedUpdate = true;
    clothGeometry.verticesNeedUpdate = true;

    // // update sphere position from ball position
    // sphere.position.copy( ballPosition );
    //
    // sphere.position.copy(ballPosition);
    renderer.render(scene, camera);
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
