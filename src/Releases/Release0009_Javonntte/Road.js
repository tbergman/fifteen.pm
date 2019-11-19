import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from 'react-three-fiber';
import * as THREE from 'three';
import * as C from './constants';
import { randomPointsOnSphere, randomArrayVal, selectNRandomFromArray } from '../../Utils/random';

function StreetLights({ }) {
    const numLights = 6;
    const step = Math.floor(C.WORLD_ROAD_PATH.length/numLights);
    const points = [];
    for (let i=0; i<C.WORLD_ROAD_PATH.length; i+=step){
        const curPoint = C.WORLD_ROAD_PATH[i];
        const yOffset = curPoint.y < 0 ? -2 : 2;
        const xOffset = curPoint.x < 0 ? -2 : 2;
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

export default function Road({ curCamera, closed, extrusionSegments, radius, radiusSegments, offset, numSteps, ...props }) {
    curCamera = curCamera || useThree().camera;
    const road = useRef();
    useEffect(() => {
        const steps = C.WORLD_ROAD_PATH
        var closedSpline = new THREE.CatmullRomCurve3(steps);
        closedSpline.closed = true;
        closedSpline.curveType = 'catmullrom';
        const tubeGeometry = new THREE.TubeBufferGeometry(closedSpline, extrusionSegments, radius, radiusSegments, closed);
        road.current = tubeGeometry;
    }, [])

    return <>
        <StreetLights />
        {road.current &&
            <>
                {React.Children.toArray(props.children).map(element => {
                    return React.cloneElement(element, { road: road.current })
                })}
            </>
        }
    </>
}