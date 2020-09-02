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
import MovingLight from './OverheadLight';
import { useTrackStepSequence } from '../../Common/Sequencing/TrackStepSequencing'
import Orbit from '../../Common/Controls/Orbit';

export function Scene({ }) {
    const { camera, scene, clock, gl } = useThree();
    const { currentTrackName, audioPlayer } = useAudioPlayer();
    const [animationName, setAnimationName] = useState()
    const { step, prevStep } = useTrackStepSequence({
        tracks: C.TRACKS_CONFIG,
        firstTrack: C.FIRST_TRACK,
    })
    const updateBackGround = () => {
        scene.background = step.bgColor ? step.bgColor : new THREE.Color("black")
    }
    const updateCamera = () => {
        camera.position.set(...C.CAMERA_POSITIONS[step.cameraPos].position)
        camera.lookAt(...C.CAMERA_POSITIONS[step.cameraPos].lookAt)
    }
    useEffect(() => {
        updateBackGround()
        if (!step.cameraPos){
            updateCamera()
        }
        
    }, [step])
    useEffect(() => {
        if (!currentTrackName) return
        setAnimationName(C.ANIMATION_TRACK_CROSSWALK[currentTrackName])
    }, [currentTrackName])
    return (
        <>
            <Orbit
                autoRotate={step.autoRotate}
                autoRotateSpeed={step.autoRotateSpeed ? step.autoRotateSpeed : 2.0}
            />
            <Stars />
            <MaterialsProvider>
                <BlackholeSun />
                <pointLight position={[1, 2.5, 0]} color={0x900fff} intensity={50} />
                <Suspense fallback={null} >
                    <Catwalk
                        radius={.6}
                        radiusSegments={2}
                        extrusionSegments={80}
                    >
                        <Heidi actionName={step.heidiActionName} animationName={animationName} offset={5} animationTimeScale={step.heidiTimeScale}/>
                        <MovingLight offset={5} position={[.5, 0, -.5]} color={"red"} intensity={30} />

                        <GuapxBoxX animationName={step.guapxboxxActionName} offset={20} animationTimeScale={step.guapxboxxTimeScale} />
                        <Alien1 actionName={step.alien1ActionName} animationName={animationName} offset={15} />

                        <Cat animationName={animationName} offset={10} />
                        <MovingLight offset={11} position={[.5, 0, -.5]} color={"white"} intensity={2} />

                    </Catwalk>
                </Suspense>
            </MaterialsProvider>
        </>
    )
}
