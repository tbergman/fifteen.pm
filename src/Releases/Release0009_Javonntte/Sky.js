import React, { useContext } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from 'react-three-fiber';
import { MaterialsContext } from './MaterialsContext';

export default function Sky({ }) {
    const { sunset, facade12 } = useContext(MaterialsContext);
    const { camera } = useThree(); //tmp
    useFrame(() => {
        console.log('camer apos', camera.position);
    })
    return (
        <mesh
            material={facade12}
            onUpdate={self => console.log('box', self)}
            scale={1}
            position={0, 0, -10}
        >
            <meshBasicMaterial color="red" />
            <boxGeometry args={[5, 5, 5]} />
            {/* args={[25, 25, 25]} /> */}
        </mesh>
    )
}