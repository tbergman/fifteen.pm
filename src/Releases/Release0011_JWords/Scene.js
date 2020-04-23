import React from 'react';
import Headspaces from './Headspaces';
import { MaterialsProvider } from './MaterialsContext';
import Controls from './Controls';

export function Scene({ setSceneReady }) {
    return (
        <>
            <Controls />
            <ambientLight />
            <MaterialsProvider>
                <Headspaces />
            </MaterialsProvider>
        </>
    );
}
