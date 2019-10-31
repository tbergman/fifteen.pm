import React, { useMemo } from 'react';
import { useFrame, useResource } from 'react-three-fiber';
import * as C from '../constants';
import { TronMaterial } from '../../../Utils/materials';

export default function SteeringWheel({ gltf, rotation }) {
    const [wheelRef, wheel] = useResource()
    const [tronMaterialRef, tronMaterial] = useResource();

    const wheelParts = useMemo(() => {
        return gltf.__$.filter(elt => C.STEERING_WHEEL_PARTS.includes(elt.name))
    })


    useFrame(() => {
        if (!wheel) return;
        wheel.rotation.z = rotation.z * .1;
    })
    return <group ref={wheelRef}>
        <TronMaterial materialRef = {tronMaterialRef} bpm={C.TRACK_METADATA} />
        {wheelParts.map((wheelPart, index) => {
            return <mesh key={index} name={wheelPart.name} >
                <bufferGeometry attach="geometry" {...wheelPart.geometry} />
                <meshStandardMaterial attach="material" />
            </mesh>
        })}
    </group>
}