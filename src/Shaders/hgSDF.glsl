precision mediump float;

varying vec2 vUv;

// camera information
uniform vec3 uCamPos;
uniform float uCamFov;
uniform vec3 uLookatPos;

// lighting information
uniform int uNumLights;
uniform sampler2D sLightPos;
uniform sampler2D sLightCol;
uniform sampler2D sLightFall;

uniform vec3 uBgColor;
uniform float uTime;
uniform float uDisplacementOffset;

// spheres
uniform vec3 uSp1;
uniform vec3 uSp2;
uniform float uRadius;

// TODO -- threejs version doesn't allow using a uniform  to set a for loop limit
const int MAX_LIGHT_ITERATIONS = 5; // this should be uNumLights

// ADDING SIMPLEX NOISE VIA: https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
//	Simplex 4D Noise 
//	by Ian McEwan, Ashima Arts
//

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
float permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}

vec4 grad4(float j, vec4 ip){
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p,s;

  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; 

  return p;
}

float simplexNoise4D(vec4 v){
  const vec2  C = vec2( 0.138196601125010504,  // (5 - sqrt(5))/20  G4
                        0.309016994374947451); // (sqrt(5) - 1)/4   F4
  // First corner
  vec4 i  = floor(v + dot(v, C.yyyy) );
  vec4 x0 = v -   i + dot(i, C.xxxx);

  // Other corners

  // Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
  vec4 i0;

  vec3 isX = step( x0.yzw, x0.xxx );
  vec3 isYZ = step( x0.zww, x0.yyz );
  //  i0.x = dot( isX, vec3( 1.0 ) );
  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;

  //  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;

  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  // i0 now contains the unique values 0,1,2,3 in each channel
  vec4 i3 = clamp( i0, 0.0, 1.0 );
  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

  //  x0 = x0 - 0.0 + 0.0 * C 
  vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
  vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
  vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
  vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;

  // Permutations
  i = mod(i, 289.0); 
  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));
  // Gradients
  // ( 7*7*6 points uniformly over a cube, mapped onto a 4-octahedron.)
  // 7*7*6 = 294, which is close to the ring size 17*17 = 289.
  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

  // Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));

  // Mix contributions from the five corners
  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;
}

////////////////////////////////////////////////////////////////
//
//                           HG_SDF
//
//     GLSL LIBRARY FOR BUILDING SIGNED DISTANCE BOUNDS
//
//     version 2016-01-10
//
//     Check http://mercury.sexy/hg_sdf for updates
//     and usage examples. Send feedback to spheretracing@mercury.sexy.
//
//     Brought to you by MERCURY http://mercury.sexy
//
//
//
// Released as Creative Commons Attribution-NonCommercial (CC BY-NC)
//
////////////////////////////////////////////////////////////////
//
// How to use this:
//
// 1. Build some system to #include glsl files in each other.
//   Include this one at the very start. Or just paste everywhere.
// 2. Build a sphere tracer. See those papers:
//   * "Sphere Tracing" http://graphics.cs.illinois.edu/sites/default/files/zeno.pdf
//   * "Enhanced Sphere Tracing" http://lgdv.cs.fau.de/get/2234
//   The Raymnarching Toolbox Thread on pouet can be helpful as well
//   http://www.pouet.net/topic.php?which=7931&page=1
//   and contains links to many more resources.
// 3. Use the tools in this library to build your distance bound f().
// 4. ???
// 5. Win a compo.
// 
// (6. Buy us a beer or a good vodka or something, if you like.)
//
////////////////////////////////////////////////////////////////
//
// Table of Contents:
//
// * Helper functions and macros
// * Collection of some primitive objects
// * Domain Manipulation operators
// * Object combination operators
//
////////////////////////////////////////////////////////////////
//
// Why use this?
//
// The point of this lib is that everything is structured according
// to patterns that we ended up using when building geometry.
// It makes it more easy to write code that is reusable and that somebody
// else can actually understand. Especially code on Shadertoy (which seems
// to be what everybody else is looking at for "inspiration") tends to be
// really ugly. So we were forced to do something about the situation and
// release this lib ;)
//
// Everything in here can probably be done in some better way.
// Please experiment. We'd love some feedback, especially if you
// use it in a scene production.
//
// The main patterns for building geometry this way are:
// * Stay Lipschitz continuous. That means: don't have any distance
//   gradient larger than 1. Try to be as close to 1 as possible -
//   Distances are euclidean distances, don't fudge around.
//   Underestimating distances will happen. That's why calling
//   it a "distance bound" is more correct. Don't ever multiply
//   distances by some value to "fix" a Lipschitz continuity
//   violation. The invariant is: each fSomething() function returns
//   a correct distance bound.
// * Use very few primitives and combine them as building blocks
//   using combine opertors that preserve the invariant.
// * Multiply objects by repeating the domain (space).
//   If you are using a loop inside your distance function, you are
//   probably doing it wrong (or you are building boring fractals).
// * At right-angle intersections between objects, build a new local
//   coordinate system from the two distances to combine them in
//   interesting ways.
// * As usual, there are always times when it is best to not follow
//   specific patterns.
//
////////////////////////////////////////////////////////////////
//
// FAQ
//
// Q: Why is there no sphere tracing code in this lib?
// A: Because our system is way too complex and always changing.
//    This is the constant part. Also we'd like everyone to
//    explore for themselves.
//
// Q: This does not work when I paste it into Shadertoy!!!!
// A: Yes. It is GLSL, not GLSL ES. We like real OpenGL
//    because it has way more features and is more likely
//    to work compared to browser-based WebGL. We recommend
//    you consider using OpenGL for your productions. Most
//    of this can be ported easily though.
//
// Q: How do I material?
// A: We recommend something like this:
//    Write a material ID, the distance and the local coordinate
//    p into some global variables whenever an object's distance is
//    smaller than the stored distance. Then, at the end, evaluate
//    the material to get color, roughness, etc., and do the shading.
//
// Q: I found an error. Or I made some function that would fit in
//    in this lib. Or I have some suggestion.
// A: Awesome! Drop us a mail at spheretracing@mercury.sexy.
//
// Q: Why is this not on github?
// A: Because we were too lazy. If we get bugged about it enough,
//    we'll do it.
//
// Q: Your license sucks for me.
// A: Oh. What should we change it to?
//
// Q: I have trouble understanding what is going on with my distances.
// A: Some visualization of the distance field helps. Try drawing a
//    plane that you can sweep through your scene with some color
//    representation of the distance field at each point and/or iso
//    lines at regular intervals. Visualizing the length of the
//    gradient (or better: how much it deviates from being equal to 1)
//    is immensely helpful for understanding which parts of the
//    distance field are broken.
//
////////////////////////////////////////////////////////////////






