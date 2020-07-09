import React, { Suspense, useEffect, useState } from 'react';
import {useThree} from 'react-three-fiber';
import TheHair from './TheHair.js';


export function Scene({ }) {
    const { camera } = useThree();
    useEffect(() => {
        camera.position.z = 1
        camera.position.y = 1.5
    }, [])
    return (
        <>
            <ambientLight />
            <Suspense fallback={null} >
                <TheHair />
            </Suspense>
        </>
    )
}
