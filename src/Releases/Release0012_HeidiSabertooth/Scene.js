import React, { Suspense, useEffect, useState } from 'react';
import { useThree, extend } from 'react-three-fiber';
import TheHair from './TheHair.js';
import { MaterialsProvider } from './MaterialsContext';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// extend({ OrbitControls })
import Orbit from '../../Common/Controls/Orbit';
import GuapxX from './GuapxX.js';

export function Scene({ }) {
    const { camera } = useThree();
    const [controllerOn, setControllerOn] = useState(false)
    useEffect(() => {
        camera.position.z = 2
        camera.position.y = 2.5
    }, [])
    return (
        <>
            <ambientLight />
            <Orbit />
            <MaterialsProvider>
                <Suspense fallback={null} >
                    <GuapxX>
                        <TheHair />
                    </GuapxX>
                </Suspense>
            </MaterialsProvider>
        </>
    )
}
