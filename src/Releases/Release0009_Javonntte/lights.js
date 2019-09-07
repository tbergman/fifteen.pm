import React from 'react';

import { useResource, useRender, useThree } from 'react-three-fiber';

export function Lights() {
    const [spotLightRef, spotlight] = useResource();
    const { camera } = useThree();
    useRender(() => {
    });
    return <>
        <ambientLight />
        <directionalLight intensity={1.5} position={camera.position} /> */}
        <spotLight
            ref={spotLightRef}
            castShadow
            intensity={2}
            position={camera.position}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
        />
    </>;
}