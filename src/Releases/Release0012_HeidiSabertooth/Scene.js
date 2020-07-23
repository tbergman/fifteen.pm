import React, { useMemo, useRef, Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useThree, extend, useResource } from 'react-three-fiber';
import TheHair from './TheHair.js';
import { MaterialsProvider } from './MaterialsContext';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// extend({ OrbitControls })
import useAudioPlayer from '../../Common/UI/Player/hooks/useAudioPlayer';
import Orbit from '../../Common/Controls/Orbit';
import GuapxBoxX from './GuapxBoxX.js';
import Alien1 from './Alien1.js';
import Cat from './Cat.js';
import Heidi from './Heidi.js';
import Catwalk from './Catwalk.js';
import * as C from './constants';

export function Scene({ }) {
    const { camera, scene } = useThree();
    const { currentTrackName } = useAudioPlayer();
    const [animationName, setAnimationName] = useState()

    useEffect(() => {
        camera.position.z = 2
        camera.position.y = 2.5
        var axesHelper = new THREE.AxesHelper(105);
        scene.add(axesHelper);
    }, [])


    useEffect(() => {
        if (!currentTrackName) return
        setAnimationName(C.ANIMATION_TRACK_CROSSWALK[currentTrackName])
    }, [currentTrackName])

    return (
        <>
            <ambientLight />
            <Orbit />
            <MaterialsProvider>
                <Suspense fallback={null} >
                    <Catwalk
                        radius={1}
                    >
                        <Heidi animationName={animationName} offset={2} />
                        <GuapxBoxX animationName={animationName} offset={3} />
                        <Alien1 animationName={animationName} offset={4} />
                        <Cat animationName={animationName} offset={5} />
                    </Catwalk>
                </Suspense>
            </MaterialsProvider>
        </>
    )
}
