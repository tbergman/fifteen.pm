// TODO the move-along-a-path code from three.js example here should be pulled and improved for re-use, it is a common thing to do
import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader, useResource, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import useAudioPlayer from '../../../Common/UI/Player/hooks/useAudioPlayer';
import { useKeyPress } from '../../../Common/Utils/hooks';
import * as C from '../constants';
import Chassis from './Chassis';
import Dashboard from './Dashboard';
import DashCam from './DashCam';
import Headlights from './Headlights';
import SteeringWheel from './SteeringWheel';
import { getCurTrajectory, updateCurTrajectory } from '../../../Common/Animations/SplineAnimator.js'
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
    const [normal, binormal] = useMemo(() => {
        return [
            new THREE.Vector3(),
            new THREE.Vector3(),
        ]
    });
    const accelerationPressed = useKeyPress('ArrowUp');
    const slowDownPressed = useKeyPress('ArrowDown');
    const rotateLeftPressed = useKeyPress('ArrowLeft');
    const rotateRightPressed = useKeyPress('ArrowRight');
    // driving units
    const offset = useRef();
    const delta = useRef();
    const speed = useRef();
    // using a filter for left and right arrow press
    const { audioStream } = useAudioPlayer();

    useEffect(() => {
        if (car) setCarReady(true)
    }, [car])


    useEffect(() => {
        if (!speed.current) speed.current = 20;
        if (!delta.current) delta.current = .005;
        if (!offset.current) offset.current = 0;
    })


    const updateSpeed = () => {
        if (accelerationPressed) {
            if (delta.current < .05 && speed.current > 1) {
                speed.current -= .1;
            }
        }
        if (slowDownPressed) {
            if (delta.current >= 0) {
                speed.current += .1;
                delta.current -= .001;
            }
            if (delta.current < 0) {
                delta.current = 0;
            }

        }
    }

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


    // TODO http://jsfiddle.net/krw8nwLn/66/
    useFrame(() => {
        updateSpeed();
        // TODO these floats as constants relative to world radius as opposed to using time
        // this value is between 0 and 1
        const t = (offset.current % speed.current) / speed.current;
        // const t = offset.current += speed.current;
        const { pos, dir } = getCurTrajectory({
            t,
            offset,
            delta,
            binormal,
            normal,
            tubeGeometry: road,
        });
        if (rotateLeftPressed) spinLeft();
        else if (rotateRightPressed) spinRight();
        else {
            if (audioStream && audioStream.filter.Q.value != 0) setDefaultAudioFilter();
            updateCurTrajectory({t, pos, dir, normal, object: car, tubeGeometry: road});
        }
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
