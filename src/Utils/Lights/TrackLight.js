import React, { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useResource, useThree } from 'react-three-fiber';
import * as TWEEN from "three-tween";

export default function TrackLight({ ...props }) {
    const position = props.position || [0, 0, 0];
    const numSteps = props.numSteps || 50;
    const start = props.start || { x: 0, z: 0 }
    const end = props.end || { x: 1, z: 1 }
    const interval = props.interval || 0.003;
    const useHelper = props.useHelper || false;
    const [ref, light] = useResource();
    let radians = 0;
    const { scene, clock } = useThree();
    useEffect(() => {
        if (!light || !useHelper) return;
        var pointLightHelper = new THREE.PointLightHelper(light, 1, "red");
        scene.add(pointLightHelper);
    }, [light])

    const path = useMemo(() => {
        let pathVertices = [
            new THREE.Vector3(...start),
            new THREE.Vector3(...end)
        ];
        const path = new THREE.CatmullRomCurve3(pathVertices);
        path.arcLengthDivisions = numSteps
        return path;
    });

    useFrame(() => {
        if (!light) return;
        radians += interval;
        let pos = path.getPoint(radians);
        light.position.set(pos.x, pos.y, pos.z);
    });

    return (
        <group ref={ref} >
            <pointLight {...props} />
        </group>
    )

}