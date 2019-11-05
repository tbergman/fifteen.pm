import React, { useEffect, useState } from 'react';
import { FixedLights } from './lights';
import { useThree } from 'react-three-fiber';

export function Scene({ }) {
    const { scene, camera } = useThree();


    useEffect(() => {
        // camera.position.set([0, 0, 0]);     
    })

    return (
        <>
            <FixedLights />
        </>
    );
}
