import React, { useMemo, useRef, Suspense, useEffect, useContext, useState } from 'react';
import * as THREE from 'three';
import { useThree, extend, useFrame, useResource } from 'react-three-fiber';
import { MaterialsContext } from './MaterialsContext';

// old position  [-150, 200, 0] old rotation [0, THREE.Math.degToRad(55), 0]
export default function BlackholeSun({ position =[0,0,0], rotation = [0, THREE.Math.degToRad(-90), 0] }) {
    const { tron, sunflare } = useContext(MaterialsContext);


    return <group>
        <mesh material={sunflare} position={position} rotation={rotation}  >
            <sphereBufferGeometry attach="geometry" args={[6, 32, 32]} />
        </mesh>
    </group>

}
