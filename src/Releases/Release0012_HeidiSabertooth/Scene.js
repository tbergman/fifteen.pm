import React, { useMemo, useRef, Suspense, useEffect, useContext, useState } from 'react';
import * as THREE from 'three';
import { useThree, extend, useFrame, useResource } from 'react-three-fiber';
import { MaterialsProvider, MaterialsContext } from './MaterialsContext';
import useAudioPlayer from '../../Common/UI/Player/hooks/useAudioPlayer';
import GuapxBoxX from './interstellarBeings/GuapxBoxX.js';
import Alien1 from './interstellarBeings/Alien1.js';
import Cat from './interstellarBeings/Cat.js';
import Heidi from './interstellarBeings/Heidi.js';
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
    const { step, stepIdx, prevStep } = useTrackStepSequence({
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
    // init camera pos
    useEffect(() => {
        const firstStep = C.TRACKS_CONFIG[C.FIRST_TRACK].steps[0]
        camera.position.set(...C.CAMERA_POSITIONS[firstStep.cameraPos].position)
    }, [])
    useEffect(() => {
        updateBackGround()
        if (prevStep && prevStep.cameraPos != step.cameraPos) updateCamera()
    }, [step])
    useEffect(() => {
        if (!currentTrackName) return
        setAnimationName(C.ANIMATION_TRACK_CROSSWALK[currentTrackName])
    }, [currentTrackName])
    
    const middleTopLight = useRef();
    const topRightLight = useRef();
    const topLeftLight = useRef();
    // useEffect(() => {
    //     if (!topRightLight.current) return;
    //     const helper = new THREE.PointLightHelper(topRightLight.current)
    //     scene.add(helper)
    // }, [topRightLight.current])
    // useEffect(() => {
    //     if (!topLeftLight.current) return;
    //     const helper = new THREE.PointLightHelper(topLeftLight.current)
    //     scene.add(helper)
    // }, [topLeftLight.current])
    // useEffect(() => {
    //     if (!middleTopLight.current) return;
    //     const helper = new THREE.PointLightHelper(middleTopLight.current)
    //     scene.add(helper)
    // }, [middleTopLight.current])
    return (
        <>
            <Orbit
                autoRotate={step.autoRotate}
                autoRotateSpeed={step.autoRotateSpeed ? step.autoRotateSpeed : 2.0}
            />
            <Stars />
            <MaterialsProvider>
                <BlackholeSun />
                <pointLight ref={topRightLight} position={[4.5, 2.5, 0]} color={"green"} intensity={5} />
                <pointLight ref={middleTopLight} position={[0, 2.1, 0]} color={"red"} intensity={15} />
                <pointLight ref={topLeftLight} position={[-4.5, 2.1, 0]} color={"purple"} intensity={15} />
                <Suspense fallback={null} >
                    <Catwalk
                        radius={.6}
                        radiusSegments={2}
                        extrusionSegments={80}
                    >
                        <Heidi actionName={step.heidiActionName} animationName={animationName} offset={5} animationTimeScale={step.heidiTimeScale} />
                        {/* <MovingLight offset={5} position={[.5, 0, -.5]} color={"green"} intensity={10} /> */}

                        <GuapxBoxX animationName={step.guapxboxxActionName} offset={20} animationTimeScale={step.guapxboxxTimeScale} />
                        <Alien1 actionName={step.alien1ActionName} animationName={animationName} offset={15} />

                        <Cat animationName={animationName} offset={10} />


                    </Catwalk>
                </Suspense>
            </MaterialsProvider>
        </>
    )
}
