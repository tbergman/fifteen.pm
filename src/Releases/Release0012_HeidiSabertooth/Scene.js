
import React, { Suspense, useEffect, useState } from 'react';
import { useLoader, useResource, useFrame } from 'react-three-fiber';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { a } from '@react-spring/three';
import useYScroll from '../../Common/Scroll/useYScroll';

import * as C from './constants.js'

function _extractHairMesh(gltf, materials, materialNames) {
    let hair = {}
    gltf.scene.traverse(child => {
        if (child.name == "Hair07") {
            hair = child.clone()
        }
    })
    return hair;
}

function TheHair() {
    console.log("HAIRY")
    const [hairy] = useYScroll([-2400, 2400], { domTarget: window });
    const [hairLoaded, setHairLoaded] = useState(false);
    const [theHairMesh, setTheHairMesh] = useState();
    const theHair = useLoader(GLTFLoader, C.THE_HAIR, loader => {
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco-gltf/')
        loader.setDRACOLoader(dracoLoader)
    });


    useEffect(() => {
        if (!theHair) return
        console.log("HAIR LOADED!", theHair)
        setTheHairMesh(_extractHairMesh(theHair))
        setHairLoaded(true)
    }, [theHair])
    return (<>
        {hairLoaded &&
            <group>
                <a.group rotation-y={hairy.to(hairy => hairy / 200)} >
                    <mesh material={theHairMesh.material} position={[0, 0, 0.05]}  >
                        <bufferGeometry attach="geometry" {...theHairMesh.geometry} />
                    </mesh>
                </a.group>
            </group>
        }</>
    )
}

useFrame(() => {
    
})

export function Scene({ }) {
    return (
        <>
            <ambientLight />
            <Suspense fallback={null} >
                <TheHair />
            </Suspense>
        </>
    )
}
