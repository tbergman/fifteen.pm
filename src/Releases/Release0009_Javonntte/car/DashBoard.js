import React from 'react';
import * as C from '../constants';

export default function Dashboard({ gltf, onTrackSelect }) {
    return <group>
        <mesh
            name={C.BUTTON_SWING}
            onPointerUp={() => onTrackSelect(C.TRACK_BUTTON_LOOKUP[C.BUTTON_SWING])}
        >
            <bufferGeometry attach="geometry" {...gltf.__$[1].geometry} />
            <meshStandardMaterial attach="material" {...gltf.__$[1].material} />
        </mesh>
        <mesh
            name={C.BUTTON_LIFE}
            onPointerUp={() => onTrackSelect(C.TRACK_BUTTON_LOOKUP[C.BUTTON_LIFE])}
        >
            <bufferGeometry attach="geometry" {...gltf.__$[2].geometry} />
            <meshStandardMaterial attach="material" {...gltf.__$[2].material} />
        </mesh>
        <mesh
            name={C.BUTTON_DREAM}
            onPointerUp={() => onTrackSelect(C.TRACK_BUTTON_LOOKUP[C.BUTTON_DREAM])}
        >
            <bufferGeometry attach="geometry" {...gltf.__$[3].geometry} />
            <meshStandardMaterial attach="material" {...gltf.__$[3].material} />
        </mesh>
        <mesh
            name={C.BUTTON_NATURAL}
            onPointerUp={() => onTrackSelect(C.TRACK_BUTTON_LOOKUP[C.BUTTON_NATURAL])}
        >
            <bufferGeometry attach="geometry" {...gltf.__$[4].geometry} />
            <meshStandardMaterial attach="material" {...gltf.__$[4].material} />
        </mesh>
    </group>

}