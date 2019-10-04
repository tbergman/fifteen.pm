import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from 'react-three-fiber';

export function Camera({ fov, near, far, lightProps }) {
    const spotLight = useRef();
    const cameraRef = useRef();
    const { setDefaultCamera, scene } = useThree();

    useEffect(() => {
        if (cameraRef.current) {
            setDefaultCamera(cameraRef.current);
        }
    }, [cameraRef])

    return <perspectiveCamera
        onUpdate={self => {
            var helper = new THREE.CameraHelper(self);
            scene.add(helper);
        }}
        ref={cameraRef}
        fov={fov}
        near={near}
        far={far}
    >
        <pointLight
        onUpdate={self => self.lookAt(new THREE.Vector3(0, 0, 1))}
            ref={spotLight}
            castShadow
            position={new THREE.Vector3(0, 0, 0)}
            intensity={lightProps.intensity}
            // penumbra={lightProps.penumbra}
            distance={lightProps.distance}
            shadow-camera-near={lightProps.shadowCameraNear}
            shadow-camera-far={lightProps.shadowCameraFar}
            shadow-mapSize-width={lightProps.shadowMapSizeWidth}
            shadow-mapSize-height={lightProps.shadowMapSizeHeight}
        />
    </perspectiveCamera>
}