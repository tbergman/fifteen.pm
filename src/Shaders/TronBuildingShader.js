
import simpleVertex from '!raw-loader!glslify-loader!./simpleVertex.glsl';
import tronFragmentShader from '!raw-loader!glslify-loader!./tronFragment.glsl';
import React, { useMemo } from 'react';
import { useRender, useThree } from 'react-three-fiber';


// TODO: Shadows http://jsfiddle.net/22jpzktk/
export function TronBuildingShader({ materialRef, pos, size }) {
  const { camera } = useThree();
  useRender(
    () => {
      if (!materialRef.current) return; // avoid re-initialization async issues (e.g. if tiling)
      materialRef.current.uniforms.uTime.value += .1;
    });
  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uGlobalOffset: { value: pos },
      uCurCenter: { value: camera.position }
    }
  }, [materialRef]);
  return <shaderMaterial
    ref={materialRef}
    uniforms={uniforms}
    vertexShader={simpleVertex}
    fragmentShader={tronFragmentShader}
    // lights={true}
  />;
}