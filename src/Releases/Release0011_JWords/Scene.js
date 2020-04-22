import React from 'react';
import Headspaces from './Headspaces';
import { MaterialsProvider } from './MaterialsContext';

export function Scene({ setSceneReady }) {

    
    return (
        <>
            <ambientLight intensity={10} />
            <MaterialsProvider>
                <Headspaces />
            </MaterialsProvider>
        </>
    );
}
