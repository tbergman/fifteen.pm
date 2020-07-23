import React, { useMemo, useRef, Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useThree, extend, useFrame, useResource } from 'react-three-fiber';
import { MaterialsProvider } from './MaterialsContext';
import useAudioPlayer from '../../Common/UI/Player/hooks/useAudioPlayer';
import GuapxBoxX from './GuapxBoxX.js';
import Alien1 from './Alien1.js';
import Cat from './Cat.js';
import Heidi from './Heidi.js';
import Catwalk from './Catwalk.js';
import Stars from '../../Common/Utils/Stars';
import * as C from './constants';
import Flying from '../../Common/Controls/Flying';
import { useTrackStepSequence } from '../../Common/Sequencing/TrackStepSequencing'

export function Scene({ }) {
    const { camera, scene, clock, gl } = useThree();
    const { currentTrackName } = useAudioPlayer();
    const [animationName, setAnimationName] = useState()
    const { step, stepIdx } = useTrackStepSequence({
        tracks: C.TRACKS_CONFIG,
        firstTrack: C.FIRST_TRACK,
    })

    useEffect(() => {
        camera.position.set(...C.CAMERA_POSITIONS[C.FIRST_CAMERA_POSITION].position)
        camera.lookAt(...C.CAMERA_POSITIONS[C.FIRST_CAMERA_POSITION].lookAt)
    }, [])


    useEffect(() => {
        camera.position.set(...C.CAMERA_POSITIONS[step.cameraPos].position)
        camera.lookAt(...C.CAMERA_POSITIONS[step.cameraPos].lookAt)
    }, [step, stepIdx])

    // useFrame(() => console.log(camera.position))
    // useFrame(() => {
    //     if (clock.elapsedTime.toFixed(2) % 2 == 0) {
    //         const randIdx = THREE.Math.randInt(0, Object.keys(C.CAMERA_POSITIONS).length - 1)
    //         const randKey = Object.keys(C.CAMERA_POSITIONS)[randIdx]
    //         camera.position.set(...C.CAMERA_POSITIONS[randKey].position)
    //         camera.lookAt(...C.CAMERA_POSITIONS[C.FIRST_CAMERA_POSITION].lookAt)
    //     }
    // })

    useEffect(() => {
        if (!currentTrackName) return
        setAnimationName(C.ANIMATION_TRACK_CROSSWALK[currentTrackName])
    }, [currentTrackName])

    return (
        <>
            <ambientLight />
            <Flying />
            <Stars />
            <MaterialsProvider>
                <Suspense fallback={null} >
                    <Catwalk
                        radius={.6}
                        radiusSegments={2}
                        extrusionSegments={40}
                    >
                        <Heidi animationName={animationName} offset={5} />
                        <GuapxBoxX animationName={animationName} offset={10} />
                        <Alien1 animationName={animationName} offset={15} />
                        <Cat animationName={animationName} offset={20} />
                    </Catwalk>
                </Suspense>
            </MaterialsProvider>
        </>
    )
}
