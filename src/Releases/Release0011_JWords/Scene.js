import React, { useEffect } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from 'react-three-fiber';
import { Headspaces } from './Headspaces';
import { MaterialsProvider } from './MaterialsContext';
import Controls from './Controls';
import Room from './Room';

export function Scene({ setSceneReady }) {
    const { camera, scene } = useThree();
    useEffect(() => {
        camera.position.z = 0.25
        // camera.fov = 200
        // camera.near = .000000001
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
                <Room />
                <Headspaces />
            </MaterialsProvider>
        </>
    );
}
