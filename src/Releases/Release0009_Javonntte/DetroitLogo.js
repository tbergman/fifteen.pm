import React from 'react';
import { useFrame, useLoader, useResource, useThree } from 'react-three-fiber';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FoamGripMaterial } from '../../Utils/materials';
import * as C from './constants';


export default function DetroitLogo({ }) {
    const gltf = useLoader(GLTFLoader, C.LOGO_URL, loader => {
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco-gltf/')
        loader.setDRACOLoader(dracoLoader)
    })
    const [logoRef, logo] = useResource();
    const [foamGripRef, foamGrip] = useResource();
    
    useFrame(() => {
        if (!logo) return;
        logo.rotation.x += .01;
    })

    return (
        <>
         <FoamGripMaterial materialRef={foamGripRef} />
        <group ref={logoRef} position={C.LOGO_POS}>
            {logo && foamGrip &&
                <mesh onUpdate={console.log(logo) } material={foamGrip}>
                    <bufferGeometry attach="geometry" {...gltf.__$[1].geometry} />
                </mesh>
            }
        </group>
        </>
    )
}