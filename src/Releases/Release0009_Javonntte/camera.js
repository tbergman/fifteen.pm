import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from 'react-three-fiber';

export function Camera({ fov, near, far, lightProps }) {
    const spotLight = useRef();
    const cameraRef = useRef();
    const { setDefaultCamera, size, scene } = useThree();

    useEffect(() => {
        if (cameraRef.current) {
            setDefaultCamera(cameraRef.current);
            cameraRef.current.setViewOffset(size.width + 5, size.height + 5, 0, 0, size.width + 5, size.height + 5)
        }
    }, [cameraRef])

    // useEffect(() => {
    //     if (spotLight.current) {
    //         // spotLight.current.target = new THREE.Vector3(0, 0, 3);
    //         // const shadowCameraHelper = new THREE.CameraHelper(spotLight.current.shadow.camera);
    //         // scene.add(shadowCameraHelper);
    //     }
    // }, [spotLight])

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
        <spotLight
            ref={spotLight}
            castShadow
            intensity={lightProps.intensity}
            penumbra={lightProps.penumbra}
            distance={lightProps.distance}
            shadow-camera-near={lightProps.shadowCameraNear}
            shadow-camera-far={lightProps.shadowCameraFar}
            shadow-mapSize-width={lightProps.shadowMapSizeWidth}
            shadow-mapSize-height={lightProps.shadowMapSizeHeight}
        />
    </perspectiveCamera>
}