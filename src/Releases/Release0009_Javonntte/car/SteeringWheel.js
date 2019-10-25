import React from 'react';
import { useFrame, useResource } from 'react-three-fiber';

export default function SteeringWheel({ gltf, rotation }) {
    const [wheelRef, wheel] = useResource()
    useFrame(() => {
        if (!wheel) return;
        wheel.rotation.z = rotation.z * .1;
    })
    return <group ref={wheelRef}>
        <mesh name="wheel" >
            <bufferGeometry attach="geometry" {...gltf.__$[6].geometry} />
            <meshStandardMaterial attach="material" {...gltf.__$[6].material} />
        </mesh>
        <mesh name="wheel_internal" >
            <bufferGeometry attach="geometry" {...gltf.__$[7].geometry} />
            <meshStandardMaterial attach="material" {...gltf.__$[7].material} />
        </mesh>
        <mesh name="Gloves" >
            <bufferGeometry attach="geometry" {...gltf.__$[8].geometry} />
            <meshStandardMaterial attach="material" {...gltf.__$[8].material} />
        </mesh>
        <mesh name="Tops" >
            <bufferGeometry attach="geometry" {...gltf.__$[9].geometry} />
            <meshStandardMaterial attach="material" {...gltf.__$[9].material} />
        </mesh>
    </group>
}