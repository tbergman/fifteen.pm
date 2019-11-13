varying vec2 vUv;

void main() {
  vec3 color2 = vec3(.93,.12,.23);
  vec3 color1 = vec3(.58,.16,.12);
  float mixValue = distance(vUv,vec2(.5,.5));
  vec3 color = mix(color1,color2,mixValue);
  gl_FragColor = vec4(color,mixValue);
}
