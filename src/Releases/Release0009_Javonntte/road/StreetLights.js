import React from 'react';
import * as THREE from 'three';
import * as C from '../constants';

export default function StreetLights({ }) {

    const numLights = 5;
    const step = Math.floor(C.WORLD_ROAD_PATH.length/numLights);
    const points = [];
    for (let i=0; i<C.WORLD_ROAD_PATH.length; i+=step){
        const curPoint = C.WORLD_ROAD_PATH[i];
        const yOffset = curPoint.y < 0 ? -2 : 2;
        // const xOffset = curPoint.x < 0 ? -2 : 2;
        points.push([curPoint.x, curPoint.y + yOffset, curPoint.z]);
    }
    
    return <>
        {points.map((point, idx) => {
            return <pointLight
                key={idx}
                position={point}
                intensity={1.5}
                color={[0x0f0, 0xffa500][THREE.Math.randInt(0, 1)]}
            />
        })}
    </>
}