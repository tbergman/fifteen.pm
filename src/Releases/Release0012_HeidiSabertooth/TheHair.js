/*
auto-generated with modifications by: https://github.com/react-spring/gltfjsx
*/
import * as C from './constants.js'
import * as THREE from 'three'
import React, { useContext, useRef, useState, useEffect } from 'react'
import { useLoader, useFrame, useResource } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { draco } from 'drei'
import { MaterialsContext } from './MaterialsContext';
import { useObjectAlongTubeGeometry } from '../../Common/Animations/SplineAnimator.js'

export default function TheHair({ catwalk, ...props }) {
    const group = useRef()
    const { nodes, materials, animations } = useLoader(GLTFLoader, C.THE_HAIR, draco('/draco-gltf/'))
    const { polishedSpeckledMarbleTop } = useContext(MaterialsContext);
    const [theHairMeshRef, theHairMesh] = useResource()
    const actions = useRef()
    const [mixer] = useState(() => new THREE.AnimationMixer())
    useObjectAlongTubeGeometry({ object: group.current, tubeGeometry: catwalk })
    useFrame((state, delta) => mixer.update(delta))
    useEffect(() => {
        actions.current = {
            Action: mixer.clipAction(animations[0], group.current),
        }
        return () => animations.forEach((clip) => mixer.uncacheClip(clip))
    }, [])
    useEffect(() => void mixer.clipAction(animations[0], group.current).play(), [])
    return (
        <group ref={group} {...props} dispose={null}>
            <primitive object={nodes.Bone} />
            <primitive object={nodes.BottomIKBone} />
            <primitive object={nodes.MiddleIKBone} />
            <skinnedMesh
                ref={theHairMeshRef}
                material={polishedSpeckledMarbleTop}
                geometry={nodes.Hair07.geometry}
                skeleton={nodes.Hair07.skeleton}
            />
        </group>
    )
}
