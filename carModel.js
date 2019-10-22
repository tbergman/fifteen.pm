import * as THREE from 'three'
import React, { useEffect, useRef } from 'react'
import { useLoader, useFrame } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
  
export default function Model(props) {
  const group = useRef()
  const gltf = useLoader(GLTFLoader, '/car.glb', loader => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco-gltf/')
    loader.setDRACOLoader(dracoLoader)
  })

  return (
    <group ref={group} {...props}>
      <scene name="Scene" >
        <mesh name="button_swing" >
          <bufferGeometry attach="geometry" {...gltf.__$[1].geometry} />
          <meshStandardMaterial attach="material" {...gltf.__$[1].material} />
        </mesh>
        <mesh name="button_life" >
          <bufferGeometry attach="geometry" {...gltf.__$[2].geometry} />
          <meshStandardMaterial attach="material" {...gltf.__$[2].material} />
        </mesh>
        <mesh name="button_dream" >
          <bufferGeometry attach="geometry" {...gltf.__$[3].geometry} />
          <meshStandardMaterial attach="material" {...gltf.__$[3].material} />
        </mesh>
        <mesh name="button_natural" >
          <bufferGeometry attach="geometry" {...gltf.__$[4].geometry} />
          <meshStandardMaterial attach="material" {...gltf.__$[4].material} />
        </mesh>
        <mesh name="speedometer" >
          <bufferGeometry attach="geometry" {...gltf.__$[5].geometry} />
          <meshStandardMaterial attach="material" {...gltf.__$[5].material} />
        </mesh>
        <mesh name="wheel" >
          <bufferGeometry attach="geometry" {...gltf.__$[6].geometry} />
          <meshStandardMaterial attach="material" {...gltf.__$[6].material} />
        </mesh>
        <mesh name="wheel_internal" >
          <bufferGeometry attach="geometry" {...gltf.__$[7].geometry} />
          <meshStandardMaterial attach="material" {...gltf.__$[7].material} />
        </mesh>
        <mesh name="Gloves" >
          <bufferGeometry attach="geometry" {...gltf.__$[8].geometry} />
          <meshStandardMaterial attach="material" {...gltf.__$[8].material} />
        </mesh>
        <mesh name="Tops" >
          <bufferGeometry attach="geometry" {...gltf.__$[9].geometry} />
          <meshStandardMaterial attach="material" {...gltf.__$[9].material} />
        </mesh>
      </scene>
    </group>
  )
}