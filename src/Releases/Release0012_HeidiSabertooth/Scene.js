import React, { useMemo, Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useThree, extend, useResource } from 'react-three-fiber';
import TheHair from './TheHair.js';
import { MaterialsProvider } from './MaterialsContext';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// extend({ OrbitControls })
import Orbit from '../../Common/Controls/Orbit';
import GuapxX from './GuapxX.js';
import Alien1 from './Alien1.js';
import Catwalk from './Catwalk.js';

export function Scene({ }) {
    const { camera, scene } = useThree();
    useEffect(() => {
        camera.position.z = 2
        camera.position.y = 2.5
        var axesHelper = new THREE.AxesHelper(105);
        scene.add(axesHelper);
    }, [])

    return (
        <>
            <ambientLight />
            <Orbit />
            <MaterialsProvider>
                <Suspense fallback={null} >
                    <Catwalk
                        radius={1}
                    >
                        <TheHair />
                        <GuapxX />
                        <Alien1 />
                    </Catwalk>
                </Suspense>
            </MaterialsProvider>
        </>
    )
}
