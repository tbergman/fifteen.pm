import React, { Suspense, useRef, useEffect } from 'react';
import { useThree, useResource, useFrame } from 'react-three-fiber';
import * as THREE from 'three';
import Orbit from '../Common/Controls/Orbit';
import { MaterialsProvider } from './MaterialsContext';
import Sphere from './Sphere';


export default function HomeScene({ }) {
    const { scene, camera, clock } = useThree();
    const light = useRef();
    useEffect(() => {
        camera.position.z = -5
        camera.castShadow = true
        scene.background = new THREE.Color("white");
    })
    useFrame(() => {
        const throb = Math.abs(Math.sin(clock.elapsedTime/100)) * 200
        light.current.intensity = throb
    })

    return (
        <>
            <MaterialsProvider>
                <Orbit autoRotate={true} />
                <pointLight ref={light} color={"purple"}/>
                <Suspense fallback={null}>
                    <Sphere radius={10} />
                </Suspense>
            </MaterialsProvider>
        </>
    )
}

