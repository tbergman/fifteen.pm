varying vec2 vUv;
uniform float uTime;
uniform vec3 uGlobalOffset;
uniform vec3 uCurCenter;


float plot(vec2 st, float pct) {
  return smoothstep(pct - 0.02, pct, st.y) - smoothstep(pct, pct + 0.02, st.y);
}


// TODO maybe can implement a map function ? https://gist.github.com/companje/29408948f1e8be54dd5733a74ca49bb9
void main() {
  vec3 col = vec3(0.00, 0.05, 0.3);

  float line1 = plot(vUv, .25); // currently just setting a simple line down the middle...
  float line2 = plot(vUv, .50); // currently just setting a simple line down the middle...
  float line3 = plot(vUv, .75);
  float line4 = plot(vUv, .85);
  float line5 = plot(vUv, .95);
  float timeVariability = uTime * cos(uGlobalOffset.z);
  
  // TODO right now there are all just slight variations without much forthought about how t make those variations interesting
  float streak1 = sin(vUv.x + uGlobalOffset.x - timeVariability - uCurCenter.x) + cos(uGlobalOffset.z); // creates the motion and gaps
  float streak2 = sin(vUv.y + uGlobalOffset.x - timeVariability - uCurCenter.x) + cos(uGlobalOffset.z); // creates the motion and gaps
  float streak3 = sin(vUv.y + uGlobalOffset.z - timeVariability - uCurCenter.x) + cos(uGlobalOffset.z); // creates the motion and gaps
  float streak4 = sin(vUv.y + uGlobalOffset.z - timeVariability - uCurCenter.z) + cos(uGlobalOffset.z); // creates the motion and gaps
  float streak5 = sin(vUv.y + uGlobalOffset.z - timeVariability - uCurCenter.z) + cos(uGlobalOffset.z); // creates the motion and gaps
  
  col += line1 * streak1;
  col += line2 * streak2;
  col += line3 * streak3;
  col += line4 * streak4;
  col += line5 * streak5;
 
  gl_FragColor = vec4(col, 1.0);
}