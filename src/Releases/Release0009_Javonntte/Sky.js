import React, { useContext, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from 'react-three-fiber';
import { MaterialsContext } from './MaterialsContext';

export default function Sky({ theme, scale }) {
    const { sunset, night, hell, day } = useContext(MaterialsContext);
    
    function materialByTheme() {
        if (theme == "night") return night;
        if (theme == "sunset") return sunset;
        if (theme == "hell") return hell;
        if (theme == "day") return day;
    }

    return (
        <mesh material={materialByTheme()} scale={[scale, scale, scale]}>
            <sphereBufferGeometry attach="geometry" args={[1, 10, 10]} />
        </mesh>
    )
}