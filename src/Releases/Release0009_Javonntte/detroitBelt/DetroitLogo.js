import React, { useContext, useMemo } from 'react';
import { useFrame, useLoader, useResource, useThree } from 'react-three-fiber';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as C from '../constants';
import { MaterialsContext } from '../MaterialsContext';

export default function DetroitLogo({ }) {
    const gltf = useLoader(GLTFLoader, C.LOGO_URL, loader => {
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco-gltf/')
        loader.setDRACOLoader(dracoLoader)
    })
    const [logoRef, logo] = useResource();
    const { foamGripPurple } = useContext(MaterialsContext);

    useFrame(() => {
        if (!logo) return;
        logo.rotation.y += .01;
    })

    return (
        <>
            <mesh ref={logoRef} material={foamGripPurple} position={[0, 0, -5]} >
                <bufferGeometry attach="geometry" {...gltf.__$[1].geometry} />
            </mesh>
        </>
    )
}
