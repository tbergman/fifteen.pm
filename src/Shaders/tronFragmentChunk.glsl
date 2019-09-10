// This is a small chunk that gets pulled into a phong material to make a "TronShader" component.
vec3 col = vec3(0.00, 0.05, 0.3);

float randVal = cos(rand(vViewPosition.xy));

float line1 = plot(vViewPosition, .25); // currently just setting a simple line down the middle...
float line2 = plot(vViewPosition, .50); // currently just setting a simple line down the middle...
float line3 = plot(vViewPosition, .75);
float line4 = plot(vViewPosition, .85);
float line5 = plot(vViewPosition, .95);
float timeVariability = uTime * randVal;

// TODO right now there are all just slight variations without much forthought about how t make those variations interesting
float streak1 = sin(vViewPosition.x - timeVariability - uCurCenter.x) + cos(randVal); // creates the motion and gaps
float streak2 = sin(vViewPosition.y - timeVariability - uCurCenter.x) + cos(randVal); // creates the motion and gaps
float streak3 = sin(vViewPosition.y - timeVariability - uCurCenter.x) + cos(randVal); // creates the motion and gaps
float streak4 = sin(vViewPosition.y - timeVariability - uCurCenter.z) + cos(randVal); // creates the motion and gaps
float streak5 = sin(vViewPosition.y - timeVariability - uCurCenter.z) + cos(randVal); // creates the motion and gaps

col += line1 * streak1;
col += line2 * streak2;
col += line3 * streak3;
col += line4 * streak4;
col += line5 * streak5;

outgoingLight *= col;
gl_FragColor = vec4( outgoingLight, diffuseColor.a );
 


// varying vec3 vViewPosition;
// uniform float uTime;
// uniform vec3 uGlobalOffset;
// uniform vec3 uCurCenter;

// float plot(vec2 st, float pct) {
//   return smoothstep(pct - 0.02, pct, st.y) - smoothstep(pct, pct + 0.02, st.y);
// }

// // TODO maybe can implement a map function ? https://gist.github.com/companje/29408948f1e8be54dd5733a74ca49bb9
// void main() {
//   vec3 col = vec3(0.00, 0.05, 0.3);

//   float line1 = plot(vViewPosition, .25); // currently just setting a simple line down the middle...
//   float line2 = plot(vViewPosition, .50); // currently just setting a simple line down the middle...
//   float line3 = plot(vViewPosition, .75);
//   float line4 = plot(vViewPosition, .85);
//   float line5 = plot(vViewPosition, .95);
//   float timeVariability = uTime * cos(uGlobalOffset.z);
  
//   // TODO right now there are all just slight variations without much forthought about how t make those variations interesting
//   float streak1 = sin(vViewPosition.x + uGlobalOffset.x - timeVariability - uCurCenter.x) + cos(uGlobalOffset.z); // creates the motion and gaps
//   float streak2 = sin(vViewPosition.y + uGlobalOffset.x - timeVariability - uCurCenter.x) + cos(uGlobalOffset.z); // creates the motion and gaps
//   float streak3 = sin(vViewPosition.y + uGlobalOffset.z - timeVariability - uCurCenter.x) + cos(uGlobalOffset.z); // creates the motion and gaps
//   float streak4 = sin(vViewPosition.y + uGlobalOffset.z - timeVariability - uCurCenter.z) + cos(uGlobalOffset.z); // creates the motion and gaps
//   float streak5 = sin(vViewPosition.y + uGlobalOffset.z - timeVariability - uCurCenter.z) + cos(uGlobalOffset.z); // creates the motion and gaps
  
//   col += line1 * streak1;
//   col += line2 * streak2;
//   col += line3 * streak3;
//   col += line4 * streak4;
//   col += line5 * streak5;

//   outgoingLight *= col;
//   gl_FragColor = vec4( outgoingLight, diffuseColor.a );

//   // gl_FragColor = vec4(col, 1.0);
// }


// // precision highp float;

// // varying vec2 vViewPosition;
// // varying vec3 vecPos;
// // varying vec3 vecNormal;

// // uniform float lightIntensity;
// // uniform sampler2D textureSampler;

// // struct PointLight {
// //   vec3 color;
// //   vec3 position; // light position, in camera coordinates
// //   float distance; // used for attenuation purposes. Since
// //                   // we're writing our own shader, it can
// //                   // really be anything we want (as long as
// //                   // we assign it to our light in its
// //                   // "distance" field
// // };

// // uniform PointLight pointLights[NUM_POINT_LIGHTS];

// // void main(void) {
// //   // Pretty basic lambertian lighting...
// //   vec4 addedLights = vec4(0.0,
// //                           0.0,
// //                           0.0,
// //                           1.0);
// //   for(int l = 0; l < NUM_POINT_LIGHTS; l++) {
// //       vec3 lightDirection = normalize(vecPos
// //                             - pointLights[l].position);
// //       addedLights.rgb += clamp(dot(-lightDirection,
// //                                vecNormal), 0.0, 1.0)
// //                          * pointLights[l].color
// //                          * lightIntensity;
// //   }
// //   gl_FragColor = texture2D(textureSampler, vViewPosition)
// //                  * addedLights;
// // }