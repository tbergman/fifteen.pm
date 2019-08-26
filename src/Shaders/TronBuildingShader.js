
import React, { useRef, useState, useCallback, useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useThree, useRender, useResource } from 'react-three-fiber'
import tronFragmentShader from '!raw-loader!glslify-loader!./tronFragment.glsl';
import simpleVertex from '!raw-loader!glslify-loader!./simpleVertex.glsl';

export function TronBuildingShader({ materialRef, pos, size }) {
  const { camera } = useThree();
  let t = 0;
  useRender(
    () => {
      if (!materialRef.current) return; // avoid re-initialization async issues (e.g. if tiling)
      materialRef.current.uniforms.uTime.value += .01;// = t = (t + 0.01) % 1
    });
  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uPosOffset: { value: pos },
      uCurCenter: { value: camera.position }
    }
  }, [materialRef]);
  return <shaderMaterial
    ref={materialRef}
    uniforms={uniforms}
    vertexShader={simpleVertex}
    fragmentShader={tronFragmentShader}
  />;
}