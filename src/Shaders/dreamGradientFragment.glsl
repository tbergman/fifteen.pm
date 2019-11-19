varying vec2 vUv;

void main() {
  vec3 color1 = vec3(0.91, 0.83, 0.39);
  vec3 color2 = vec3(0.2, 0.2, 0.2);
  float mixValue = distance(vUv, vec2(.5, .5));
  vec3 color = mix(color1, color2, mixValue);
  gl_FragColor = vec4(color, mixValue);
}
