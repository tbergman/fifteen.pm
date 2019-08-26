
import React, { useRef, useState, useCallback, useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useThree, useRender, useResource } from 'react-three-fiber'
import tronFragmentShader from '!raw-loader!glslify-loader!./electronFragment.glsl';
import simpleVertex from '!raw-loader!glslify-loader!./simpleVertex.glsl';

export function TronBuildingShader({ materialRef, pos, size }) {
  let t = 0;
  useRender(
    () => (materialRef.current.uniforms.uTime.value = t = (t + 0.01) % 1),
  );
  const uniforms = useMemo(() => {
    return {
      uTime: { type: 'f', value: 0 },
    }
  }, []);
  return <shaderMaterial
    ref={materialRef}
    uniforms={uniforms}
    vertexShader={simpleVertex}
    fragmentShader={tronFragmentShader}
  />;
}