import React, { useMemo } from 'react';
import { useFrame, useResource } from 'react-three-fiber';
import * as C from '../constants';

export default function SteeringWheel({ gltf, rotation }) {
    const [wheelRef, wheel] = useResource()
    const wheelParts = useMemo(() => {
        return gltf.__$.filter(elt => C.STEERING_WHEEL_PARTS.includes(elt.name))
    })

    useFrame(() => {
        if (!wheel) return;
        wheel.rotation.z = rotation.z * .1;
    })
    return <group ref={wheelRef}>
        {wheelParts.map((wheelPart, index) => {
            return <mesh key={index} name={wheelPart.name} >
                <bufferGeometry attach="geometry" {...wheelPart.geometry} />
                <meshStandardMaterial attach="material" />
            </mesh>
        })}
    </group>
}