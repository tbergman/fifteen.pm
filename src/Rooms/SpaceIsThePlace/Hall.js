
// TODO the move-along-a-path code from three.js example here should be pulled and improved for re-use, it is a common thing to do
import React, { useContext, useRef, useState, useMemo } from 'react';
import { useLoader, useResource, useFrame } from 'react-three-fiber';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as C from './constants';
import { MaterialsContext } from './MaterialsContext';


export default function Hall({ }) {
    const gltf = useLoader(GLTFLoader, C.HALL_URL, loader => {
        console.log("LOADING HALL_URL", C.HALL_URL)
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco-gltf/')
        loader.setDRACOLoader(dracoLoader)
    })
    const [ref, room] = useResource()
    const { foamGripPurple } = useContext(MaterialsContext);
    const geometry = useMemo(() => {
        let g
        gltf.scene.traverse(child => {
            if (child.name == "Hall") {
                child.geometry.name = child.name;
                g = child.geometry.clone();
            }
        })
        return g
    });

    return <group ref={ref}>
        <mesh material={foamGripPurple}>
            <bufferGeometry attach="geometry" {...geometry} />
        </mesh>
    </group>

}
