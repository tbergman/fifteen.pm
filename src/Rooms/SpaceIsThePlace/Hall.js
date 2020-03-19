import React, { useContext, useRef, useState, useMemo } from 'react';
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
    const { foamGripPurple, pockedStone2 } = useContext(MaterialsContext);

    const [wall, floor, ceiling] = useMemo(() => {
        let w, c, f;
        gltf.scene.traverse(child => {
            if (child.geometry) {
                child.geometry.name = child.name;
                if (child.name == "Hall_0") {
                    w = child.geometry.clone()
                }
                if (child.name == "Hall_1") {
                    f = child.geometry.clone();
                }
                if (child.name == "Hall_2") {
                    c = child.geometry.clone();
                }
            }
        })
        return [w, f, c]
    });

    return <group ref={ref}>
        <mesh material={pockedStone2}>
            <bufferGeometry attach="geometry" {...wall} />
        </mesh>
        <mesh material={foamGripPurple}>
            <bufferGeometry attach="geometry" {...floor} />
        </mesh>
        <mesh material={pockedStone2}>
            <bufferGeometry attach="geometry" {...ceiling} />
        </mesh>
    </group>

}
