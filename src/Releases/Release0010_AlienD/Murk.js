
import * as THREE from "three";
/* eslint import/no-webpack-loader-syntax: off */
import terrainNoiseVertexShader from '!raw-loader!glslify-loader!./terrainNoiseVertex.glsl';
/* eslint import/no-webpack-loader-syntax: off */
import terrainFragmentShader from '!raw-loader!glslify-loader!./terrainNoiseFragment.glsl';
import React, { useEffect, useRef, useContext, useMemo } from "react";
import { useLoader, useFrame, useThree } from "react-three-fiber";
import {map, lerp} from './utils'
import * as C from './constants'

export default function Murk(props) {

  const {camera, mouse, clock, gl, size } = useThree();
  console.log('Here I AM!')
  console.log(C.MURK_TEXTURE_URL);
  const terrainTexture = useLoader(THREE.TextureLoader, C.MURK_TEXTURE_URL )
  console.log(terrainTexture);

  const mesh = useMemo(() => {
    if (!terrainTexture) {
      return;
    }
    let geometry = new THREE.PlaneBufferGeometry(1000, 1000, 1000, 1000);

    let uniforms = {
      time: { type: "f", value: 0.0 },
      scroll: { type: "f", value: 3.0 },
      distortCenter: { type: "f", value: 2 },
      roadWidth: { type: "f", value: 0.5 },
      pallete:{ type: "t", value: null},
      speed: { type: "f", value: 3 },
      maxHeight: { type: "f", value: 20.0 },
      color: new THREE.Color(1, 1, 1)
    }
    
    let material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([ THREE.ShaderLib.basic.uniforms, uniforms ]),
      vertexShader: terrainNoiseVertexShader,
      fragmentShader: terrainFragmentShader,
      wireframe:false,
      fog:false
    });

    let terrain = new THREE.Mesh(geometry, material);
    terrain.position.z = -200;
    terrain.rotation.x = -Math.PI / 2;
    terrain.material.uniforms.pallete.value = terrainTexture;
    terrain.material.needsUpdate = true;
    return terrain;
  });

  useFrame(() => {
    if (!mesh) {
      return;
    }
    // // damping mouse for smoother interaction
    // mouse.xDamped = lerp(mouse.xDamped, mouse.x, 0.1);
    // mouse.yDamped = lerp(mouse.yDamped, mouse.y, 0.1);

    
    // var time = clock.getElapsedTime() * 0.001
    // mesh.material.uniforms.time.value = time
    // mesh.material.uniforms.scroll.value = time + map(mouse.yDamped, 0, size.height, 0, 4);
    // mesh.material.uniforms.distortCenter.value = Math.sin(time) * 0.1;
    // mesh.material.uniforms.roadWidth.value = map(mouse.xDamped, 0, size.width, 1, 4.5);

    // camera.position.y = map(mouse.yDamped, 0, height, 4, 11);
  })

  return <primitive object={mesh}/>
}