////////////////////////////////////////////////////////////////
//
//             HELPER FUNCTIONS/MACROS
//
////////////////////////////////////////////////////////////////

#define PI 3.14159265
#define TAU (2.*PI)
#define PHI (sqrt(5.)*0.5 + 0.5)

// Clamp to [0,1] - this operation is free under certain circumstances.
// For further information see
// http://www.humus.name/Articles/Persson_LowLevelThinking.pdf and
// http://www.humus.name/Articles/Persson_LowlevelShaderOptimization.pdf
// #define saturate(x) clamp(x, 0, 1)

// Sign function that doesn't return 0
float sgn(float x) {
	return (x<0.)?-1.:1.;
}

vec2 sgn(vec2 v) {
	return vec2((v.x<0.)?-1.:1., (v.y<0.)?-1.:1.);
}

float square (float x) {
	return x*x;
}

vec2 square (vec2 x) {
	return x*x;
}

vec3 square (vec3 x) {
	return x*x;
}

float lengthSqr(vec3 x) {
	return dot(x, x);
}


// Maximum/minumum elements of a vector
float vmax(vec2 v) {
	return max(v.x, v.y);
}

float vmax(vec3 v) {
	return max(max(v.x, v.y), v.z);
}

float vmax(vec4 v) {
	return max(max(v.x, v.y), max(v.z, v.w));
}

float vmin(vec2 v) {
	return min(v.x, v.y);
}

float vmin(vec3 v) {
	return min(min(v.x, v.y), v.z);
}

float vmin(vec4 v) {
	return min(min(v.x, v.y), min(v.z, v.w));
}




////////////////////////////////////////////////////////////////
//
//             PRIMITIVE DISTANCE FUNCTIONS
//
////////////////////////////////////////////////////////////////
//
// Conventions:
//
// Everything that is a distance function is called fSomething.
// The first argument is always a point in 2 or 3-space called <p>.
// Unless otherwise noted, (if the object has an intrinsic "up"
// side or direction) the y axis is "up" and the object is
// centered at the origin.
//
////////////////////////////////////////////////////////////////

float fSphere(vec3 p, float r) {
	return length(p) - r;
}

// Plane with normal n (n is normalized) at some distance from the origin
float fPlane(vec3 p, vec3 n, float distanceFromOrigin) {
	return dot(p, n) + distanceFromOrigin;
}

// Cheap Box: distance to corners is overestimated
float fBoxCheap(vec3 p, vec3 b) { //cheap box
	return vmax(abs(p) - b);
}

