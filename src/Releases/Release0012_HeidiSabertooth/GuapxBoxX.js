/*
auto-generated with modifications by: https://github.com/react-spring/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef, useState, useContext, useEffect } from 'react'
import { useLoader, useFrame } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { draco } from 'drei'
import * as C from './constants.js';
import { MaterialsContext } from './MaterialsContext';
import { useObjectAlongTubeGeometry } from '../../Common/Animations/SplineAnimator.js'
import { useAnimationSequence } from '../../Common/Animations/AnimationSequence.js';

export default function GuapxBoxX({ catwalk, offset, animationName, animationTimeScale, ...props }) {
  const group = useRef()
  const { nodes, materials, animations } = useLoader(GLTFLoader, C.GUAPXBOX_X, draco('/draco-gltf/'))
  const {
    polishedSpeckledMarbleTop: body,
    polishedSpeckledMarbleTop: clothing,
    naiveGlass: clothing2,
  } = useContext(MaterialsContext);
  useObjectAlongTubeGeometry({
    object: group.current,
    tubeGeometry: catwalk,
    // speed: speed,
    offset: offset,
  })
  const { actions, mixer, setAnimationsHaveLoaded } = useAnimationSequence({ animationName, animationTimeScale })
  useEffect(() => {
    actions.current = {
      insideout1: mixer.clipAction(animations[0], group.current),
      insideout2: mixer.clipAction(animations[1], group.current),
      insideout3: mixer.clipAction(animations[2], group.current),
      mate1: mixer.clipAction(animations[3], group.current),
      mate2: mixer.clipAction(animations[4], group.current),
      mate3: mixer.clipAction(animations[5], group.current),
      roses1: mixer.clipAction(animations[6], group.current),
      roses2: mixer.clipAction(animations[7], group.current),
      roses3: mixer.clipAction(animations[8], group.current),
    }
    setAnimationsHaveLoaded(true)
    return () => animations.forEach((clip) => mixer.uncacheClip(clip))
  }, [])
  return (
    <group ref={group} {...props} dispose={null}>
      <group
        position={[-1, 0, 0]}
        scale={[.01, .01, .01]}
        rotation={[THREE.Math.degToRad(0), THREE.Math.degToRad(-180), THREE.Math.degToRad(90)]} {...props}
      >
        <primitive object={nodes.mixamorigHips} />
        <skinnedMesh
          material={body}
          geometry={nodes.Ch43_Mesh.geometry}
          skeleton={nodes.Ch43_Mesh.skeleton}
        />
        <skinnedMesh
          material={clothing}
          geometry={nodes.Cube_Cube001.geometry}
          skeleton={nodes.Cube_Cube001.skeleton}
        />
        <skinnedMesh
          material={clothing2}
          geometry={nodes.Plane.geometry}
          skeleton={nodes.Plane.skeleton}
        />
        <skinnedMesh
          material={clothing2}
          geometry={nodes.Plane001.geometry}
          skeleton={nodes.Plane001.skeleton}
        />
        <skinnedMesh
          material={clothing2}
          geometry={nodes.Plane002.geometry}
          skeleton={nodes.Plane002.skeleton}
        />
        <skinnedMesh
          material={clothing2}
          geometry={nodes.Plane003.geometry}
          skeleton={nodes.Plane003.skeleton}
        />
      </group>
    </group>
  )
}
