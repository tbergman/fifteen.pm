varying vec2 vUv;

void main() {
  vec3 color2 = vec3(.16,.5,.73);
  vec3 color1 = vec3(.43,.84,.98);
  float mixValue = distance(vUv,vec2(.5,.5));
  vec3 color = mix(color1,color2,mixValue);
  gl_FragColor = vec4(color,mixValue);
}
