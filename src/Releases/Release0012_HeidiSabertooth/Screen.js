import React, { useMemo, useRef, Suspense, useEffect, useContext, useState } from 'react';
import * as THREE from 'three';
import { useThree, extend, useFrame, useResource } from 'react-three-fiber';
import { MaterialsContext } from './MaterialsContext';


export default function Screen({ position = [-8, 2, 0], width = 500, height = 500, rotation = [0, THREE.Math.degToRad(90), 0] }) {
    const { tron, sunflare } = useContext(MaterialsContext);


    return <group>
        <mesh material={sunflare} position={position} rotation={rotation} >
            <planeBufferGeometry attach="geometry" args={[width, height]} />
        </mesh>
    </group>

}
