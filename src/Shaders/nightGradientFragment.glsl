varying vec2 vUv;

void main() {
  vec3 color2 = vec3(0.004,0.08,0.13);
  vec3 color1 = vec3(0.004,0.059,0.03);
  float mixValue = distance(vUv,vec2(.5,.5));
  vec3 color = mix(color1,color2,mixValue);
  gl_FragColor = vec4(color,mixValue);
}