// Box: correct distance to corners
float fBox(vec3 p, vec3 b) {
	vec3 d = abs(p) - b;
	return length(max(d, vec3(0))) + vmax(min(d, vec3(0)));
}

// Same as above, but in two dimensions (an endless box)
float fBox2Cheap(vec2 p, vec2 b) {
	return vmax(abs(p)-b);
}

float fBox2(vec2 p, vec2 b) {
	vec2 d = abs(p) - b;
	return length(max(d, vec2(0))) + vmax(min(d, vec2(0)));
}


// Endless "corner"
float fCorner (vec2 p) {
	return length(max(p, vec2(0))) + vmax(min(p, vec2(0)));
}

// Blobby ball object. You've probably seen it somewhere. This is not a correct distance bound, beware.
float fBlob(vec3 p) {
	p = abs(p);
	if (p.x < max(p.y, p.z)) p = p.yzx;
	if (p.x < max(p.y, p.z)) p = p.yzx;
	float b = max(max(max(
		dot(p, normalize(vec3(1., 1., 1.))),
		dot(p.xz, normalize(vec2(PHI+1., 1.)))),
		dot(p.yx, normalize(vec2(1., PHI)))),
		dot(p.xz, normalize(vec2(1., PHI))));
	float l = length(p);
	return l - 1.5 - 0.2 * (1.5 / 2.)* cos(min(sqrt(1.01 - b / l)*(PI / 0.25), PI));
}

// Cylinder standing upright on the xz plane
float fCylinder(vec3 p, float r, float height) {
	float d = length(p.xz) - r;
	d = max(d, abs(p.y) - height);
	return d;
}

// Capsule: A Cylinder with round caps on both sides
float fCapsule(vec3 p, float r, float c) {
	return mix(length(p.xz) - r, length(vec3(p.x, abs(p.y) - c, p.z)) - r, step(c, abs(p.y)));
}

// Distance to line segment between <a> and <b>, used for fCapsule() version 2below
float fLineSegment(vec3 p, vec3 a, vec3 b) {
	vec3 ab = b - a;
	float t = saturate(dot(p - a, ab) / dot(ab, ab));
	return length((ab*t + a) - p);
}

// Capsule version 2: between two end points <a> and <b> with radius r 
float fCapsule(vec3 p, vec3 a, vec3 b, float r) {
	return fLineSegment(p, a, b) - r;
}

// Torus in the XZ-plane
float fTorus(vec3 p, float smallRadius, float largeRadius) {
	return length(vec2(length(p.xz) - largeRadius, p.y)) - smallRadius;
}

// A circle line. Can also be used to make a torus by subtracting the smaller radius of the torus.
float fCircle(vec3 p, float r) {
	float l = length(p.xz) - r;
	return length(vec2(p.y, l));
}

// A circular disc with no thickness (i.e. a cylinder with no height).
// Subtract some value to make a flat disc with rounded edge.
float fDisc(vec3 p, float r) {
	float l = length(p.xz) - r;
	return l < 0. ? abs(p.y) : length(vec2(p.y, l));
}

// Hexagonal prism, circumcircle variant
float fHexagonCircumcircle(vec3 p, vec2 h) {
	vec3 q = abs(p);
	return max(q.y - h.y, max(q.x*sqrt(3.)*0.5 + q.z*0.5, q.z) - h.x);
	//this is mathematically equivalent to this line, but less efficient:
	//return max(q.y - h.y, max(dot(vec2(cos(PI/3), sin(PI/3)), q.zx), q.z) - h.x);
}

// Hexagonal prism, incircle variant
float fHexagonIncircle(vec3 p, vec2 h) {
	return fHexagonCircumcircle(p, vec2(h.x*sqrt(3.)*0.5, h.y));
}

// Cone with correct distances to tip and base circle. Y is up, 0 is in the middle of the base.
float fCone(vec3 p, float radius, float height) {
	vec2 q = vec2(length(p.xz), p.y);
	vec2 tip = q - vec2(0, height);
	vec2 mantleDir = normalize(vec2(height, radius));
	float mantle = dot(tip, mantleDir);
	float d = max(mantle, -q.y);
	float projected = dot(tip, vec2(mantleDir.y, -mantleDir.x));
	
	// distance to tip
	if ((q.y > height) && (projected < 0.)) {
		d = max(d, length(tip));
	}
	
	// distance to base ring
	if ((q.x > radius) && (projected > length(vec2(height, radius)))) {
		d = max(d, length(q - vec2(radius, 0.)));
	}
	return d;
}

