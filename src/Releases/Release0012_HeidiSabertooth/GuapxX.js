/*
auto-generated with modiifications by: https://github.com/react-spring/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef, useState, useEffect, useContext } from 'react'
import { useLoader, useFrame, useResource } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { draco } from 'drei'
import * as C from './constants.js';
import { MaterialsContext } from './MaterialsContext';
import TheHair from './TheHair.js'

export default function GuapxX(props) {
  const group = useRef()
  const [guapxXMeshRef, guapxXMesh] = useResource()
  const { nodes, materials, animations } = useLoader(GLTFLoader, C.GUAPX_X, draco('/draco-gltf/'))
  const { polishedSpeckledMarbleTop } = useContext(MaterialsContext);
  const actions = useRef()
  const [mixer] = useState(() => new THREE.AnimationMixer())
  useFrame((state, delta) => mixer.update(delta))
  useEffect(() => {
    actions.current = {
      'Armature|mixamo.com|Layer0.001': mixer.clipAction(animations[0], group.current),
    }
    return () => animations.forEach((clip) => mixer.uncacheClip(clip))
  }, [])
  useEffect(() => void mixer.clipAction(animations[0], group.current).play(), [])
  useFrame(() => {
    if (!guapxXMesh) return;
    // console.log(nodes.HeadTop.position)
    // console.log(nodes.Ch43_Mesh003.skeleton.bones[0].position)
  })
  return (
    <group ref={group} {...props} dispose={null}>

      <group rotation={[0, 0, Math.PI / 2]} scale={[1, 1, 1]}>
        <primitive object={nodes.mixamorigHips} />
        <skinnedMesh
          ref={guapxXMeshRef}
          material={polishedSpeckledMarbleTop}
          geometry={nodes.Ch43_Mesh003.geometry}
          skeleton={nodes.Ch43_Mesh003.skeleton}
        >
          {props.children}
        </skinnedMesh>

      </group>
    </group>
  )
}
