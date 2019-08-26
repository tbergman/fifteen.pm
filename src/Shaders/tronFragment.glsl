varying vec2 vUv;
uniform float uTime;
uniform vec3 uGlobalOffset;
uniform vec3 uCurCenter;

float plot(vec2 st, float pct) {
  return smoothstep(pct - 0.02, pct, st.y) - smoothstep(pct, pct + 0.02, st.y);
}

void main() {
  vec3 col = vec3(0.);
  float pct = plot(vUv, .50); // currently just setting a simple line down the middle...
  float timeVariability = uTime * cos(uGlobalOffset.z);
  float streak = sin(vUv.x + uGlobalOffset.x - timeVariability - uCurCenter.x) + cos(uGlobalOffset.z); // creates the motion and gaps
  col += pct * streak;
  
  gl_FragColor = vec4(col, 1.0);
}