/*
auto-generated with modifications by: https://github.com/react-spring/gltfjsx
*/
import * as C from './constants.js'
import * as THREE from 'three'
import React, { useContext, useRef, useState, useEffect } from 'react'
import { useLoader, useFrame } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { draco } from 'drei'
import { MaterialsContext } from './MaterialsContext';

export default function TheHair(props) {
    const group = useRef()
    const { nodes, materials, animations } = useLoader(GLTFLoader, C.THE_HAIR, draco('/draco-gltf/'))
    const { polishedSpeckledMarbleTop } = useContext(MaterialsContext);
    const actions = useRef()
    const [mixer] = useState(() => new THREE.AnimationMixer())
    useFrame((state, delta) => mixer.update(delta))
    useEffect(() => {
        actions.current = {
            Action: mixer.clipAction(animations[0], group.current),
        }
        console.log("HAIR LOADED")
        return () => animations.forEach((clip) => mixer.uncacheClip(clip))

    }, [])
    useEffect(() => void mixer.clipAction(animations[0], group.current).play(), [])
    useFrame(() => {
        if (!group.current) return;
        console.log(group.current.position)
        //     // group.current.position.set(props.position)
        //     group.current.position.z = 0
        //     group.current.position.y = 0
        //     group.current.position.z = 0
        //     // console.log("hair position", group.current.position)
        //     // console.log("incoming prop position", props.position)
    })
    return (
        <group ref={group} {...props} dispose={null}>
            <primitive object={nodes.Bone} />
            <primitive object={nodes.BottomIKBone} />
            <primitive object={nodes.MiddleIKBone} />
            <skinnedMesh material={polishedSpeckledMarbleTop} geometry={nodes.Hair07.geometry} skeleton={nodes.Hair07.skeleton} />
        </group>
    )
}