// TODO: This section doesn't work with current version of GLSL run by Three.js (pre 3.0)
// "Generalized Distance Functions" by Akleman and Chen.
// see the Paper at https://www.viz.tamu.edu/faculty/ergun/research/implicitmodeling/papers/sm99.pdf
//
// This set of constants is used to construct a large variety of geometric primitives.
// Indices are shifted by 1 compared to the paper because we start counting at Zero.
// Some of those are slow whenever a driver decides to not unroll the loop,
// which seems to happen for fIcosahedron und fTruncatedIcosahedron on nvidia 350.12 at least.
// Specialized implementations can well be faster in all cases.
//

// const vec3 GDFVectors[19] = vec3[](
// 	normalize(vec3(1, 0, 0)),
// 	normalize(vec3(0, 1, 0)),
// 	normalize(vec3(0, 0, 1)),

// 	normalize(vec3(1, 1, 1 )),
// 	normalize(vec3(-1, 1, 1)),
// 	normalize(vec3(1, -1, 1)),
// 	normalize(vec3(1, 1, -1)),

// 	normalize(vec3(0, 1, PHI+1)),
// 	normalize(vec3(0, -1, PHI+1)),
// 	normalize(vec3(PHI+1, 0, 1)),
// 	normalize(vec3(-PHI-1, 0, 1)),
// 	normalize(vec3(1, PHI+1, 0)),
// 	normalize(vec3(-1, PHI+1, 0)),

// 	normalize(vec3(0, PHI, 1)),
// 	normalize(vec3(0, -PHI, 1)),
// 	normalize(vec3(1, 0, PHI)),
// 	normalize(vec3(-1, 0, PHI)),
// 	normalize(vec3(PHI, 1, 0)),
// 	normalize(vec3(-PHI, 1, 0))
// );

// Version with variable exponent.
// This is slow and does not produce correct distances, but allows for bulging of objects.
// float fGDF(vec3 p, float r, float e, int begin, int end) {
// 	float d = 0;
// 	for (int i = begin; i <= end; ++i)
// 		d += pow(abs(dot(p, GDFVectors[i])), e);
// 	return pow(d, 1/e) - r;
// }

// // Version with without exponent, creates objects with sharp edges and flat faces
// float fGDF(vec3 p, float r, int begin, int end) {
// 	float d = 0;
// 	for (int i = begin; i <= end; ++i)
// 		d = max(d, abs(dot(p, GDFVectors[i])));
// 	return d - r;
// }

// Primitives follow:

// float fOctahedron(vec3 p, float r, float e) {
// 	return fGDF(p, r, e, 3, 6);
// }

// float fDodecahedron(vec3 p, float r, float e) {
// 	return fGDF(p, r, e, 13, 18);
// }

// float fIcosahedron(vec3 p, float r, float e) {
// 	return fGDF(p, r, e, 3, 12);
// }

// float fTruncatedOctahedron(vec3 p, float r, float e) {
// 	return fGDF(p, r, e, 0, 6);
// }

// float fTruncatedIcosahedron(vec3 p, float r, float e) {
// 	return fGDF(p, r, e, 3, 18);
// }

// float fOctahedron(vec3 p, float r) {
// 	return fGDF(p, r, 3, 6);
// }

// float fDodecahedron(vec3 p, float r) {
// 	return fGDF(p, r, 13, 18);
// }

// float fIcosahedron(vec3 p, float r) {
// 	return fGDF(p, r, 3, 12);
// }

// float fTruncatedOctahedron(vec3 p, float r) {
// 	return fGDF(p, r, 0, 6);
// }

// float fTruncatedIcosahedron(vec3 p, float r) {
// 	return fGDF(p, r, 3, 18);
// }


////////////////////////////////////////////////////////////////
//
//                DOMAIN MANIPULATION OPERATORS
//
////////////////////////////////////////////////////////////////
//
// Conventions:
//
// Everything that modifies the domain is named pSomething.
//
// Many operate only on a subset of the three dimensions. For those,
// you must choose the dimensions that you want manipulated
// by supplying e.g. <p.x> or <p.zx>
//
// <inout p> is always the first argument and modified in place.
//
// Many of the operators partition space into cells. An identifier
// or cell index is returned, if possible. This return value is
// intended to be optionally used e.g. as a random seed to change
// parameters of the distance functions inside the cells.
//
// Unless stated otherwise, for cell index 0, <p> is unchanged and cells
// are centered on the origin so objects don't have to be moved to fit.
//
//
////////////////////////////////////////////////////////////////



// Rotate around a coordinate axis (i.e. in a plane perpendicular to that axis) by angle <a>.
// Read like this: R(p.xz, a) rotates "x towards z".
// This is fast if <a> is a compile-time constant and slower (but still practical) if not.
void pR(inout vec2 p, float a) {
	p = cos(a)*p + sin(a)*vec2(p.y, -p.x);
}

