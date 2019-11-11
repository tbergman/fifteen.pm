import React, { useContext } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from 'react-three-fiber';
import { MaterialsContext } from './MaterialsContext';

export default function Sky({ height, width, scale}) {
    const { sunset } = useContext(MaterialsContext);
    const { camera } = useThree(); //tmp
    return (
        <mesh material={sunset} scale={[scale,scale,scale]}>
            <sphereBufferGeometry attach="geometry" args={[1, 50, 50]} />
        </mesh>
    )
}