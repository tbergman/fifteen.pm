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

export default function Heidi({ catwalk, offset, animationName, ...props }) {
  const group = useRef()
  const { nodes, materials, animations } = useLoader(GLTFLoader, C.HEIDI, draco('/draco-gltf/'))
  const {
    polishedSpeckledMarbleTop: body,
    naiveGlass2: clothing2,
    naiveGlass: clothing,
    naiveGlass2: eyes,
  } = useContext(MaterialsContext);
  useObjectAlongTubeGeometry({
    object: group.current,
    tubeGeometry: catwalk,
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
      <group
        position={[-1, 0, 0]}
        scale={[.01, .01, .01]}
        rotation={[THREE.Math.degToRad(0), THREE.Math.degToRad(-180), THREE.Math.degToRad(90)]}
      >
        <primitive object={nodes.mixamorigHips} />
        <skinnedMesh
          lights={true}
          castShadow={true}
          receiveShadow={true}
          material={body}
          geometry={nodes.Body_Bodymesh.geometry}
          skeleton={nodes.Body_Bodymesh.skeleton}
        />
        <skinnedMesh
          material={eyes}
          geometry={nodes.default_defaultmesh.geometry}
          skeleton={nodes.default_defaultmesh.skeleton}
        />
        <skinnedMesh
          material={eyes}
          geometry={nodes.Eyelashes_Eyelashesmesh.geometry}
          skeleton={nodes.Eyelashes_Eyelashesmesh.skeleton}
        />
        <skinnedMesh material={body} geometry={nodes.Hair07.geometry} skeleton={nodes.Hair07.skeleton} />
        <skinnedMesh material={clothing2}
          geometry={nodes.Torus.geometry}
          skeleton={nodes.Torus.skeleton}
        />
        <skinnedMesh
          material={clothing2}
          geometry={nodes.Torus001.geometry}
          skeleton={nodes.Torus001.skeleton}
        />
        <skinnedMesh
          material={clothing2}
          geometry={nodes.Torus002_Torus004.geometry}
          skeleton={nodes.Torus002_Torus004.skeleton}
        />
        <skinnedMesh
          material={clothing}
          geometry={nodes.Torus003.geometry}
          skeleton={nodes.Torus003.skeleton}
        />
        <skinnedMesh
          material={clothing}
          geometry={nodes.Torus004_Torus006.geometry}
          skeleton={nodes.Torus004_Torus006.skeleton}
        />
        <skinnedMesh
          material={clothing2}
          geometry={nodes.Torus005.geometry}
          skeleton={nodes.Torus005.skeleton}
        />
        <skinnedMesh
          material={clothing2}
          geometry={nodes.Torus006_Torus008.geometry}
          skeleton={nodes.Torus006_Torus008.skeleton}
        />
        <skinnedMesh
          material={clothing2}
          geometry={nodes.Torus007.geometry}
          skeleton={nodes.Torus007.skeleton}
        />
      </group>
    </group>
  )
}
