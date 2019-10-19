
import React, { useRef } from 'react';

export default function Headlamps({ intensity, distance, shadowCameraNear, shadowCameraFar, shadowMapSizeWidth, shadowMapSizeHeight }) {
    const spotLight = useRef();
    return <spotLight
        ref={spotLight}
        castShadow
        intensity={intensity}
        // penumbra={lightProps.penumbra}
        distance={distance}
        shadow-camera-near={shadowCameraNear}
        shadow-camera-far={shadowCameraFar}
        shadow-mapSize-width={shadowMapSizeWidth}
        shadow-mapSize-height={shadowMapSizeHeight}
    />
}
