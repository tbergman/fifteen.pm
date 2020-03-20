import React, { useContext, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useLoader, useResource, useFrame } from 'react-three-fiber';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as C from './constants';
import { MaterialsContext } from './MaterialsContext';


export default function Hall({ }) {
    const gltf = useLoader(GLTFLoader, C.HALL_URL, loader => {
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco-gltf/')
        loader.setDRACOLoader(dracoLoader)
    })
    const [ref, room] = useResource()
    const { foamGripPurple, naiveGlass, transluscent, linedCement } = useContext(MaterialsContext);

    const [wall, ceiling, floor] = useMemo(() => {
        let w, c, f;
        gltf.scene.traverse(child => {
            if (child.geometry) {
                child.geometry.name = child.name;
                if (child.name == "Hall_0") {
                    c = child.geometry.clone()
                }
                if (child.name == "Hall_1") {
                    w = child.geometry.clone();
                }
                if (child.name == "Hall_2") {
                    f = child.geometry.clone();
                }
            }
        })
        if (!w || !f || !c) {
            console.error("Didn't find Hall geometries.")
        }
        return [w, c, f]
    });

    return <group ref={ref}>
        <mesh material={naiveGlass}>
            
            <bufferGeometry attach="geometry" {...wall} />
        </mesh>
        <mesh material={linedCement}>
            <bufferGeometry attach="geometry" {...floor} />
        </mesh>
        <mesh material={linedCement}>
            <bufferGeometry attach="geometry" {...ceiling} />
        </mesh>
    </group>

}
