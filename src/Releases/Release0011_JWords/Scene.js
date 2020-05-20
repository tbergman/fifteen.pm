import React, { useEffect } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from 'react-three-fiber';
import { Headspaces } from './Headspaces';
import { MaterialsProvider } from './MaterialsContext';
import Controls from './Controls';

export function Scene({ setSceneReady }) {
    const { camera, scene } = useThree();
    useEffect(() => {
        camera.position.z = 0.33
        // camera.fov = 200
        // camera.near = .00000000o
        scene.background = new THREE.Color(0x781D7F)
    })
    // useFrame(() => {
    //     console.log(camera.fov, camera)
    // })
    return (
        <>
            {/* <Controls /> */}
            <ambientLight />
            <MaterialsProvider>
                <Headspaces />
            </MaterialsProvider>
        </>
    );
}
