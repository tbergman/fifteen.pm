import React, { Suspense, useEffect, useState } from 'react';
import { useThree, extend, useResource } from 'react-three-fiber';
import TheHair from './TheHair.js';
import { MaterialsProvider } from './MaterialsContext';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// extend({ OrbitControls })
import Orbit from '../../Common/Controls/Orbit';
import GuapxX from './GuapxX.js';
import Alien1 from './Alien1.js';

export function Scene({ }) {
    const { camera } = useThree();
    const [alienARef, alienA] = useResource()
    const [alienBRef, alienB] = useResource()
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
                    {/* <GuapxX>
                        <TheHair />
                    </GuapxX> */}
                    {/* <GuapxX ref={alienARef} /> */}
                    <Alien1 />
                    {/* <Alien1 ref={alienARef} /> */}
                    {/* <Alien1 ref={alienBRef} position={[0, 2, 0]} /> */}

                </Suspense>
            </MaterialsProvider>
        </>
    )
}
