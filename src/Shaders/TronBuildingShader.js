
import React, { useRef, useState, useCallback, useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useThree, useRender, useResource } from 'react-three-fiber'
import tronFragmentShader from '!raw-loader!glslify-loader!./electronFragment.glsl';
import simpleVertex from '!raw-loader!glslify-loader!./simpleVertex.glsl';

export function TronBuildingShader({ materialRef, pos, size }) {
  // url1, url2, disp, intensity, hovered }) {
  // const { progress } = useSpring({ progress: hovered ? 1 : 0 })
  // const { gl, invalidate } = useThree()
  // const uTime = useRef();
  let uTime = 0;
  useRender((state, time) => {
    uTime = time;
  });
  // const args = useMemo(() => {
  //   const loader = new THREE.TextureLoader()
  //   const texture1 = loader.load(url1, invalidate)
  //   const texture2 = loader.load(url2, invalidate)
  //   const dispTexture = loader.load(disp, invalidate)

  //   dispTexture.wrapS = dispTexture.wrapT = THREE.RepeatWrapping
  //   texture1.magFilter = texture2.magFilter = THREE.LinearFilter
  //   texture1.minFilter = texture2.minFilter = THREE.LinearFilter

  //   texture1.anisotropy = gl.capabilities.getMaxAnisotropy()
  //   texture2.anisotropy = gl.capabilities.getMaxAnisotropy()

  const args = {
    uniforms: {
      uTime: { type: 'f', value: uTime }
      //   effectFactor: { type: 'f', value: intensity },
      //   dispFactor: { type: 'f', value: 0 },
      //   texture: { type: 't', value: texture1 },
      //   texture2: { type: 't', value: texture2 },
      //   disp: { type: 't', value: dispTexture },
    },
    vertexShader: simpleVertex,
    fragmentShader: tronFragmentShader,
  };
  // }
  //, [uTime])//[url1, url2, disp])
  // return (
  //   <mesh>
  //     <planeBufferGeometry attach="geometry" args={[8, 8]} />
  //     <a.shaderMaterial attach="material" args={[args]} uniforms-dispFactor-value={progress} />
  //   </mesh>
  // )
  // return <><shaderMaterial args={[args]} /></>;
  // return (
  //   <mesh
  //     position={pos}
  //     rotation={new THREE.Euler(-Math.PI / 2, 0, 0)}
  //   >
  //     <planeBufferGeometry attach="geometry" args={[size-.1, size-.1]} />
  //     <shaderMaterial attach="material" args={[args]} />
  //     {/* <meshBasicMaterial attach="material" color="white" /> */}
  //   </mesh>
  // )
  // return <shaderMaterial args={[args]} />;
  return <shaderMaterial ref={materialRef} args={[args]} />;
}