/*
auto-generated with modifications by: https://github.com/react-spring/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef, useContext, useState, useEffect, useMemo } from 'react'
import { useLoader, useFrame, useResource } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { draco } from 'drei'
import * as C from './constants'
import { MaterialsContext } from './MaterialsContext';
import { useObjectAlongTubeGeometry } from '../../Common/Animations/SplineAnimator.js'
export default function Alien1(props) {
  const group = useRef()
  const { nodes, materials, animations } = useLoader(GLTFLoader, C.ALIEN1, draco('/draco-gltf/'))
  const [skinnedAlien1MeshRef, skinnedAlien1Mesh] = useResource()
  const { polishedSpeckledMarbleTop } = useContext(MaterialsContext);
  const actions = useRef()
  const [mixer] = useState(() => new THREE.AnimationMixer())

  const tubeGeometry = useMemo(() => {
    const circle = new THREE.CircleGeometry(4, 4);
    const points = circle.vertices.reverse(); // reverse it so driver is going in expected dir
    const steps = points.slice(0, points.length - 2); // don't overlap the loop (rm last elt)
    var closedSpline = new THREE.CatmullRomCurve3(steps);
    closedSpline.closed = true;
    closedSpline.curveType = 'catmullrom';
    const extrusionSegments = 10
    const radius = 2
    const radiusSegments = 4
    return new THREE.TubeBufferGeometry(closedSpline, extrusionSegments, radius, radiusSegments, closedSpline.closed);
  })
  const { } = useObjectAlongTubeGeometry({ object: group.current, tubeGeometry })
  useFrame((state, delta) => mixer.update(delta))
  useEffect(() => {
    actions.current = {
      'Armature|mixamo.com|Layer0': mixer.clipAction(animations[0], group.current),
    }
    return () => animations.forEach((clip) => mixer.uncacheClip(clip))
  }, [])
  useEffect(() => void mixer.clipAction(animations[0], group.current).play(), [])
  useEffect(() => {
    if (!skinnedAlien1Mesh) return
    console.log('skinned alient mesh pos', skinnedAlien1Mesh.position)
  })
  return (
    <group ref={group} {...props} dispose={null}>
      <group rotation={[Math.PI / 2, 0, 0]}>
        <primitive object={nodes.mixamorigHips} />
        <skinnedMesh
          ref={skinnedAlien1MeshRef}
          material={polishedSpeckledMarbleTop}
          geometry={nodes.Body_Bodymesh.geometry}
          skeleton={nodes.Body_Bodymesh.skeleton}
          {...props}
        />
      </group>
    </group>
  )
}
