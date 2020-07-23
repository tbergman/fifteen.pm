import React, { useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from 'react-three-fiber';
import Headspaces from './headspaces/Headspaces';
import { MaterialsProvider } from './MaterialsContext';
import Room from './Room';
import * as C from './constants';
import { useTrackStepSequence } from '../../Common/Sequencing/TrackStepSequencing'


export function Scene({ setSceneReady }) {
    const { camera, scene } = useThree();
    const { step, stepIdx } = useTrackStepSequence({
        tracks: C.TRACKS_CONFIG,
        firstTrack: C.FIRST_TRACK,
    })

    // global scene params
    useEffect(() => {
        camera.position.z = 0.25
        scene.background = new THREE.Color(0x781D7F)
    })

    return (
        <>
            <ambientLight />
            <MaterialsProvider>
                <Room step={step} stepIdx={stepIdx} />
                <Headspaces step={step} />
            </MaterialsProvider>
        </>
    );
}
