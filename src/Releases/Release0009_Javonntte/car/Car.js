// TODO the move-along-a-path code from three.js example here should be pulled and improved for re-use, it is a common thing to do
import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader, useResource, useThree } from 'react-three-fiber';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import useAudioPlayer from '../../../Common/UI/Player/hooks/useAudioPlayer';

import * as C from '../constants';
import Chassis from './Chassis';
import Dashboard from './Dashboard';
import DashCam from './DashCam';
import Headlights from './Headlights';
import SteeringWheel from './SteeringWheel';
import { useObjectAlongTubeGeometry } from '../../../Common/Animations/SplineAnimator.js'
function Car({
    headlightsColors,
    road,
    onThemeSelect,
    setCarReady,
    useDashCam,
}) {

    const gltf = useLoader(GLTFLoader, C.CAR_URL, loader => {
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco-gltf/')
        loader.setDRACOLoader(dracoLoader)
    })
    const [carRef, car] = useResource();
    const {
        normal,
        arrowLeftPressed,
        arrowRightPressed,
    } = useObjectAlongTubeGeometry({ object: car, tubeGeometry: road })


    // using a filter for left and right arrow press
    const { audioStream } = useAudioPlayer();

    useEffect(() => {
        if (car) setCarReady(true)
    }, [car])

    const spinLeft = () => {
        car.position.y -= normal.y * 2;
        car.rotation.z -= .01;
        const freq = Math.max(1500 - car.position.y, 0);
        audioStream.filter.frequency.value = freq;
        audioStream.filter.Q.value = 11;
    }

    const spinRight = () => {
        car.position.y += normal.y * 2;
        car.rotation.z += .01;
        audioStream.filter.frequency.value = Math.max(100, Math.min(Math.abs(car.position.y), 22050));
        audioStream.filter.Q.value = 11;
    }

    const setDefaultAudioFilter = () => {
        audioStream.filter.frequency.value = 22000;
        audioStream.filter.Q.value = 0;
    }

    useFrame(() => {
        if (arrowLeftPressed) spinLeft();
        else if (arrowRightPressed) spinRight();
        else if (audioStream && audioStream.filter.Q.value != 0) setDefaultAudioFilter();
    })

    return <group ref={carRef}>
        {car &&
            <>
                <DashCam useDashCam={useDashCam} />
                <Dashboard gltf={gltf} onThemeSelect={onThemeSelect} />
                <Chassis gltf={gltf} />
                <SteeringWheel gltf={gltf} rotation={car.rotation} />
                <Headlights colors={headlightsColors} />
                {/* This pointlight makes the dash and chassis look good... */}
                {/* <pointLight
                    position={[.8, -.75, 1.5]}
                    intensity={.05}
                /> */}
            </>
        }
    </group>
}

export default Car;
