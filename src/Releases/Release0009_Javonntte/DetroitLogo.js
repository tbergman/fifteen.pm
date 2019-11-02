import React, { useContext } from 'react';
import { useFrame, useLoader, useResource, useThree } from 'react-three-fiber';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FoamGripMaterial } from '../../Utils/materials';
import * as C from './constants';
import { MaterialsContext } from './MaterialsContext';


export default function DetroitLogo({ }) {
    const gltf = useLoader(GLTFLoader, C.LOGO_URL, loader => {
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco-gltf/')
        loader.setDRACOLoader(dracoLoader)
    })
    const [logoRef, logo] = useResource();
    const { metal03 } = useContext(MaterialsContext);

    useFrame(() => {
        if (!logo) return;
        logo.rotation.x += .01;
    })

    return (
        <>
            <group ref={logoRef} position={C.LOGO_POS}>
                {logo &&
                    <mesh material={metal03}>
                        <bufferGeometry attach="geometry" {...gltf.__$[1].geometry} />
                    </mesh>
                }
            </group>
        </>
    )
}