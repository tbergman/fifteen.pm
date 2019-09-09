import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useRender, useThree } from 'react-three-fiber';
import simpleVertex from '!raw-loader!glslify-loader!./simpleVertex.glsl';
import tronFragmentShader from '!raw-loader!glslify-loader!./tronFragment.glsl';


// TODO: Shadows http://jsfiddle.net/22jpzktk/
// TODO: Light: https://jsfiddle.net/zhkvcajs/3/
// More details: https://github.com/mrdoob/three.js/issues/8016 x
// https://discourse.threejs.org/t/custom-vertex-shader-with-lambert-lights/2798/4
export function TronBuildingShader({ materialRef, pos }) {
  const { camera } = useThree();
  useRender(
    () => {
      if (!materialRef.current) return; // avoid re-initialization async issues (e.g. if tiling)
      materialRef.current.uniforms.uTime.value += .1;
    });
  const uniforms = useMemo(() => {
    return THREE.UniformsUtils.merge([
      THREE.UniformsLib["ambient"],
      THREE.UniformsLib["lights"],
      {
        uTime: { value: 0 },
        uGlobalOffset: { value: pos },
        uCurCenter: { value: camera.position }
      },
    ]);
  }, [materialRef]);
  return <shaderMaterial
    ref={materialRef}
    lights
    uniforms={uniforms}
    vertexShader={simpleVertex}
    fragmentShader={tronFragmentShader}
  />;
}