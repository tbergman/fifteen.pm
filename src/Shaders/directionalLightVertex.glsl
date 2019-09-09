// #if NUM_DIR_LIGHTS > 0
// struct DirectionalLight {
//   vec3 direction;
//   vec3 color;
//   int shadow;
//   float shadowBias;
//   float shadowRadius;
//   vec2 shadowMapSize;
// };
// uniform DirectionalLight directionalLights[NUM_DIR_LIGHTS];
// #endif
// varying vec3 color;
// void main() {
//   float r = directionalLights[0].color.r;
//   color = vec3(r, 1.0, 0.0);
//   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }
varying vec2 vUv;
varying vec3 vecPos;
varying vec3 vecNormal;

void main() {
  vUv = uv;
  // Since the light is in camera coordinates,
  // I'll need the vertex position in camera coords too
  vecPos = (modelViewMatrix * vec4(position, 1.0)).xyz;
  // That's NOT exacly how you should transform your
  // normals but this will work fine, since my model
  // matrix is pretty basic
  vecNormal = (modelViewMatrix * vec4(normal, 0.0)).xyz;
  gl_Position = projectionMatrix *
                vec4(vecPos, 1.0);
}