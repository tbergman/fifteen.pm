import React, {Component} from 'react';
import * as THREE from 'three';
import * as Cloth from '../Utils/Cloth';
import './Release.css';
import {OrbitControls} from '../Utils/OrbitControls';
import debounce from 'lodash/debounce';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const GRAVITY = 9.81 * 140; //
const DAMPING = 0.03;
const DRAG = 1 - DAMPING;
const MASS = .1;
const TIMESTEP = 18 / 1000;
const TIMESTEP_SQ = TIMESTEP * TIMESTEP;

class Network extends Component {
  shouldComponentUpdate() {
    return false;
  }

  constructor(props, context) {
    super(props, context);

    // scene (First thing you need to do is set up a scene)
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );

    // camera (Second thing you need to do is set up the camera)
    this.camera = new THREE.PerspectiveCamera( 30, WIDTH / HEIGHT, 1, 10000 );

    this.renderer = new THREE.WebGLRenderer( { antialias: true, devicePixelRatio: 1 } );
    this.light = new THREE.DirectionalLight( 0xdfebff, 1.75 );
    this.ambientLight = new THREE.AmbientLight( 0x666666 );

    this.cloth = Cloth.cloth;
    this.clothMaterial = new THREE.MeshPhongMaterial( {
      color: 0xaa2929,
      specular: 0x030303,
      wireframeLinewidth: 2,
      //map: clothTexture,
      side: THREE.DoubleSide,
      alphaTest: 0.5,
      wireframe: true
    } );

    this.clothGeometry = new THREE.ParametricGeometry( this.plane, this.cloth.w, this.cloth.h );
    this.clothGeometry.dynamic = true;

    // cloth mesh
    this.object = new THREE.Mesh( this.clothGeometry, this.clothMaterial );

    this.groundMaterial = new THREE.MeshPhongMaterial(
      {
        color: 0x404761,//0x3c3c3c,
        specular: 0x404761//0x3c3c3c//,
        //map: groundTexture
      } );

