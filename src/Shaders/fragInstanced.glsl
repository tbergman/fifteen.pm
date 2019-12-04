#define SHADER_NAME fragInstanced
#extension GL_OES_standard_derivatives : enable
precision highp float;
varying vec3 vColor;
varying vec3 vPosition;
void main() {
  vec3 fdx = dFdx(vPosition);
  vec3 fdy = dFdy(vPosition);
  vec3 normal = normalize(cross(fdx, fdy));
  float diffuse = dot(normal, vec3(0.0, 0.0, 1.0));
  gl_FragColor = vec4(diffuse * vColor, 1.0);
}