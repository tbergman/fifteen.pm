import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { useObjectAlongTubeGeometry } from '../../Common/Animations/SplineAnimator.js'

export default function OverheadLight({ catwalk, offset, position = [0, 0, 0], color = "white", intensity = "1", moves = false }) {
    const group = useRef()
    const light = useRef();
    const { scene } = useThree();
    useEffect(() => {
        // var helper = new THREE.PointLightHelper(light.current);
        // scene.add(helper);
    })
    useFrame(() => {
        if (!moves) return;
        if (light.current.position.x < -5) light.current.position.x = 5
        light.current.position.x -= .1
    })
    useObjectAlongTubeGeometry({
        object: group.current,
        tubeGeometry: catwalk,
        offset: offset,
    })
    return <group ref={group}><pointLight
        ref={light}
        position={position}
        castShadow={true}
        intensity={intensity}
        color={color}
    />
    </group>
}
