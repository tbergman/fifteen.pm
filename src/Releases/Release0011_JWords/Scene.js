import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from 'react-three-fiber';
import useAudioPlayer from '../../Common/UI/Player/hooks/useAudioPlayer';
import Headspaces from './headspaces/Headspaces';
import { MaterialsProvider } from './MaterialsContext';
import Controls from './Controls';
import Room from './Room';
import * as C from './constants';

export function Scene({ setSceneReady }) {
    const { camera, scene } = useThree();
    const [step, setStep] = useState(C.TRACKS_CONFIG[C.FIRST_TRACK].steps[0]);
    const [stepIdx, setStepIdx] = useState(0);
    const [numSteps, setNumSteps] = useState(C.TRACKS_CONFIG[C.FIRST_TRACK].steps.length)

    const { currentTrackName, currentTime, audioPlayer } = useAudioPlayer();

    // global scene params
    useEffect(() => {
        camera.position.z = 0.25
        scene.background = new THREE.Color(0x781D7F)
    })

    // reset step info per track
    useEffect(() => {
        if (!currentTrackName) return;
        setNumSteps(C.TRACKS_CONFIG[currentTrackName].steps.length);
        setStepIdx(0);
    }, [currentTrackName])

    // set current step
    useEffect(() => {
        if (!currentTrackName) return;
        setStep(C.TRACKS_CONFIG[currentTrackName].steps[stepIdx]);
    }, [stepIdx])

    // manage step advancement with nextStepidx
    useFrame(() => {
        if (!currentTrackName) return;
        if (stepIdx + 1 == numSteps) return;
        const nextStepIdx = stepIdx + 1;
        const nextStepTime = C.TRACKS_CONFIG[currentTrackName].steps[nextStepIdx].time
        if (audioPlayer.currentTime > nextStepTime) {
            setStepIdx(nextStepIdx)
        }
    });

    return (
        <>
            {/* <Controls /> */}
            <ambientLight />
            <MaterialsProvider>
                <Room step={step} stepIdx={stepIdx} />
                <Headspaces stepIdx={stepIdx} />
            </MaterialsProvider>
        </>
    );
}
