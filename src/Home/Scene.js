import React, { Suspense, useEffect } from 'react';
import { useThree } from 'react-three-fiber';
import * as THREE from 'three';
import Orbit from '../Common/Controls/Orbit';
import { MaterialsProvider } from './MaterialsContext';
import SinGlowSphere from './SinGlowSphere';


export default function HomeScene({ }) {
    const { scene, camera } = useThree();

    useEffect(() => {
        camera.position.z = -5
        camera.castShadow = true
        scene.background = new THREE.Color("white");
    })

    return (
        <>
            <MaterialsProvider>
                <Orbit autoRotate={true} minDistance={1} />
                <Suspense fallback={null}>
                    <SinGlowSphere radius={10} />
                </Suspense>
            </MaterialsProvider>
        </>
    )
}