// Shortcut for 45-degrees rotation
void pR45(inout vec2 p) {
	p = (p + vec2(p.y, -p.x))*sqrt(0.5);
}

// Repeat space along one axis. Use like this to repeat along the x axis:
// <float cell = pMod1(p.x,5);> - using the return value is optional.
float pMod1(inout float p, float size) {
	float halfsize = size*0.5;
	float c = floor((p + halfsize)/size);
	p = mod(p + halfsize, size) - halfsize;
	return c;
}

// Same, but mirror every second cell so they match at the boundaries
float pModMirror1(inout float p, float size) {
	float halfsize = size*0.5;
	float c = floor((p + halfsize)/size);
	p = mod(p + halfsize,size) - halfsize;
	p *= mod(c, 2.0)*2. - 1.;
	return c;
}

// Repeat the domain only in positive direction. Everything in the negative half-space is unchanged.
float pModSingle1(inout float p, float size) {
	float halfsize = size*0.5;
	float c = floor((p + halfsize)/size);
	if (p >= 0.)
		p = mod(p + halfsize, size) - halfsize;
	return c;
}

// Repeat only a few times: from indices <start> to <stop> (similar to above, but more flexible)
float pModInterval1(inout float p, float size, float start, float stop) {
	float halfsize = size*0.5;
	float c = floor((p + halfsize)/size);
	p = mod(p+halfsize, size) - halfsize;
	if (c > stop) { //yes, this might not be the best thing numerically.
		p += size*(c - stop);
		c = stop;
	}
	if (c <start) {
		p += size*(c - start);
		c = start;
	}
	return c;
}


// Repeat around the origin by a fixed angle.
// For easier use, num of repetitions is use to specify the angle.
float pModPolar(inout vec2 p, float repetitions) {
	float angle = 2.*PI/repetitions;
	float a = atan(p.y, p.x) + angle/2.;
	float r = length(p);
	float c = floor(a/angle);
	a = mod(a,angle) - angle/2.;
	p = vec2(cos(a), sin(a))*r;
	// For an odd number of repetitions, fix cell index of the cell in -x direction
	// (cell index would be e.g. -5 and 5 in the two halves of the cell):
	if (abs(c) >= (repetitions/2.)) c = abs(c);
	return c;
}

// Repeat in two dimensions
vec2 pMod2(inout vec2 p, vec2 size) {
	vec2 c = floor((p + size*0.5)/size);
	p = mod(p + size*0.5,size) - size*0.5;
	return c;
}

// Same, but mirror every second cell so all boundaries match
vec2 pModMirror2(inout vec2 p, vec2 size) {
	vec2 halfsize = size*0.5;
	vec2 c = floor((p + halfsize)/size);
	p = mod(p + halfsize, size) - halfsize;
	p *= mod(c,vec2(2.))*2. - vec2(1.);
	return c;
}

// Same, but mirror every second cell at the diagonal as well
vec2 pModGrid2(inout vec2 p, vec2 size) {
	vec2 c = floor((p + size*0.5)/size);
	p = mod(p + size*0.5, size) - size*0.5;
	p *= mod(c,vec2(2))*2. - vec2(1);
	p -= size/2.;
	if (p.x > p.y) p.xy = p.yx;
	return floor(c/2.);
}

// Repeat in three dimensions
vec3 pMod3(inout vec3 p, vec3 size) {
	vec3 c = floor((p + size*0.5)/size);
	p = mod(p + size*0.5, size) - size*0.5;
	return c;
}

// Mirror at an axis-aligned plane which is at a specified distance <dist> from the origin.
float pMirror (inout float p, float dist) {
	float s = sgn(p);
	p = abs(p)-dist;
	return s;
}

// Mirror in both dimensions and at the diagonal, yielding one eighth of the space.
// translate by dist before mirroring.
vec2 pMirrorOctant (inout vec2 p, vec2 dist) {
	vec2 s = sgn(p);
	pMirror(p.x, dist.x);
	pMirror(p.y, dist.y);
	if (p.y > p.x)
		p.xy = p.yx;
	return s;
}

// Reflect space at a plane
float pReflect(inout vec3 p, vec3 planeNormal, float offset) {
	float t = dot(p, planeNormal)+offset;
	if (t < 0.) {
		p = p - (2.*t)*planeNormal;
	}
	return sgn(t);
}


