import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useRender, useResource, useThree } from 'react-three-fiber';
import directionalLightVertex from '!raw-loader!glslify-loader!./directionalLightVertex.glsl';

import simpleVertex from '!raw-loader!glslify-loader!./simpleVertex.glsl';
import tronFragmentShader from '!raw-loader!glslify-loader!./tronFragment.glsl';


// TODO: Shadows http://jsfiddle.net/22jpzktk/
// TODO: Light: https://jsfiddle.net/zhkvcajs/3/
// More details: https://github.com/mrdoob/three.js/issues/8016 x
// https://discourse.threejs.org/t/custom-vertex-shader-with-lambert-lights/2798/4
// TODO shouldn't explicitly pass this ref and use it...
export function TronShader({ pointLight, pos, ...props }) {
  const { camera } = useThree();
  const [materialRef, material] = useResource();
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.userData.uTime = { value: 0 };
      materialRef.current.userData.uGlobalOffset = { value: pos };
      materialRef.current.userData.uCurCenter = { value: camera.position };
      materialRef.current.onBeforeCompile = shader => {
        shader.uniforms.uTime = materialRef.current.userData.uTime;
        shader.uniforms.uGlobalOffset = materialRef.current.userData.uGlobalOffset;
        shader.uniforms.uCurCenter = materialRef.current.userData.uCurCenter;
        shader.fragmentShader = `
        //varying vec3 vViewPosition;
        uniform float uTime;
        uniform vec3 uGlobalOffset;
        uniform vec3 uCurCenter;
        float plot(vec3 st, float pct) {
          return smoothstep(pct - 0.02, pct, st.y) - smoothstep(pct, pct + 0.02, st.y);
        }
        ` + shader.fragmentShader;

        shader.fragmentShader = shader.fragmentShader.replace(
          `gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,
          tronShaderGLSL()
        )
      }
      materialRef.current.needsUpdate = true;
    }
  }, [materialRef])
  useRender((state, time) => {
    if (!materialRef.current) return;
    // console.log('in render:', materialRef);
    materialRef.current.userData.uTime.value += .1;
  });
  // const uniforms = useMemo(() => {
  //   // return THREE.UniformsUtils.merge([
  //   //   THREE.UniformsLib["lights"],
  //   //   {
  //   //     uTime: { value: 0 },
  //   //     uGlobalOffset: { value: pos },
  //   //     uCurCenter: { value: camera.position }
  //   //   },
  //   // ]);
  //   return THREE.UniformsUtils.merge([
  //     THREE.UniformsLib['lights'],
  //     {
  //       lightIntensity: { type: 'f', value: 1.0 },
  //       textureSampler: { type: 't', value: null }
  //     }
  //   ])
  // }, [materialRef]);
  return <meshPhongMaterial
    {...props}
    ref={materialRef}
    receiveShadow
  />;
  // return <shaderMaterial
  //   ref={materialRef}
  //   lights
  //   transparent
  //   uniforms={uniforms}
  //   vertexShader={directionalLightVertex}
  //   fragmentShader={tronFragmentShader}
  // />;
}

function tronShaderGLSL() {
  return `
  vec3 col = vec3(0.00, 0.05, 0.3);

  float line1 = plot(vViewPosition, .25); // currently just setting a simple line down the middle...
  float line2 = plot(vViewPosition, .50); // currently just setting a simple line down the middle...
  float line3 = plot(vViewPosition, .75);
  float line4 = plot(vViewPosition, .85);
  float line5 = plot(vViewPosition, .95);
  float timeVariability = uTime * cos(uGlobalOffset.z);
  
  // TODO right now there are all just slight variations without much forthought about how t make those variations interesting
  float streak1 = sin(vViewPosition.x + uGlobalOffset.x - timeVariability - uCurCenter.x) + cos(uGlobalOffset.z); // creates the motion and gaps
  float streak2 = sin(vViewPosition.y + uGlobalOffset.x - timeVariability - uCurCenter.x) + cos(uGlobalOffset.z); // creates the motion and gaps
  float streak3 = sin(vViewPosition.y + uGlobalOffset.z - timeVariability - uCurCenter.x) + cos(uGlobalOffset.z); // creates the motion and gaps
  float streak4 = sin(vViewPosition.y + uGlobalOffset.z - timeVariability - uCurCenter.z) + cos(uGlobalOffset.z); // creates the motion and gaps
  float streak5 = sin(vViewPosition.y + uGlobalOffset.z - timeVariability - uCurCenter.z) + cos(uGlobalOffset.z); // creates the motion and gaps
  
  col += line1 * streak1;
  col += line2 * streak2;
  col += line3 * streak3;
  col += line4 * streak4;
  col += line5 * streak5;

  outgoingLight *= col;
  gl_FragColor = vec4( outgoingLight, diffuseColor.a );
          `;
}
function plotShaderGLSL() {
  return `
  float plot(vec3 st, float pct) {
    return smoothstep(pct - 0.02, pct, st.y) - smoothstep(pct, pct + 0.02, st.y);
  }
  `
}