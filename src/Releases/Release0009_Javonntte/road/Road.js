import React, { useEffect, useRef } from 'react';
import { useThree } from 'react-three-fiber';
import * as THREE from 'three';
import * as C from '../constants';
import StreetLights from './StreetLights';

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