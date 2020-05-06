import React, {useEffect} from 'react';
import {useThree} from 'react-three-fiber';
import Headspaces from './Headspaces';
import { MaterialsProvider } from './MaterialsContext';
import Controls from './Controls';

export function Scene({ setSceneReady }) {
    const {camera} = useThree();    
    useEffect(() => {
        camera.position.z = 0.33
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
