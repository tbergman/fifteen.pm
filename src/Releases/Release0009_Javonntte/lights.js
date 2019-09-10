import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useResource, useRender, useThree } from 'react-three-fiber';

export function FixedLights() {
    // const { camera, scene } = useThree();
    // const [spotLightRef, spotLight] = useResource();
    // const spotLight = useRef();
    // const pointLight = useRef();
    // useRender(() => {
    //     if (spotLight.current && camera) {
    //         // spotLight.current.position.copy(camera.position)
    //         // spotLight.current.rotation.x += .1;
    //         // spotLight.current.rotation.y += .1;
    //         // spotLight.current.rotation.z += .1;
    //         // console.log(spotLight.current.rotation);
    //     }
    //     // if (spotLight.current) console.log(spotLight)
    //     // else console.log("No spotLIght detected.")
    // });
    // const tmpPointLightPos = new THREE.Vector3(0., 1.5, 50.4);
    // const tmpSpotLightPos = new THREE.Vector3(1., -.4, 55.4);
    // useEffect(() => {
    //     if (spotLight.current || pointLight.current) {
    //         // const shadowCameraHelper = new THREE.CameraHelper(spotLight.current.shadow.camera);
    //         const pointLightHelper = new THREE.PointLightHelper(pointLight.current, 1);
    //         // scene.add(shadowCameraHelper);
    //         scene.add(pointLightHelper);
    //         camera.add(pointLight);
    //         // lookAt of camera https://stackoverflow.com/questions/27957645/three-js-find-the-current-lookat-of-a-camera
    //         // const emptyObj = new THREE.Object3D();
    //         // const inFrontOfCamera = new THREE.Vector3(0, 0, -3).applyQuaternion(camera.quaternion).add(camera.position);
    //         // emptyObj.position.copy(inFrontOfCamera);
    //         // scene.add(emptyObj);
    //         // camera.add(emptyObj);
    //         // console.log("LOOKAT:", inFrontOfCamera, "SPOT:", spotLight.current);
    //         // spotLight.current.target = emptyObj;
    //     }
    // }, [pointLight])
    return <>
        <ambientLight />
        {/* <directionalLight
            intensity={1.5}
            position={camera.position}
        /> */}
        {/* <pointLight
            ref={pointLight}
            // position={tmpPointLightPos}
            intensity={1}
        /> */}
        {/* <spotLight
            ref={spotLight}
            position={camera.position}
            castShadow
            intensity={5}
            penumbra={0.01}
            distance={6}
            shadow-camera-near={10}
            shadow-camera-far={200}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
        /> */}
    </>;
}