import React, { useMemo, useRef, Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useThree, extend, useResource } from 'react-three-fiber';
import TheHair from './TheHair.js';
import { MaterialsProvider } from './MaterialsContext';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// extend({ OrbitControls })
import useAudioPlayer from '../../Common/UI/Player/hooks/useAudioPlayer';
import Orbit from '../../Common/Controls/Orbit';
import GuapxX from './GuapxX.js';
import Alien1 from './Alien1.js';
import Cat from './Cat.js';
import Catwalk from './Catwalk.js';
import * as C from './constants';

export function Scene({ }) {
    const { camera, scene } = useThree();
    const { currentTrackName } = useAudioPlayer();
    const [animationName, setAnimationName] = useState(C.ANIMATION_TRACK_CROSSWALK[C.FIRST_TRACK])
    
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
                        <Cat animationName={animationName} />
                        {/* <TheHair /> */}
                        {/* <GuapxX offset={1.9} speed={1}/> */}
                        {/* <Alien1 /> */}
                    </Catwalk>
                </Suspense>
            </MaterialsProvider>
        </>
    )
}
