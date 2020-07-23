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

export default function GuapxBoxX({catwalk, offset, animationName, ...props}) {
  const group = useRef()
  const { nodes, materials, animations } = useLoader(GLTFLoader, C.GUAPXBOX_X, draco('/draco-gltf/'))
  const { polishedSpeckledMarbleTop } = useContext(MaterialsContext);
  useObjectAlongTubeGeometry({
    object: group.current,
    tubeGeometry: catwalk,
    // speed: speed,
    offset: offset,
  })
  const { actions, mixer } = useAnimationSequence({ animationName })

  useEffect(() => {
    actions.current = {
      insideout: mixer.clipAction(animations[0], group.current),
      mate: mixer.clipAction(animations[1], group.current),
      roses: mixer.clipAction(animations[2], group.current),
    }
    return () => animations.forEach((clip) => mixer.uncacheClip(clip))
  }, [])
  return (
    <group ref={group} {...props} dispose={null}>
      <group scale={[.01, .01, .01]} rotation={[THREE.Math.degToRad(0),THREE.Math.degToRad(-180),THREE.Math.degToRad(90)]}>
      <primitive object={nodes.mixamorigHips} />
      <skinnedMesh
        material={polishedSpeckledMarbleTop}
        geometry={nodes.Ch43_Mesh.geometry}
        skeleton={nodes.Ch43_Mesh.skeleton}
      />
      <skinnedMesh
        material={polishedSpeckledMarbleTop}
        geometry={nodes.Cube_Cube001.geometry}
        skeleton={nodes.Cube_Cube001.skeleton}
      />
      <skinnedMesh material={polishedSpeckledMarbleTop} geometry={nodes.Plane.geometry} skeleton={nodes.Plane.skeleton} />
      <skinnedMesh
        material={polishedSpeckledMarbleTop}
        geometry={nodes.Plane001.geometry}
        skeleton={nodes.Plane001.skeleton}
      />
      <skinnedMesh
        material={polishedSpeckledMarbleTop}
        geometry={nodes.Plane002.geometry}
        skeleton={nodes.Plane002.skeleton}
      />
      <skinnedMesh
        material={polishedSpeckledMarbleTop}
        geometry={nodes.Plane003.geometry}
        skeleton={nodes.Plane003.skeleton}
      />
      </group>
    </group>
  )
}
