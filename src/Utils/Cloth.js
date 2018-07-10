/*
 * Cloth Simulation using a relaxed constraints solver
 */

// Suggested Readings

// Advanced Character Physics by Thomas Jakobsen Character
// http://freespace.virgin.net/hugo.elias/models/m_cloth.htm
// http://en.wikipedia.org/wiki/Cloth_modeling
// http://cg.alexandra.dk/tag/spring-mass-system/
// Real-time Cloth Animation http://www.darwin3d.com/gamedev/articles/col0599.pdf

import * as THREE from 'three';

export const DAMPING = 0.03;
export const DRAG = 1 - DAMPING;
export const MASS = 0.1;
export const restDistance = 25;

export const xSegs = 62;
export const ySegs = 14;

export const clothFunction = plane( restDistance * xSegs, restDistance * ySegs );

export const cloth = new Cloth( xSegs, ySegs );
export const clothGeometry = new THREE.ParametricGeometry( clothFunction, cloth.w, cloth.h );

export const GRAVITY = 981 * 1.4;
export const gravity = new THREE.Vector3( 0, - GRAVITY, 0 ).multiplyScalar( MASS );


export const TIMESTEP = 18 / 1000;
export const TIMESTEP_SQ = TIMESTEP * TIMESTEP;

export const pins = [];


export const wind = true;
export const windStrength = 2;
export const windForce = new THREE.Vector3( 0, 0, 0 );

export const ballPosition = new THREE.Vector3( 0, 200, 0 );
export const ballSize = 60; //40

export const tmpForce = new THREE.Vector3();

var lastTime;

var ballGeo = new THREE.SphereBufferGeometry( ballSize, 32, 16 );
var ballMaterial = new THREE.MeshLambertMaterial();

export const sphere = new THREE.Mesh( ballGeo, ballMaterial );

export function plane( width, height ) {

  return function ( u, v, target ) {

    var x = ( u - 0.5 ) * width;
    var y = ( v + 0.5 ) * height;
    var z = 0;

    target.set( x, y, z );

  };

}

export function Particle( x, y, z, mass ) {

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

export function satisfyConstraints( p1, p2, distance ) {

  diff.subVectors( p2.position, p1.position );
  var currentDist = diff.length();
  if ( currentDist === 0 ) return; // prevents division by 0
  var correction = diff.multiplyScalar( 1 - distance / currentDist );
  var correctionHalf = correction.multiplyScalar( 0.5 );
  p1.position.add( correctionHalf );
  p2.position.sub( correctionHalf );

}


export function Cloth( w, h ) {

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
  //  for (u=0;u<w;u++) {

  //    constraints.push([
  //      particles[index(u, v)],
  //      particles[index(u+1, v+1)],
  //      diagonalDist
  //    ]);

  //    constraints.push([
  //      particles[index(u+1, v)],
  //      particles[index(u, v+1)],
  //      diagonalDist
  //    ]);

  //  }
  // }


  this.particles = particles;
  this.constraints = constraints;

  function index( u, v ) {

    return u + v * ( w + 1 );

  }

  this.index = index;

}

export function simulate( time ) {

  if ( ! lastTime ) {

    lastTime = time;
    return;

  }

  var i, il, particles, particle, pt, constraints, constraint;

  // Aerodynamics forces

  if ( wind ) {

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
    satisfyConstraints( constraint[ 1 ], constraint[ 1 ], constraint[ 2 ] );
  }

  // Ball Constraints
  ballPosition.z = Math.sin( Date.now() / 600 ) * 1500; //+ 40;
  ballPosition.y = Math.cos( Date.now() / 600 ) * 600 - 200;
  ballPosition.x = Math.sin( Date.now() / 500 ) * 1000;

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
