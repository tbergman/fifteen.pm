import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useResource, useRender, useThree } from 'react-three-fiber';

export function Lights() {
    const { camera, scene } = useThree();
    // const [spotLightRef, spotLight] = useResource();
    const spotLight = useRef();
    useRender(() => {
        if (spotLight.current && camera) {
            // spotLight.current.position.copy(camera.position)
            spotLight.current.rotation.x += .1;
            spotLight.current.rotation.y += .1;
            spotLight.current.rotation.z += .1;
            // console.log(spotLight.current.rotation);
        }
        // if (spotLight.current) console.log(spotLight)
        // else console.log("No spotLIght detected.")
    });
    useEffect(() => {
        if (spotLight.current) {
            console.log("ADDING SPOTLIGHT HELPER TO SCENE")
            const shadowCameraHelper = new THREE.CameraHelper(spotLight.current.shadow.camera);
            scene.add(shadowCameraHelper);

        }

    }, [spotLight])
    // const tmpSpotLightPos = new THREE.Vector3().copy(camera.position).addScalar(1);
    const tmpSpotLightPos = new THREE.Vector3(1., -.4, 55.4);
    console.log(tmpSpotLightPos);
    return <>
        {/* <ambientLight /> */}
        {/* <directionalLight
            intensity={1.5}
            position={camera.position}
        /> */}
        <spotLight
            // onUpdate={self => self.lookAt(new THREE.Vector3(0, 2.5, 48 * 1.05 - .2))}
            ref={spotLight}
            position={tmpSpotLightPos}
            // position={camera.position}
            castShadow
            intensity={5}
            // angle={Math.PI / 4}
            penumbra={0.01}
            // decay={2}
            distance={6}
            shadow-camera-near={10}
            shadow-camera-far={200}
            // shadow-mapSize-width={1024}
            // shadow-mapSize-height={1024}
             shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
        />
    </>;
}