////////////////////////////////////////////////////////////////
//
//             OBJECT COMBINATION OPERATORS
//
////////////////////////////////////////////////////////////////
//
// We usually need the following boolean operators to combine two objects:
// Union: OR(a,b)
// Intersection: AND(a,b)
// Difference: AND(a,!b)
// (a and b being the distances to the objects).
//
// The trivial implementations are min(a,b) for union, max(a,b) for intersection
// and max(a,-b) for difference. To combine objects in more interesting ways to
// produce rounded edges, chamfers, stairs, etc. instead of plain sharp edges we
// can use combination operators. It is common to use some kind of "smooth minimum"
// instead of min(), but we don't like that because it does not preserve Lipschitz
// continuity in many cases.
//
// Naming convention: since they return a distance, they are called fOpSomething.
// The different flavours usually implement all the boolean operators above
// and are called fOpUnionRound, fOpIntersectionRound, etc.
//
// The basic idea: Assume the object surfaces intersect at a right angle. The two
// distances <a> and <b> constitute a new local two-dimensional coordinate system
// with the actual intersection as the origin. In this coordinate system, we can
// evaluate any 2D distance function we want in order to shape the edge.
//
// The operators below are just those that we found useful or interesting and should
// be seen as examples. There are infinitely more possible operators.
//
// They are designed to actually produce correct distances or distance bounds, unlike
// popular "smooth minimum" operators, on the condition that the gradients of the two
// SDFs are at right angles. When they are off by more than 30 degrees or so, the
// Lipschitz condition will no longer hold (i.e. you might get artifacts). The worst
// case is parallel surfaces that are close to each other.
//
// Most have a float argument <r> to specify the radius of the feature they represent.
// This should be much smaller than the object size.
//
// Some of them have checks like "if ((-a < r) && (-b < r))" that restrict
// their influence (and computation cost) to a certain area. You might
// want to lift that restriction or enforce it. We have left it as comments
// in some cases.
//
// usage example:
//
// float fTwoBoxes(vec3 p) {
//   float box0 = fBox(p, vec3(1));
//   float box1 = fBox(p-vec3(1), vec3(1));
//   return fOpUnionChamfer(box0, box1, 0.2);
// }
//
////////////////////////////////////////////////////////////////


// The "Chamfer" flavour makes a 45-degree chamfered edge (the diagonal of a square of size <r>):
float fOpUnionChamfer(float a, float b, float r) {
	return min(min(a, b), (a - r + b)*sqrt(0.5));
}

// Intersection has to deal with what is normally the inside of the resulting object
// when using union, which we normally don't care about too much. Thus, intersection
// implementations sometimes differ from union implementations.
float fOpIntersectionChamfer(float a, float b, float r) {
	return max(max(a, b), (a + r + b)*sqrt(0.5));
}

// Difference can be built from Intersection or Union:
float fOpDifferenceChamfer (float a, float b, float r) {
	return fOpIntersectionChamfer(a, -b, r);
}

// // The "Round" variant uses a quarter-circle to join the two objects smoothly:
float fOpUnionRound(float a, float b, float r) {
	vec2 u = max(vec2(r - a,r - b), vec2(0.));
	return max(r, min (a, b)) - length(u);
}

float fOpIntersectionRound(float a, float b, float r) {
	vec2 u = max(vec2(r + a,r + b), vec2(0.));
	return min(-r, max (a, b)) + length(u);
}

float fOpDifferenceRound (float a, float b, float r) {
	return fOpIntersectionRound(a, -b, r);
}


// The "Columns" flavour makes n-1 circular columns at a 45 degree angle:
float fOpUnionColumns(float a, float b, float r, float n) {
	if ((a < r) && (b < r)) {
		vec2 p = vec2(a, b);
		float columnradius = r*sqrt(2.)/((n-1.)*2.+sqrt(2.));
		pR45(p);
		p.x -= sqrt(2.)/2.*r;
		p.x += columnradius*sqrt(2.);
		if (mod(n,2.) == 1.) {
			p.y += columnradius;
		}
		// At this point, we have turned 45 degrees and moved at a point on the
		// diagonal that we want to place the columns on.
		// Now, repeat the domain along this direction and place a circle.
		pMod1(p.y, columnradius*2.);
		float result = length(p) - columnradius;
		result = min(result, p.x);
		result = min(result, a);
		return min(result, b);
	} else {
		return min(a, b);
	}
}

