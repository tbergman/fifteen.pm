import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader, useResource, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useKeyPress } from '../../../Utils/hooks';
import { Metal03Material, TronMaterial } from '../../../Utils/materials';
import * as C from '../constants';
import DashBoard from './DashBoard';
import DashCam from './DashCam';
import SteeringWheel from './SteeringWheel';

function Car({
    dashCamRef,
    road,
    roadOffset,
}) {
    const [tronMaterialRef, tronMaterial] = useResource();
    const [metal03MaterialRef, metal03Material] = useResource();
    const gltf = useLoader(GLTFLoader, C.CAR_URL, loader => {
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco-gltf/')
        loader.setDRACOLoader(dracoLoader)
    })
    const { size, viewport, clock, setDefaultCamera } = useThree();
    const [carRef, car] = useResource();
    const [normal, binormal, up] = useMemo(() => {
        return [
            new THREE.Vector3(),
            new THREE.Vector3(),
            new THREE.Vector3(0, 2, 2), // TODO these is supposed to be normalized to 1 and have only 1 non zero value lol  
        ]
    });
    const accelerationPressed = useKeyPress('ArrowUp');
    const slowDownPressed = useKeyPress('ArrowDown');
    // driving units
    const offset = useRef();
    const delta = useRef();
    const speed = useRef();

    useEffect(() => {
        if (!speed.current) {
            speed.current = 20;
        }
        if (!delta.current) {
            delta.current = .01;
        }
        if (!offset.current) {
            offset.current = 0;
        }
    })

    // TODO http://jsfiddle.net/krw8nwLn/66/
    useFrame(() => {
        // TODO these floats as constants?
        if (accelerationPressed) {
            if (delta.current < .05 && speed.current > 5) {
                console.log(speed.current)
                speed.current -= .1;
                // delta.current += .001;
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
        offset.current += delta.current;
        const t = (offset.current % speed.current) / speed.current;
        const pos = road.parameters.path.getPointAt(t);
        // interpolation
        const segments = road.tangents.length;
        const pickt = t * segments;
        const pick = Math.floor(pickt);
        const pickNext = (pick + 1) % segments;
        binormal.subVectors(road.binormals[pickNext], road.binormals[pick]);
        binormal.multiplyScalar(pickt - pick).add(road.binormals[pick]).add(up);
        const dir = road.parameters.path.getTangentAt(t);
        normal.copy(binormal).cross(dir)
        // We move on a offset on its binormal
        pos.add(normal.clone().multiplyScalar(roadOffset));
        car.position.copy(pos);
        // Using arclength for stablization in look ahead.
        const lookAt = road.parameters.path.getPointAt((t + 30 / road.parameters.path.getLength()) % 1);
        // Camera Orientation 2 - up orientation via normal
        lookAt.copy(pos).add(dir);
        car.matrix.lookAt(car.position, lookAt, normal);
        car.rotation.setFromRotationMatrix(car.matrix);
        car.rotation.z += Math.PI / 12; // TODO added code - can it be baked into matrix rotation?
    })


    // TODO render order to make sure the car's always in front https://discourse.threejs.org/t/always-render-mesh-on-top-of-another/120/5
    return <group ref={carRef}>
        <TronMaterial materialRef={tronMaterialRef} bpm={120} />
        <Metal03Material materialRef={metal03MaterialRef} />
        {tronMaterial &&
            <mesh name="speedometer" material={tronMaterial}>
                <bufferGeometry attach="geometry" {...gltf.__$[5].geometry} />
            </mesh>
        }
        {car &&
            <>
                <DashCam />
                <DashBoard gltf={gltf} />
                <SteeringWheel gltf={gltf} rotation={car.rotation} />
            </>
        }
    </group>
}

export default Car;