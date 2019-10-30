import React from 'react';

export default function Chassis({ gltf }) {
    return <group>
        <mesh name="chassis">
            <bufferGeometry attach="geometry" {...gltf.__$[10].geometry} />
            <meshBasicMaterial attach="material" color="red" />
        </mesh>
    </group>;
}