float fOpDifferenceColumns(float a, float b, float r, float n) {
	a = -a;
	float m = min(a, b);
	//avoid the expensive computation where not needed (produces discontinuity though)
	if ((a < r) && (b < r)) {
		vec2 p = vec2(a, b);
		float columnradius = r*sqrt(2.)/n/2.0;
		columnradius = r*sqrt(2.)/((n-1.)*2.+sqrt(2.));

		pR45(p);
		p.y += columnradius;
		p.x -= sqrt(2.)/2.*r;
		p.x += -columnradius*sqrt(2.)/2.;

		if (mod(n,2.) == 1.) {
			p.y += columnradius;
		}
		pMod1(p.y,columnradius*2.);

		float result = -length(p) + columnradius;
		result = max(result, p.x);
		result = min(result, a);
		return -min(result, b);
	} else {
		return -m;
	}
}

float fOpIntersectionColumns(float a, float b, float r, float n) {
	return fOpDifferenceColumns(a,-b,r, n);
}

// The "Stairs" flavour produces n-1 steps of a staircase:
// much less stupid version by paniq
float fOpUnionStairs(float a, float b, float r, float n) {
	float s = r/n;
	float u = b-r;
	return min(min(a,b), 0.5 * (u + a + abs ((mod (u - a + s, 2. * s)) - s)));
}

// We can just call Union since stairs are symmetric.
float fOpIntersectionStairs(float a, float b, float r, float n) {
	return -fOpUnionStairs(-a, -b, r, n);
}

float fOpDifferenceStairs(float a, float b, float r, float n) {
	return -fOpUnionStairs(-a, b, r, n);
}


// Similar to fOpUnionRound, but more lipschitz-y at acute angles
// (and less so at 90 degrees). Useful when fudging around too much
// by MediaMolecule, from Alex Evans' siggraph slides
float fOpUnionSoft(float a, float b, float r) {
	float e = max(r - abs(a - b), 0.);
	return min(a, b) - e*e*0.25/r;
}


// produces a cylindical pipe that runs along the intersection.
// No objects remain, only the pipe. This is not a boolean operator.
float fOpPipe(float a, float b, float r) {
	return length(vec2(a, b)) - r;
}

// first object gets a v-shaped engraving where it intersect the second
float fOpEngrave(float a, float b, float r) {
	return max(a, (a + r - abs(b))*sqrt(0.5));
}

// first object gets a capenter-style groove cut out
float fOpGroove(float a, float b, float ra, float rb) {
	return max(a, min(a + ra, rb - abs(b)));
}

// first object gets a capenter-style tongue attached
float fOpTongue(float a, float b, float ra, float rb) {
	return min(a, max(a - ra, abs(b) - rb));
}

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////


// * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - *
// * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - *

// http://www.iquilezles.org/www/articles/smin/smin.htm

// polynomial smooth min (k = 0.1);
float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}


// * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - *
// * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - *


// a way to use a look at to control your camera
// Mike Walczyk
mat3 lookat( in vec3 targetPos, in vec3 cameraPos ){
	vec3 k								= normalize( targetPos - cameraPos );
	vec3 i								= cross(k, vec3(0.0, 1.0, 0.0));
	vec3 j								= cross(i,k);
	return mat3( i, j, k );
}

float distFromSphere( in vec3 point, in vec3 center, in float radius ){
	return length( point - center ) - radius;
}

float distFromSphere1(in vec3 point){
	return distFromSphere( point, uSp1, uRadius );
}

float distFromSphere2(in vec3 point){
	return distFromSphere(point, uSp2, uRadius);
}

float mapTheWorld( in vec3 point ){
	point.x *= .3;
	point.y *= .5;
	float displacement1 				= simplexNoise4D( vec4( point, uTime ) );
	float sphere1						= distFromSphere1( point );
	// float sphere2						= distFromSphere2( point );
	// float sphere 						= smin(sphere1, sphere2, 0.2);
	return sphere1 + ( displacement1 * uDisplacementOffset);
}

vec3 calculateNormal( in vec3 point ){
	const vec3 smallStep  				= vec3( 0.001, 0.0, 0.0 );

	float gradientX						= mapTheWorld( point + smallStep.xyy ) - mapTheWorld( point - smallStep.xyy ) ;
	float gradientY						= mapTheWorld( point + smallStep.yxy ) - mapTheWorld( point - smallStep.yxy ) ;
	float gradientZ 					= mapTheWorld( point + smallStep.yyx ) - mapTheWorld( point - smallStep.yyx ) ;

	vec3 normal 						= vec3( gradientX, gradientY, gradientZ );

	return normalize( normal );
}

// TODO -- find the union above...
// union
// from https://www.shadertoy.com/view/4tSSRh 
vec2 opU( vec2 d1, vec2 d2 )
{
	return d1.x < d2.x ? d1 : d2;
}

