import React, {useContext} from 'react';
import * as THREE from 'three';
import {MaterialsContext} from './MaterialsContext';

export default function Room({ }) {
    const {tron2} = useContext(MaterialsContext);
    return (
        <mesh scale={[10, 10, 10]} position={[0, 0, 0,]} material={tron2}>
            <sphereBufferGeometry attach="geometry" />
        </mesh >
    )
}
