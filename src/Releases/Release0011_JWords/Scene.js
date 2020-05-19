import React, {useEffect} from 'react';
import * as THREE from 'three';
import {useThree} from 'react-three-fiber';
import Headspaces from './Headspaces';
import { MaterialsProvider } from './MaterialsContext';
import Controls from './Controls';

export function Scene({ setSceneReady }) {
    const {camera, scene} = useThree();    
    useEffect(() => {
        camera.position.z = 0.33
        scene.background = new THREE.Color("white")
    })
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
