import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader, useResource, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import useAudioPlayer from '../../../UI/Player/hooks/useAudioPlayer';
import { useKeyPress } from '../../../Utils/hooks';
import * as C from '../constants';
import Chassis from './Chassis';
import Dashboard from './Dashboard';
import DashCam from './DashCam';
import Headlights from './Headlights';
import SteeringWheel from './SteeringWheel';

function Car({
    headlightsColor,
    road,
    onThemeSelect,
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

    function getCurTrajectory(t) {
        const pos = road.parameters.path.getPointAt(t);
        offset.current += delta.current;
        // interpolation
        const segments = road.tangents.length;
        const pickt = t * segments;
        const pick = Math.floor(pickt);
        const pickNext = (pick + 1) % segments;
        binormal.subVectors(road.binormals[pickNext], road.binormals[pick]);
        binormal.multiplyScalar(pickt - pick).add(road.binormals[pick]);//.add(up);
        const dir = road.parameters.path.getTangentAt(t);
        normal.copy(binormal); // most examples have .cross(dir) here but this will rotate the normal to the 'side' of the orientation we want to achieve 
        // We move on a offset on its binormal
        pos.add(normal.clone());
        return [pos, dir];
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
        audioStream.filter.frequency.value = Math.min(Math.abs(car.position.y), 22050);
        audioStream.filter.Q.value = 11;
    }

    const setDefaultAudioFilter = () => {
        audioStream.filter.frequency.value = 22000;
        audioStream.filter.Q.value = 0;
    }

    const updateCurTrajectory = (t, pos, dir) => {
        car.position.copy(pos);
        // Using arclength for stablization in look ahead.
        const lookAt = road.parameters.path.getPointAt((t + 30 / road.parameters.path.getLength()) % 1);
        // Camera Orientation 2 - up orientation via normal
        lookAt.copy(pos).add(dir);
        car.matrix.lookAt(car.position, lookAt, normal);
        car.rotation.setFromRotationMatrix(car.matrix);
        // car.rotation.z += Math.PI / 12; // TODO added code - can it be baked into matrix rotation?
    }

    // TODO http://jsfiddle.net/krw8nwLn/66/
    useFrame(() => {
        updateSpeed();
        // TODO these floats as constants relative to world radius
        const t = (offset.current % speed.current) / speed.current;
        const [pos, dir] = getCurTrajectory(t);
        if (rotateLeftPressed) spinLeft();
        else if (rotateRightPressed) spinRight();
        else {
            if (audioStream) setDefaultAudioFilter();
            updateCurTrajectory(t, pos, dir);
        }
    })

    return <group ref={carRef}>
        {car &&
            <>
                <DashCam />
                <Dashboard gltf={gltf} onThemeSelect={onThemeSelect} />
                <Chassis gltf={gltf} />
                <SteeringWheel gltf={gltf} rotation={car.rotation} />
                <Headlights color={headlightsColor} />
                {/* This pointlight makes the dash and chassis look good... */}
                <pointLight
                    position={[.8, -.75, 1.5]}
                    intensity={.05}
                />
            </>
        }
    </group>
}

export default Car;