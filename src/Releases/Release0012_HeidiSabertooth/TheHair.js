/*
auto-generated with modifications by: https://github.com/react-spring/gltfjsx
*/
import * as C from './constants.js'
import * as THREE from 'three'
import React, { useRef, useState, useEffect } from 'react'
import { useLoader, useFrame } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { draco } from 'drei'

export default function TheHair(props) {
    const group = useRef()
    const { nodes, materials, animations } = useLoader(GLTFLoader, C.THE_HAIR, draco('/draco-gltf/'))

    const actions = useRef()
    const [mixer] = useState(() => new THREE.AnimationMixer())
    useFrame((state, delta) => mixer.update(delta))
    useEffect(() => {
        console.log("ANIMATIONS", animations)
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
            <skinnedMesh material={materials.lambert53SG} geometry={nodes.Hair07.geometry} skeleton={nodes.Hair07.skeleton} />
        </group>
    )
}
