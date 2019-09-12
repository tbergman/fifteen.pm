
varying vec2 vUv;
uniform float uTime;
uniform float uBPM;
uniform vec3 uCurCenter;
const int NUM_LINES = 100;

float plotX(vec2 st, float pct) {
  return smoothstep(pct - 0.0001, pct, st.x) -
         smoothstep(pct, pct + 0.0001, st.x);
}

float plotY(vec2 st, float pct) {
  return smoothstep(pct - 0.0001, pct, st.y) -
         smoothstep(pct, pct + 0.0001, st.y);
}

// TODO maybe can implement a map function ?
// https://gist.github.com/companje/29408948f1e8be54dd5733a74ca49bb9
void main() {
  float bps = uBPM / 60.;
  vec3 col = vec3(.1, sin(vUv.x), .3);
  float numBeats = floor(uTime / 60. / bps);

  for (int i = 0; i < NUM_LINES; i++) {
    float pos = float(i) / float(NUM_LINES);
    float lineX = plotX(
        vUv, pos); // currently just setting a simple line down the middle...
    float lineY = plotY(vUv, pos + .01);

    float timeVariability = uTime;
    float streak = sin(vUv.x - timeVariability -
                       uCurCenter.x); // creates the motion and gaps
    // int modulo not supported in all glsl versions
    if (fract(numBeats / 8.) == 0. && cos(uTime * fract(vUv.x)) > .5) {
      col += lineX * streak;
    }
    if (fract(numBeats / 4.) == 0. && sin(uTime * fract(vUv.y)) > .5) {
      col += lineY * streak;
    }
  }
  gl_FragColor = vec4(col, 1.0);
}

//   float line2 = plot(vUv, .50); // currently just setting a simple line down
//   the middle... float line3 = plot(vUv, .75); float line4 = plot(vUv, .85);
//   float line5 = plot(vUv, .95);
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