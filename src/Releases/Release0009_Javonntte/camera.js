import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree, useResource } from 'react-three-fiber';
import { Car } from './Car';

export function Camera({ cameraRef, fov, near, far, carProps, lightProps }) {

    const { setDefaultCamera } = useThree();

    useEffect(() => {
        if (cameraRef.current) {
            setDefaultCamera(cameraRef.current);
        }
    }, [cameraRef.current]);

    return <perspectiveCamera
        ref={cameraRef}
        // fov={fov}
        // near={near}
        // far={far}
    >
        {
            cameraRef.current &&
            <Car
                curCamera={cameraRef.current}
                position={new THREE.Vector3(0, -14.5, -3)}
                lightProps={lightProps}
                {...carProps}
            />
        }
    </perspectiveCamera>

}

