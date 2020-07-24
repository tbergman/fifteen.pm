import React, { useMemo, useRef, Suspense, useEffect, useContext, useState } from 'react';
import * as THREE from 'three';
import { useThree, extend, useFrame, useResource } from 'react-three-fiber';
import { MaterialsProvider, MaterialsContext } from './MaterialsContext';
import useAudioPlayer from '../../Common/UI/Player/hooks/useAudioPlayer';
import GuapxBoxX from './GuapxBoxX.js';
import Alien1 from './Alien1.js';
import Cat from './Cat.js';
import Heidi from './Heidi.js';
import Catwalk from './Catwalk.js';
import Stars from '../../Common/Utils/Stars';
import * as C from './constants';
import Flying from '../../Common/Controls/Flying';
import BlackholeSun from './BlackholeSun';
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
    }, [step])


    useEffect(() => {
        if (!currentTrackName) return
        setAnimationName(C.ANIMATION_TRACK_CROSSWALK[currentTrackName])
    }, [currentTrackName])

    return (
        <>
            {/* <ambientLight intensity={.0001} args={[0x404040, .001]} /> */}
            <Flying
                rollSpeed={Math.PI * 2}
            />
            <Stars />
            <MaterialsProvider>
                <BlackholeSun />
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
