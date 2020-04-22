import React, { useEffect, useContext, useMemo, Suspense } from 'react';
import { useLoader, useResource } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import * as C from './constants';
import { MaterialsContext } from './MaterialsContext';

export default function Headspaces({ }) {
    const [ref, headspaces] = useResource()
    const { foamGripPurple } = useContext(MaterialsContext);
    const gltf = useLoader(GLTFLoader, C.HEADSPACE_1_PATH, loader => {
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco-gltf/')
        loader.setDRACOLoader(dracoLoader)
    })
    const geometry = useMemo(() => {
        let geometry;
        console.log("BACK AGAIN... only load me once! ")
        gltf.scene.traverse(child => {
            
            if (child.type == "Mesh") {
                console.log("MESH", child)
                geometry = child.geometry.clone();
            } else {
                console.log("OTHER", child)
            }

        })
        return geometry;
    });
    return (
        <group ref={ref}>
            {headspaces &&
                <mesh material={foamGripPurple} onUpdate={self => console.log("WTF", self)}>
                    <bufferGeometry attach="geometry" {...geometry} />
                </mesh>
            }
        </group>
    );
}
