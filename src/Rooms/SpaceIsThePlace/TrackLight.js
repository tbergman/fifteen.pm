import React, { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useResource } from 'react-three-fiber';
import * as TWEEN from "three-tween";

export default function TrackLight({ ...props }) {

    const [ref, light] = useResource();
    const [startPos, endPos, increment] = useMemo(() => {
        const startPos = props.startPos || -2;
        const endPos = props.endPos || 2

        const increment = props.incement || .05;
        return [startPos, endPos, increment];
    })

    const pos = useRef();

    useEffect(() => {
        const duration = 5000;
        const timer = setInterval(() => {
            new TWEEN.Tween(light).to({
                angle: (Math.random() * 0.7) + 0.1,
                penumbra: Math.random() + 1
            }, duration * 10)
                .easing(TWEEN.Easing.Quadratic.InOut).start();
            new TWEEN.Tween(light.position).to({
                x: Math.random() * 5,
                y: light.position.y,
                z: Math.random() * 15,
            }, duration)
                .easing(TWEEN.Easing.Quadratic.Out).start();
            // }
        }, 1000);
        return () => clearTimeout(timer);
    }, [light]);

    useFrame(() => TWEEN.update());

    return (
        <group ref={ref} >
            <pointLight {...props} />
        </group>
    )

}