    // ground mesh
    this.groundMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), this.groundMaterial );
    this.poleGeo = new THREE.BoxGeometry( 5, 250+125, 5 );
    this.poleMat = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, shininess: 100, side: THREE.DoubleSide} );
    this.pole1 = new THREE.Mesh( this.poleGeo, this.poleMat );
    this.pole2 = new THREE.Mesh( this.poleGeo, this.poleMat );
    this.pole3 = new THREE.Mesh( this.poleGeo, this.poleMat );
    this.pole4 = new THREE.Mesh( this.poleGeo, this.poleMat );
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.gravity = new THREE.Vector3( 0, - GRAVITY, 0 ).multiplyScalar( MASS );

  }

  componentDidMount() {
    this.init();
    this.animate();
  }

  init = () => {
    const {scene, camera, renderer, light, ambientLight, object, groundMesh, pole1, pole2, pole3, pole4, controls} = this;

    camera.position.y = 450;
    camera.position.z = 1500;
    scene.add( camera );

    renderer.setSize( WIDTH, HEIGHT );
    renderer.setClearColor( scene.fog.color );
    this.container.appendChild( renderer.domElement );
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;

    scene.add( ambientLight );
    light.position.set( 50, 200, 100 );
    light.position.multiplyScalar( 1.3 );
    light.castShadow = true;
    // light.shadowCameraVisible = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    const d = 300;
    light.shadow.camera.left = -d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = -d;
    light.shadow.camera.far = 1000;
    scene.add( light );

    object.position.set( 0, 0, 0 );
    object.castShadow = true;
    scene.add( object ); // add cloth to the scene

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

    Cloth.pinCloth('oneEdge');

    // CONTROLS
    // controls.minDistance = 200;
    // controls.maxDistance = 1500;
    // controls.minPolarAngle = 0; // radians
    // controls.maxPolarAngle = Math.PI/2; // radians
    this.controls.update();

  }

  plane = ( width, height, target ) => {

    var x = 1 * width - width/2;
    var y = 125; //height/2;
    var z = 1 * height - height/2;

    target.set( x, y, z );
  }

  animate = () => {
    requestAnimationFrame( this.animate );

    this.renderScene();
    var time = Date.now();

    this.simulate(time); // run physics simulation to create new positions of cloth
    this.renderScene();
    this.controls.update();
  }

  cloth = ( w, h, l ) => {

    //w = w || 10;
    //h = h || 10;
    this.w = w;
    this.h = h;
    let restDistance = l/w; // assuming square cloth for now


    var particles = [];
    var constrains = [];

    var u, v;

    // Create particles
    for (v=0; v<=h; v++) {
      for (u=0; u<=w; u++) {
        particles.push(
          new Cloth.Particle(u/w, v/h, 0, MASS)
        );
      }
    }

    for (v=0; v<=h; v++) {
      for (u=0; u<=w; u++) {

        if(v<h && (u == 0 || u == w)){
          constrains.push( [
            particles[ index( u, v ) ],
            particles[ index( u, v + 1 ) ],
            restDistance
          ] );
        }

        if(u<w && (v == 0 || v == h)){
          constrains.push( [
            particles[ index( u, v ) ],
            particles[ index( u + 1, v ) ],
            restDistance
          ] );
        }
      }
    }

    // structural springs
    for (v=0; v<h; v++) {
      for (u=0; u<w; u++) {

        if(u!=0){
          constrains.push( [
            particles[ index( u, v ) ],
            particles[ index( u, v+1 ) ],
            restDistance
          ] );
        }

        if(v!=0){
          constrains.push( [
            particles[ index( u, v ) ],
            particles[ index( u+1, v ) ],
            restDistance
          ] );
        }

      }
    }

    this.particles = particles;
    this.constrains = constrains;

    function index( u, v ) {

      return u + v * ( w + 1 );

    }

    this.index = index;
  }

  simulate = ( time ) => {
    let nearestX;
    let nearestY;
    let nearestZ;

    let whereWasI;
    let yDist;
    let lastTime;

    let currentX;
    let currentY;
    let currentZ;
    let whereAmI;
    let pos;
    let xDist;
    let zDist;
    let windStrength, tmpForce, windForce, gravity;
    let structuralSprings = true;
    let shearSprings = false;
    let bendingSprings = true;

    let DAMPING = 0.03;
    let DRAG = 1 - DAMPING;
    let MASS = .1;

    let restDistanceB = 2;
    let restDistanceS = Math.sqrt(2);

    let friction = 0.9; // similar to coefficient of friction. 0 = frictionless, 1 = cloth sticks in place

    let xSegs = 30; // how many particles wide is the cloth
    let ySegs = 30; // how many particles tall is the cloth

    let fabricLength = 600; // sets the size of the cloth
    let restDistance; // = fabricLength/xSegs;

//let newCollisionDetection = true;

    let wind = true;
    //let windStrength;
    //let windForce = new THREE.Vector3( 0, 0, 0 );
    let avoidClothSelfIntersection = false;

    let sphere;
    let table;
    let boundingBox;

    if ( ! lastTime ) {
      lastTime = time;
      return;

    }

    var i, il, particles, particle, pt, constrains, constrain;

    this.windStrength = Math.cos( time / 7000 ) * 20 + 40;
    this.windForce.set(
      Math.sin( time / 2000 ),
      Math.cos( time / 3000 ),
      Math.sin( time / 1000 )
    ).normalize().multiplyScalar( windStrength);

    // apply the wind force to the cloth particles
    let face;
    let faces = this.clothGeometry.faces
    let normal;
    this.particles = this.cloth.particles;

    for ( let i = 0, il = faces.length; i < il; i ++ ) {
      face = faces[ i ];
      normal = face.normal;
      this.tmpForce.copy( normal ).normalize().multiplyScalar( normal.dot( this.windForce ) );
      this.particles[ face.a ].addForce( tmpForce );
      this.particles[ face.b ].addForce( tmpForce );
      this.particles[ face.c ].addForce( tmpForce );
    }

    for ( let particles = this.cloth.particles, i = 0, il = particles.length ; i < il; i ++ )
    {
      particle = particles[ i ];
      particle.addForce( this.gravity );
      particle.integrate( TIMESTEP_SQ ); // performs verlet integration
    }

    if(avoidClothSelfIntersection){
      for ( let i = 0; i < particles.length; i ++ ){
        let p_i = particles[i];
        for ( let j = 0; j < particles.length; j ++ ){
          let p_j = particles[j];
          Cloth.repelParticles(p_i,p_j,restDistance);
        }
      }
    }

    // // Floor Constains
    for ( let particles = this.cloth.particles, i = 0, il = particles.length; i < il; i ++ )
    {
      particle = particles[ i ];
      pos = particle.position;
      if ( pos.y < - 249 ) {pos.y = - 249;}
    }

    // Pin Constrains
    // console.log('particles', particles);
    for (let u=0;u<=xSegs;u++)
    {
      this.particles[this.cloth.index(0,u)].lockToOriginal();
      this.particles[this.cloth.index(xSegs,u)].lockToOriginal();
    }
    console.log('testing');
  }


  renderScene = () => {
    const {clothGeometry, camera, renderer, cloth, scene} = this;
    var timer = Date.now() * 0.0002;


    // update position of the cloth
    // i.e. copy positions from the particles (i.e. result of physics simulation)
    // to the cloth geometry

    var p = cloth.particles;
    for ( var i = 0, il = p.length; i < il; i ++ ) {
      clothGeometry.vertices[ i ].copy( p[ i ].position );
    }
    console.log(clothGeometry);

    // var cameraRadius = Math.sqrt(camera.position.x*camera.position.x + camera.position.z*camera.position.z);
    // camera.position.x = Math.cos( timer ) * cameraRadius;
    // camera.position.z = Math.sin( timer ) * cameraRadius;

    // recalculate cloth normals
    clothGeometry.computeFaceNormals();
    clothGeometry.computeVertexNormals();

    clothGeometry.normalsNeedUpdate = true;
    clothGeometry.verticesNeedUpdate = true;

    // update sphere position from ball position
    // sphere.position.copy( ballPosition );

    // // option to auto-rotate camera
    // if ( rotate ) {
    //   var cameraRadius = Math.sqrt(camera.position.x*camera.position.x + camera.position.z*camera.position.z);
    //   camera.position.x = Math.cos( timer ) * cameraRadius;
    //   camera.position.z = Math.sin( timer ) * cameraRadius;
    // }

    camera.lookAt( scene.position );
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
