import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useRender, useResource, useThree } from 'react-three-fiber';
import { assetPathShared } from "../Utils/assets";

import tronFragmentChunk from '!raw-loader!glslify-loader!./tronFragmentChunk.glsl';
import plotChunk from '!raw-loader!glslify-loader!./plotChunk.glsl';

// Shader built in the style of: https://medium.com/@pailhead011/extending-three-js-materials-with-glsl-78ea7bbb9270
export function TronShader({ pointLight, pos, ...props }) {
  const { camera } = useThree();
  const [materialRef, material] = useResource();
  // const envMap = useMemo(() => {
  //   return new THREE.CubeTextureLoader()
  //     .setPath(assetPathShared('textures/env-maps/barc-rooftop/'))
  //     .load([
  //       'px.png',
  //       'nx.png',
  //       'py.png',
  //       'ny.png',
  //       'pz.png',
  //       'nz.png',
  //     ]);
  // });
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.userData.uTime = { value: 0 };
      materialRef.current.userData.uGlobalOffset = { value: pos };
      materialRef.current.userData.uCurCenter = { value: camera.position };
      materialRef.current.onBeforeCompile = shader => {
        shader.uniforms.uTime = materialRef.current.userData.uTime;
        shader.uniforms.uGlobalOffset = materialRef.current.userData.uGlobalOffset;
        shader.uniforms.uCurCenter = materialRef.current.userData.uCurCenter;

        // add in custom uniforms and funcs
        shader.fragmentShader = `
        uniform float uTime;
        uniform vec3 uGlobalOffset;
        uniform vec3 uCurCenter;
        ` +
          plotChunk +
          shader.fragmentShader;

        // add custom code before the last line
        // shader.fragmentShader = shader.fragmentShader.replace(
        //   `gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,
        //   tronFragmentChunk
        // )
      }
      materialRef.current.needsUpdate = true;
    }
  }, [])
  useRender((state, time) => {
    if (!materialRef.current) return;
    materialRef.current.userData.uTime.value += .1;
  });
  return <meshStandardMaterial
    {...props}
    ref={materialRef}
    // receiveShadow
    // castShadow
    // envMap={envMap}
  />
}