import React, {Component} from 'react';
import * as THREE from 'three';
import {OrbitControls} from '../Utils/OrbitControls';

import './Release.css';
import debounce from 'lodash/debounce';
import {Cloth} from "../Utils/Cloth";

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
    this.clothTexture = this.loader.load( 'textures/patterns/circuit_pattern.png' );
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

    console.log(Cloth.ballSize);
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
  }

  componentDidMount() {
    window.addEventListener( 'resize', this.onWindowResize, false );
    /*
 * Cloth Simulation using a relaxed constraints solver
 */

// Suggested Readings

// Advanced Character Physics by Thomas Jakobsen Character
// http://freespace.virgin.net/hugo.elias/models/m_cloth.htm
// http://en.wikipedia.org/wiki/Cloth_modeling
// http://cg.alexandra.dk/tag/spring-mass-system/
// Real-time Cloth Animation http://www.darwin3d.com/gamedev/articles/col0599.pdf

    var DAMPING = 0.03;
    var DRAG = 1 - DAMPING;
    var MASS = 0.1;
    var restDistance = 25;

    var xSegs = 10;
    var ySegs = 10;

    var clothFunction = plane( restDistance * xSegs, restDistance * ySegs );

    var cloth = new Cloth( xSegs, ySegs );

    var GRAVITY = 981 * 1.4;
    var gravity = new THREE.Vector3( 0, - GRAVITY, 0 ).multiplyScalar( MASS );


    var TIMESTEP = 18 / 1000;
    var TIMESTEP_SQ = TIMESTEP * TIMESTEP;

    var pins = [];


    var wind = true;
    var windStrength = 2;
    var windForce = new THREE.Vector3( 0, 0, 0 );

    var ballPosition = new THREE.Vector3( 0, - 45, 0 );
    var ballSize = 60; //40

    var tmpForce = new THREE.Vector3();

    var lastTime;

    var ballGeo = new THREE.SphereBufferGeometry( ballSize, 32, 16 );
    var ballMaterial = new THREE.MeshLambertMaterial();
    var sphere = new THREE.Mesh( ballGeo, ballMaterial );

    this.sphere = new THREE.Mesh( ballGeo, ballMaterial );

    function plane( width, height ) {

      return function ( u, v, target ) {

        var x = ( u - 0.5 ) * width;
        var y = ( v + 0.5 ) * height;
        var z = 0;

        target.set( x, y, z );

      };

    }

    function Particle( x, y, z, mass ) {

      this.position = new THREE.Vector3();
      this.previous = new THREE.Vector3();
      this.original = new THREE.Vector3();
      this.a = new THREE.Vector3( 0, 0, 0 ); // acceleration
      this.mass = mass;
      this.invMass = 1 / mass;
      this.tmp = new THREE.Vector3();
      this.tmp2 = new THREE.Vector3();

      // init

      clothFunction( x, y, this.position ); // position
      clothFunction( x, y, this.previous ); // previous
      clothFunction( x, y, this.original );

    }

// Force -> Acceleration

    Particle.prototype.addForce = function ( force ) {

      this.a.add(
        this.tmp2.copy( force ).multiplyScalar( this.invMass )
      );

    };


// Performs Verlet integration

    Particle.prototype.integrate = function ( timesq ) {

      var newPos = this.tmp.subVectors( this.position, this.previous );
      newPos.multiplyScalar( DRAG ).add( this.position );
      newPos.add( this.a.multiplyScalar( timesq ) );

      this.tmp = this.previous;
      this.previous = this.position;
      this.position = newPos;

      this.a.set( 0, 0, 0 );

    };


    var diff = new THREE.Vector3();

    function satisfyConstraints( p1, p2, distance ) {

      diff.subVectors( p2.position, p1.position );
      var currentDist = diff.length();
      if ( currentDist === 0 ) return; // prevents division by 0
      var correction = diff.multiplyScalar( 1 - distance / currentDist );
      var correctionHalf = correction.multiplyScalar( 0.5 );
      p1.position.add( correctionHalf );
      p2.position.sub( correctionHalf );

    }


    function Cloth( w, h ) {

      w = w || 10;
      h = h || 10;
      this.w = w;
      this.h = h;

      var particles = [];
      var constraints = [];

      var u, v;

      // Create particles
      for ( v = 0; v <= h; v ++ ) {

        for ( u = 0; u <= w; u ++ ) {

          particles.push(
            new Particle( u / w, v / h, 0, MASS )
          );

        }

      }

      // Structural

      for ( v = 0; v < h; v ++ ) {

        for ( u = 0; u < w; u ++ ) {

          constraints.push( [
            particles[ index( u, v ) ],
            particles[ index( u, v + 1 ) ],
            restDistance
          ] );

          constraints.push( [
            particles[ index( u, v ) ],
            particles[ index( u + 1, v ) ],
            restDistance
          ] );

        }

      }

      for ( u = w, v = 0; v < h; v ++ ) {

        constraints.push( [
          particles[ index( u, v ) ],
          particles[ index( u, v + 1 ) ],
          restDistance

        ] );

      }

      for ( v = h, u = 0; u < w; u ++ ) {

        constraints.push( [
          particles[ index( u, v ) ],
          particles[ index( u + 1, v ) ],
          restDistance
        ] );

      }


      // While many systems use shear and bend springs,
      // the relaxed constraints model seems to be just fine
      // using structural springs.
      // Shear
      // var diagonalDist = Math.sqrt(restDistance * restDistance * 2);


      // for (v=0;v<h;v++) {
      // 	for (u=0;u<w;u++) {

      // 		constraints.push([
      // 			particles[index(u, v)],
      // 			particles[index(u+1, v+1)],
      // 			diagonalDist
      // 		]);

      // 		constraints.push([
      // 			particles[index(u+1, v)],
      // 			particles[index(u, v+1)],
      // 			diagonalDist
      // 		]);

      // 	}
      // }


      this.particles = particles;
      this.constraints = constraints;

      function index( u, v ) {

        return u + v * ( w + 1 );

      }

      this.index = index;

    }

    function simulate( time ) {

      if ( ! lastTime ) {

        lastTime = time;
        return;

      }

      var i, il, particles, particle, pt, constraints, constraint;

      // Aerodynamics forces

      if ( wind ) {

        var face, faces = this.clothGeometry.faces, normal;

        particles = cloth.particles;

        for ( i = 0, il = faces.length; i < il; i ++ ) {

          face = faces[ i ];
          normal = face.normal;

          tmpForce.copy( normal ).normalize().multiplyScalar( normal.dot( windForce ) );
          particles[ face.a ].addForce( tmpForce );
          particles[ face.b ].addForce( tmpForce );
          particles[ face.c ].addForce( tmpForce );

        }

      }

      for ( particles = cloth.particles, i = 0, il = particles.length; i < il; i ++ ) {

        particle = particles[ i ];
        particle.addForce( gravity );

        particle.integrate( TIMESTEP_SQ );

      }

      // Start Constraints

      constraints = cloth.constraints;
      il = constraints.length;

      for ( i = 0; i < il; i ++ ) {

        constraint = constraints[ i ];
        satisfyConstraints( constraint[ 0 ], constraint[ 1 ], constraint[ 2 ] );

      }

      // Ball Constraints

      ballPosition.z = - Math.sin( Date.now() / 600 ) * 90; //+ 40;
      ballPosition.x = Math.cos( Date.now() / 400 ) * 70;

      if ( this.sphere.visible ) {

        for ( particles = cloth.particles, i = 0, il = particles.length; i < il; i ++ ) {

          particle = particles[ i ];
          var pos = particle.position;
          diff.subVectors( pos, ballPosition );
          if ( diff.length() < ballSize ) {

            // collided
            diff.normalize().multiplyScalar( ballSize );
            pos.copy( ballPosition ).add( diff );

          }

        }

      }


      // Floor Constraints

      for ( particles = cloth.particles, i = 0, il = particles.length; i < il; i ++ ) {

        particle = particles[ i ];
        pos = particle.position;
        if ( pos.y < - 250 ) {

          pos.y = - 250;

        }

      }

      // Pin Constraints

      for ( i = 0, il = pins.length; i < il; i ++ ) {

        var xy = pins[ i ];
        var p = particles[ xy ];
        p.position.copy( p.original );
        p.previous.copy( p.original );

      }


    }

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

    const {windForce} = this;
    requestAnimationFrame( this.animate );

    var time = Date.now();

    var windStrength = Math.cos( time / 7000 ) * 20 + 40;

    windForce.set( Math.sin( time / 2000 ), Math.cos( time / 3000 ), Math.sin( time / 1000 ) )
    windForce.normalize()
    windForce.multiplyScalar( windStrength );

    Cloth.simulate( time );
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