// TODO -- duplicative?
// from https://www.shadertoy.com/view/4tSSRh
vec2 map(vec3 p) {
    
    vec2 d = opU(vec2(distFromSphere1(p - vec3(1.5, 0., 0.)), 1.), vec2(p.y + 2., 2.));
    // d =  opU(d, vec2(distFromSphere2(p - vec3(-1.5, 0., 0.)), 1.), 3.));
    
    return d;
}

// TODO -- duplicative?
// from https://www.shadertoy.com/view/4tSSRh
vec3 normal(vec3 pos) {
    vec3 e = vec3(0.001, 0., 0.);
    vec3 nor = normalize( vec3(map(pos+e.xyy).x - map(pos-e.xyy).x,
                               map(pos+e.yxy).x - map(pos-e.yxy).x,
                               map(pos+e.yyx).x - map(pos-e.yyx).x));
    return nor;
}

// TODO --duplicative?
// from https://www.shadertoy.com/view/4tSSRh
float shadow( in vec3 ro, in vec3 rd, in float maxt)
{
	float res = 1.0;
    float dt = 0.04;
    float t = .02;
    for( int i=0; i < 20; i++ )
    {       
        float h = map(ro + rd*t).x;
        if( h<0.001 )
            return 0.0;
        res = min( res, maxt*h/t );
        t += h;
    }
    return res;
}

// TODO - integrate?
// from: https://www.shadertoy.com/view/4tSSRh
vec4 addLighting(vec3 shadedColor, vec3 rayOrigin, vec3 rayDist){
	vec4 color = vec4( shadedColor, 1.0 );
	vec3 lig = vec3(0.9*cos(uTime), 0.9, 0.9*sin(uTime));
	vec3 pos = rayOrigin + shadedColor.x * rayDist; // TODO need time?
	//vec3 pos = ro + t * rd;
	vec3 e = vec3(0.001, 0., 0.);
	vec4 ambient = vec4(0.1, 0.1, 0.2, 1.);
	vec3 nor = normal(pos);
        
	//col = selectColour(h.y, pos, nor);
        
	float lambert = clamp(dot(normalize(nor), normalize(lig)), 0., 1.);
	float phong = pow(lambert,128.);
        
	// lambert shading and ambient colour
	color = clamp(color*lambert + ambient * (1.0 - lambert) + phong, 0., 1.);  
        

	// shadow and ambient colour
	float sh = shadow( pos, lig, 1.0);
	color *= sh  + ambient * (1.0 - sh);
    return color;   
}


vec3 rayMarch( in vec3 rayOrigin, in vec3 rayDist ){
	float totalDistTrav	 				= 0.0;
	const int numSteps	 				= 4;
	const float minHitDist 				= 0.1;
	const float maxTraceDist 			= 25.0;

	for( int i = 0; i < numSteps; i++ ){
		vec3 currentPos 				= rayOrigin + totalDistTrav * rayDist;
		float distToClosest 			= mapTheWorld( currentPos );

		if( distToClosest < minHitDist){
			
			vec3 normal 				= calculateNormal( currentPos );
			vec3 finalColor 			= vec3(0.0);

			for( int light = 0; light < MAX_LIGHT_ITERATIONS; light++ ){

				// parse lighting based on loop index
				vec3 lightPos 			= texture2D(sLightPos, vec2(float(light))).xyz;
				vec3 lightCol 			= texture2D(sLightCol, vec2(float(light))).rgb;
				vec3 lightFall 			= texture2D(sLightFall, vec2(float(light))).xyz;

				// distance between current fragment and light
				float lightDist 		= length(lightPos - distToClosest);

				// diffuse contrabution
				vec3 toLight 			= normalize(lightPos - distToClosest);
				vec3 diffuse 			= max(dot(normal, toLight), 0.0) * lightCol;

				// attenuation
				float attenuation 		= 1.0 / (1.0 +lightFall.y * lightDist + lightFall.z * lightDist *lightDist);
				diffuse 				*= attenuation;

				// TODO hacking...
				vec4 intermediateColor = addLighting(finalColor, rayOrigin, rayDist);
				finalColor += intermediateColor.xyz;

				// accumulate lighting
				finalColor 				+= diffuse;
			}
			return finalColor;
		}
		if( totalDistTrav > maxTraceDist ){
			break;
		}
		totalDistTrav 					+= distToClosest;
	}
	return uBgColor;
}



void main()
{
	vec2 uv 							= vUv.st * 2.0 - 1.0;

	mat3 lookat 						= lookat( uLookatPos, uCamPos );

	vec3 rayOrigin 						= uCamPos;
	vec3 rayDist 						= normalize(lookat * vec3(uv.xy, 1.0 ));

	vec3 shadedColor 					= rayMarch( rayOrigin, rayDist );

    gl_FragColor = vec4(shadedColor, 1.0);
}
