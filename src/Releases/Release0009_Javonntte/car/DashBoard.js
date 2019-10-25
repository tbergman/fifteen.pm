import React from 'react';
import useMusicPlayer from '../../../UI/Player/hooks';


export default function DashBoard({ gltf }) {
    const { playTrack } = useMusicPlayer();
    return <group>
        <mesh
            name="button_swing"
            onPointerUp={() => playTrack(0)}
        >
            <bufferGeometry attach="geometry" {...gltf.__$[1].geometry} />
            <meshStandardMaterial attach="material" {...gltf.__$[1].material} />
        </mesh>
        <mesh
            name="button_life"
            onPointerUp={() => playTrack(1)}
        >
            <bufferGeometry attach="geometry" {...gltf.__$[2].geometry} />
            <meshStandardMaterial attach="material" {...gltf.__$[2].material} />
        </mesh>
        <mesh
            name="button_dream"
            onPointerUp={() => playTrack(2)}
        >
            <bufferGeometry attach="geometry" {...gltf.__$[3].geometry} />
            <meshStandardMaterial attach="material" {...gltf.__$[3].material} />
        </mesh>
        <mesh
            name="button_natural"
            onPointerUp={() => playTrack(3)}
        >
            <bufferGeometry attach="geometry" {...gltf.__$[4].geometry} />
            <meshStandardMaterial attach="material" {...gltf.__$[4].material} />
        </mesh>
    </group>

}