import React, { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useResource } from 'react-three-fiber';

export default function TrackLight({ ...props }) {

    const [ref, light] = useResource();
    const [startPos, endPos, increment] = useMemo(() => {
        const startPos = props.startPos || -2;
        const endPos = props.endPos || 2
        
        const increment = props.incement || .05;
        return [startPos, endPos, increment];
    })

    const pos = useRef();

    useEffect(()=> {
        pos.current = startPos + (Math.abs(startPos - endPos) / 2)
    })

    useFrame(() => {
        pos.current = pos.current + increment < endPos ? pos.current + increment : startPos;
        light.position.z = pos.current;
    })
    return (
        <group ref={ref} >
            <pointLight {...props} />
        </group>
    )

}