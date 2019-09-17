
varying vec2 vUv;
// varying vec3 vNormal;
// varying vec3 vWorldPosition;

uniform vec3 lightPosition;
uniform vec2 uResolution;
uniform float uTime;
uniform float uBPM;
uniform vec3 uCurCenter;
const int NUM_LINES = 100;

float random(in vec2 _st) {
  return fract(sin(dot(_st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise(in vec2 _st) {
  vec2 i = floor(_st);
  vec2 f = fract(_st);

  // Four corners in 2D of a tile
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 5

float fbm(in vec2 _st) {
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100.0);
  // Rotate to reduce axial bias
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
  for (int i = 0; i < NUM_OCTAVES; ++i) {
    v += a * noise(_st);
    _st = rot * _st * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

float plotX(vec2 st, float pct) {
  return smoothstep(pct - 0.001, pct, st.x) -
         smoothstep(pct, pct + 0.001, st.x);
}

float plotY(vec2 st, float pct) {
  return smoothstep(pct - 0.001, pct, st.y) -
         smoothstep(pct, pct + 0.001, st.y);
}

// TODO maybe can implement a map function ?
// https://gist.github.com/companje/29408948f1e8be54dd5733a74ca49bb9
void main() {
  float bps = uBPM / 60.;
  float wavyLines = sin(vUv.x * uTime / bps * .1);
  vec3 col = vec3(0., 0., wavyLines);

  float numBeats = floor(uTime / 60. / bps);

  for (int i = 0; i < NUM_LINES; i++) {
    float pos = float(i) / float(NUM_LINES);
    // currently just setting a simple line down the middle...
    float lineX = plotX(vUv, pos);
    float lineY = plotY(vUv, pos + .01);

    // creates the motion and gaps
    float streak = sin(vUv.y * uTime * .005);
    // int modulo not supported in all glsl versions
    if (fract(numBeats / 64.) != 0.) {//} && cos(vUv.x) > .5) {//cos(uTime *
    
      col += lineY * streak;
    }
    // if (fract(numBeats / 8.) == 0.){//} && co(vUv.y) > .5) {//sin(uTime *
    // fract(vUv.y)) > .5) {  
    //   col += lineY * streak;
    // }
  }
  gl_FragColor = vec4(col, 1.0);
  // st += st * abs(sin(u_time*0.1)*3.0);
  // vec3 color = vec3(0.0);
  // vec2 st = vUv.xy/uResolution.xy*1.;
  // vec2 q = vec2(0.);
  // q.x = fbm(st + 0.00 * uTime);
  // q.y = fbm(st + vec2(1.0));

  // vec2 r = vec2(0.);
  // r.x = fbm(st + 1.0 * q + vec2(1.7, 9.2) + 0.15 * uTime);
  // r.y = fbm(st + 1.0 * q + vec2(8.3, 2.8) + 0.126 * uTime);

  // float f = fbm(st + r);

  // color =
  //     mix(vec3(0.101961, 0.619608, 0.666667),
  //         vec3(0.666667, 0.666667, 0.498039), clamp((f * f) * 4.0, 0.0, 1.0));

  // color = mix(color, vec3(0, 0, 0.164706), clamp(length(q), 0.0, 1.0));

  // color = mix(color, vec3(0.666667, 1, 1), clamp(length(r.x), 0.0, 1.0));

  // gl_FragColor = vec4((f * f * f + .6 * f * f + .5 * f) * color, 1.);
}

// originally from http://blog.edankwan.com/post/three-js-advanced-tips-shadow
// removed anything but depth-shadow

//   float line2 = plot(vWorldPosition, .50); // currently just setting a simple
//   line down the middle... float line3 = plot(vUv, .75); float line4 =
//   plot(vUv, .85); float line5 = plot(vUv, .95);
// TODO right now there are all just slight variations without much forthought
// about how t make those variations interesting
//   float streak1 = sin(vUv.x - timeVariability - uCurCenter.x) ); // creates
//   the motion and gaps float streak2 = sin(vUv.y - timeVariability -
//   uCurCenter.x) ); // creates the motion and gaps float streak3 = sin(vUv.y -
//   timeVariability - uCurCenter.x) ); // creates the motion and gaps float
//   streak4 = sin(vUv.y - timeVariability - uCurCenter.z) ); // creates the
//   motion and gaps float streak5 = sin(vUv.y - timeVariability - uCurCenter.z)
//   ); // creates the motion and gaps col += line2 * streak2; col += line3 *
//   streak3; col += line4 * streak4; col += line5 * streak5;