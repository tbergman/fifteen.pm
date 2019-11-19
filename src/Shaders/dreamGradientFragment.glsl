varying vec2 vUv;

void main() {
  vec3 color1Base = vec3(0.91, 0.83, 0.39);
  vec3 color1Wavey = vec3(color1Base.x, sin(vUv.x), sin(vUv.y));
  float mixFromLeftValue = distance(vUv, vec2(0., .5));
  vec3 color1 = mix(color1Base, color1Wavey, mixFromLeftValue);
  vec3 color2 = vec3(0.2, 0.2, 0.2);
  float mixToCenterValue = distance(vUv, vec2(.5, .5));
  vec3 gradientColor = mix(color1, color2, mixToCenterValue);
  vec3 finalColor = gradientColor;
  gl_FragColor = vec4(finalColor, mixToCenterValue);
}
