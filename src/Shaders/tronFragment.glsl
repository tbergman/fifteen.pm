
varying vec2 vUv;
// varying vec3 vNormal;
// varying vec3 vWorldPosition;

uniform vec3 lightPosition;

uniform float uTime;
uniform float uBPM;
uniform vec3 uCurCenter;
const int NUM_LINES = 100;

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

  // vec3 lightDirection = normalize(lightPosition - vWorldPosition);

  // float c = 0.35 + max(0.0, dot(vNormal, lightDirection)) * 0.4;

  // vec3 col = vec3(c, c, c);

  float bps = uBPM / 60.;
  vec3 col = vec3(0., 0., sin(vUv.x * uTime / bps * .1));
  // vec3 col = vec3(.0, 1., 0);
  float numBeats = floor(uTime / 60. / bps);
  // vec2 vUv = vWorldPosition.xy;

  for (int i = 0; i < NUM_LINES; i++) {
    float pos = float(i) / float(NUM_LINES);
    // currently just setting a simple line down the middle...
    float lineX = plotX(vUv, pos);
    float lineY = plotY(vUv, pos + .01);

    // creates the motion and gaps
    float streak = sin(vUv.y * uTime * .005);
    // int modulo not supported in all glsl versions
    if (fract(numBeats / 64.) != 0.) {//} && cos(vUv.x) > .5) {//cos(uTime * fract(vUv.x)) > .5) {
      col += lineY * streak;
    }
    // if (fract(numBeats / 8.) == 0.){//} && co(vUv.y) > .5) {//sin(uTime * fract(vUv.y)) > .5) {
    //   col += lineY * streak;
    // }
  }
  gl_FragColor = vec4(col, 1.0);
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