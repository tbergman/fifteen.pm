import * as THREE from "three";
import { ballPosition, ballSize, sphere } from "./Sphere";
import { service } from "./service";
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
var MASS = 0.5;
var restDistance = 30;

var xSegs = 50;
var ySegs = 10;
var fabricLength = 800; // sets the size of the cloth

var clothInitialPosition = plane( restDistance * xSegs, ySegs );

function plane( width, height ) {

  return function( u, v ) {

    var x = ( u - 0.5 ) * width;
    var y = ( v + 0.5 ) * height;
    var z = 0;

    return new THREE.Vector3( x, y, z );

  };

}

var cloth = new Cloth( xSegs, ySegs, fabricLength );

var GRAVITY = 981 * 1.4;
var gravity = new THREE.Vector3( 0, -GRAVITY, 0 ).multiplyScalar( MASS );

// HOW TO HAVE THINGS FLOAT UP
// var gravity = new THREE.Vector3( 0, GRAVITY, 0 ).multiplyScalar( MASS );


var TIMESTEP = 18 / 1000;
var TIMESTEP_SQ = TIMESTEP * TIMESTEP;

var windStrength = 2;
var windForce = new THREE.Vector3( 0, 0, 0 );

var tmpForce = new THREE.Vector3();

var lastTime;


function clothFunction( width, height, target ) {

  var x = 1 * width - width/2;
  var y = height/2; //height/2;
  var z = 1 * height - height/2;

  target.set( x, y, z );
}

function Particle( x, y, z, mass ) {

  this.position = clothInitialPosition( x, y ); // position
  this.previous = clothInitialPosition( x, y ); // previous
  this.original = clothInitialPosition( x, y );
  this.a = new THREE.Vector3( 0, 0, 0 ); // acceleration
  this.mass = mass;
  this.invMass = 1 / mass;
  this.tmp = new THREE.Vector3();
  this.tmp2 = new THREE.Vector3();

}

// Force -> Acceleration

Particle.prototype.addForce = function( force ) {

  this.a.add(
    this.tmp2.copy( force ).multiplyScalar( this.invMass )
  );

};


// Performs Verlet integration

Particle.prototype.integrate = function( timesq ) {

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

  // //
  // // While many systems use shear and bend springs,
  // // the relaxed constraints model seems to be just fine
  // // using structural springs.
  // // Shear
  // var diagonalDist = Math.sqrt(restDistance * restDistance * 2);
  //
  //
  // for (v=0;v<h;v++) {
  // 	for (u=0;u<w;u++) {
  //
  // 		constraints.push([
  // 			particles[index(u, v)],
  // 			particles[index(u+1, v+1)],
  // 			diagonalDist
  // 		]);
  //
  // 		constraints.push([
  // 			particles[index(u+1, v)],
  // 			particles[index(u, v+1)],
  // 			diagonalDist
  // 		]);
  //
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

  if ( service.wind ) {

    var face, faces = clothGeometry.faces, normal;

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
  // Ball Constraints
  // ballPosition.z = Math.sin( Date.now() / 600 ) * 1000; //+ 40;
  // ballPosition.y = Math.cos( Date.now() / 600 ) * 600 - 200;
  // ballPosition.x = Math.sin( Date.now() / 500 ) * 1000;
  // Ball Constraints
  ballPosition.z = - Math.sin( Date.now() / 600 ) * 90 + 0 ; //+ 40;
  ballPosition.x = Math.cos( Date.now() / 400 ) * 400;

  if ( sphere.visible ) {
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

  /*
    This determines how for down the cloth should drop
   */

  for ( particles = cloth.particles, i = 0, il = particles.length; i < il; i ++ ) {

    particle = particles[ i ];
    pos = particle.position;
    if ( pos.y < - 260 ) {
      pos.y = - 260;
    }
  }

  // Pin Constraints

  for ( i = 0, il = service.pins.length; i < il; i ++ ) {

    var xy = service.pins[ i ];
    var p = particles[ xy ];
    p.position.copy( p.original );
    p.previous.copy( p.original );

  }


}

let clothGeometry = new THREE.ParametricGeometry( clothFunction, cloth.w, cloth.h );

// cloth material

// let loader = new THREE.TextureLoader();
// var clothTexture = loader.load( 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/patterns/circuit_pattern.png' );
// clothTexture.anisotropy = 16;

let clothMaterial = new THREE.MeshPhongMaterial( {
  color: 0xaa2929,
  specular: 0x030303,
  wireframeLinewidth: 2,
  //map: clothTexture,
  side: THREE.DoubleSide,
  alphaTest: 0.5,
  transparent: true,
  wireframe: true,
} );

// cloth geometry

clothGeometry = new THREE.ParametricGeometry( clothFunction, cloth.w, cloth.h );

// cloth mesh

let clothMesh = new THREE.Mesh( clothGeometry, clothMaterial );
clothMesh.position.set( 0, 110, 0 );
clothMesh.castShadow = true;
clothMesh.customDepthMaterial = new THREE.MeshDepthMaterial( {

  depthPacking: THREE.RGBADepthPacking,
  // map: clothTexture,
  alphaTest: 0.5

} );

export { ballSize, cloth, clothFunction, clothGeometry, clothMesh, simulate, windForce };
