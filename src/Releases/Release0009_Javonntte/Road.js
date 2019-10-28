import React, { useEffect, useRef } from 'react';
import { useFrame, useResource, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { CloudMaterial } from '../../Utils/materials';
import * as C from './constants';

export default function Road({ curCamera, closed, extrusionSegments, radius, radiusSegments, offset, numSteps, ...props }) {
    curCamera = curCamera || useThree().camera;
    const road = useRef();
    const [cloudMaterialRef, cloudMaterial] = useResource();

    useEffect(() => {
        const steps = C.WORLD_ROAD_PATH
        var closedSpline = new THREE.CatmullRomCurve3(steps);
        closedSpline.closed = true;
        closedSpline.curveType = 'catmullrom';
        const tubeGeometry = new THREE.TubeBufferGeometry(closedSpline, extrusionSegments, radius, radiusSegments, closed);
        road.current = tubeGeometry;
    }, [])

    return <>
        <CloudMaterial materialRef={cloudMaterialRef} emissive={0xd4af37} />
        {cloudMaterialRef && road.current &&
            <>
                {/* <mesh
                    geometry={road.current}
                    material={cloudMaterial}
                /> */}
                {React.Children.toArray(props.children).map(element => {
                    return React.cloneElement(element, { road: road.current })
                })}
            </>
        }
    </>
}