/*
auto-generated with modifications by: https://github.com/react-spring/gltfjsx
*/

import { draco } from 'drei'
import React, { useContext, useEffect, useRef } from 'react'
import { useLoader } from 'react-three-fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useAnimationSequence } from '../../../Common/Animations/AnimationSequence.js'
import { useObjectAlongTubeGeometry } from '../../../Common/Animations/SplineAnimator.js'
import { useAnimationFadeIn } from '../../../Common/Animations/FadeIns.js';
import * as C from '../constants.js'
import { MaterialsContext } from '../MaterialsContext'


export default function Heidi({ actionName, catwalk, offset, animationName, animationTimeScale, ...props }) {
  const group = useRef()
  const { nodes, materials, animations } = useLoader(GLTFLoader, C.HEIDI, draco('/draco-gltf/'))
  const {
    foamGrip: body,
    // polishedSpeckledMarbleTop: body,
    naiveGlass: clothing,
    naiveGlass: jewelry,
    naiveGlass: eyes,
  } = useContext(MaterialsContext);
  const { actions, mixer, setAnimationsHaveLoaded } = useAnimationSequence({ animationName, animationTimeScale })
  useAnimationFadeIn({ actions: actions.current, actionName })
  useObjectAlongTubeGeometry({
    object: group.current,
    tubeGeometry: catwalk,
    offset: offset,
  })
  useEffect(() => {
    actions.current = {
      insideout1: mixer.clipAction(animations[0], group.current),
      insideout2: mixer.clipAction(animations[1], group.current),
      insideout3: mixer.clipAction(animations[2], group.current),
      insideout4: mixer.clipAction(animations[3], group.current),
      mate1: mixer.clipAction(animations[4], group.current),
      mate2: mixer.clipAction(animations[5], group.current),
      mate3: mixer.clipAction(animations[6], group.current),
      roses1: mixer.clipAction(animations[7], group.current),
    }
    setAnimationsHaveLoaded(true)
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
        <skinnedMesh
          material={body}
          geometry={nodes.Hair07.geometry}
          skeleton={nodes.Hair07.skeleton}
        />
        <skinnedMesh
          material={clothing}
          geometry={nodes.Torus.geometry}
          skeleton={nodes.Torus.skeleton}
        />
        <skinnedMesh
          material={clothing}
          geometry={nodes.Torus001.geometry}
          skeleton={nodes.Torus001.skeleton}
        />
        <skinnedMesh
          material={jewelry}
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
          material={clothing}
          geometry={nodes.Torus005.geometry}
          skeleton={nodes.Torus005.skeleton}
        />
        <skinnedMesh
          material={clothing}
          geometry={nodes.Torus006_Torus008.geometry}
          skeleton={nodes.Torus006_Torus008.skeleton}
        />
        <skinnedMesh
          material={clothing}
          geometry={nodes.Torus007.geometry}
          skeleton={nodes.Torus007.skeleton}
        />
      </group>
    </group>
  )
}
