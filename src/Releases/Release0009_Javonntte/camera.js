import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from 'react-three-fiber';

export function Camera() {
    const spotLight = useRef();
    const cameraRef = useRef();
    const { scene, setDefaultCamera } = useThree();
    
    useEffect(() => {
        if (cameraRef.current) setDefaultCamera(cameraRef.current);
    },[cameraRef])
    
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

    return <perspectiveCamera ref={cameraRef}>
        <spotLight
            ref={spotLight}
            castShadow
            intensity={.5}
            penumbra={0.01}
            distance={60}
            shadow-camera-near={10}
            shadow-camera-far={200}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
        />
    </perspectiveCamera>
}