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
import OverheadLight from './OverheadLight';
import { useTrackStepSequence } from '../../Common/Sequencing/TrackStepSequencing'

export function Scene({ }) {
    const { camera, scene, clock, gl } = useThree();
    const { currentTrackName, audioPlayer } = useAudioPlayer();
    const [animationName, setAnimationName] = useState()
    const { step } = useTrackStepSequence({
        tracks: C.TRACKS_CONFIG,
        firstTrack: C.FIRST_TRACK,
    })

    const updateCamera = () => {
        camera.position.set(...C.CAMERA_POSITIONS[step.cameraPos].position)
        camera.lookAt(...C.CAMERA_POSITIONS[step.cameraPos].lookAt)
    }

    useEffect(() => updateCamera(), [step])

    useEffect(() => {
        if (!currentTrackName) return
        setAnimationName(C.ANIMATION_TRACK_CROSSWALK[currentTrackName])
    }, [currentTrackName])

    useFrame(() => {
        if (!audioPlayer) return
        console.log(audioPlayer.currentTime)
        // console.log("CAMERA:", camera.position)
    })

    const [fixedLightRef, fixedLight] = useResource();
    useEffect(() => {
        if (!fixedLight) return;
        var helper = new THREE.PointLightHelper(fixedLight);
        scene.add(helper);
    })
    return (
        <>
            {/* <Flying
                rollSpeed={Math.PI * 2}
            /> */}
            <Stars />
            <MaterialsProvider>
                <BlackholeSun />
                {/* <pointLight ref={fixedLightRef} position={[1, 2.5, 0]} color={0x900fff} intensity={50} /> */}
                <Suspense fallback={null} >
                    <Catwalk
                        radius={.6}
                        radiusSegments={2}
                        extrusionSegments={80}
                    >
                        <Heidi actionName={step.heidiActionName} animationName={animationName} offset={5} />
                        <OverheadLight offset={5} position={[.5, 0, -.5]} color={"red"} intensity={30} />
                        
                        <GuapxBoxX animationName={step.guapxboxxActionName} offset={20} />
                        <Alien1 actionName={step.alien1ActionName} animationName={animationName} offset={15} />
                        
                        <Cat animationName={animationName} offset={10} />
                        <OverheadLight offset={11} position={[.5, 0, -.5]} color={"white"} intensity={2} />

                    </Catwalk>
                </Suspense>
            </MaterialsProvider>
        </>
    )
}
