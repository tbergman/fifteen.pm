import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from 'react-three-fiber';

export function Camera({ fov, near, far, lightProps }) {
    const spotLight = useRef();
    const cameraRef = useRef();
    const { scene, setDefaultCamera } = useThree();

    useEffect(() => {
        if (cameraRef.current) setDefaultCamera(cameraRef.current);
    }, [cameraRef])

    useEffect(() => {
        if (spotLight.current) {
            // spotLight.current.target = new THREE.Vector3(0, 0, 3);
            const shadowCameraHelper = new THREE.CameraHelper(spotLight.current.shadow.camera);
            // const pointLightHelper = new THREE.PointLightHelper(pointLight.current, 1);
            scene.add(shadowCameraHelper);
            // scene.add(pointLightHelper);
            console.log(spotLight.current.position);
        }
    }, [spotLight])

    return <perspectiveCamera
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