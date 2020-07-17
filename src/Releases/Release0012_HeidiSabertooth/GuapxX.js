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
import { useObjectAlongTubeGeometry } from '../../Common/Animations/SplineAnimator.js'

export default function GuapxX({ catwalk, ...props }) {
  const group = useRef()
  const [guapxXMeshRef, guapxXMesh] = useResource()
  const { nodes, materials, animations } = useLoader(GLTFLoader, C.GUAPX_X, draco('/draco-gltf/'))
  const { polishedSpeckledMarbleTop } = useContext(MaterialsContext);
  const actions = useRef()
  const [mixer] = useState(() => new THREE.AnimationMixer())
  useObjectAlongTubeGeometry({
    object: group.current,
    tubeGeometry: catwalk,
    speed: 1.7,
    offset: 0,
  })
  useFrame((state, delta) => mixer.update(delta))
  useEffect(() => {
    actions.current = {
      'Armature|mixamo.com|Layer0.001': mixer.clipAction(animations[0], group.current),
    }
    return () => animations.forEach((clip) => mixer.uncacheClip(clip))
  }, [])
  useEffect(() => void mixer.clipAction(animations[0], group.current).play(), [])
  return (
    <group ref={group} {...props} dispose={null}>
      <group rotation={[THREE.Math.degToRad(-90),THREE.Math.degToRad(-90),0]}>
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
