import React, { useEffect, useMemo, useContext, useRef, useState } from 'react';
import { useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { MaterialsContext } from './MaterialsContext';

export default function Catwalk({ extrusionSegments, radius, radiusSegments, ...props }) {
    const ref = useRef();
    // const { polishedSpeckledMarbleTop } = useContext(MaterialsContext);
    const [catwalk, setCatwalk] = useState()
    const [platform, setPlatform] = useState()
    useEffect(() => {
        const steps = [
            new THREE.Vector3(-5, 0, 0),
            new THREE.Vector3(10, 7.5, 0),
            new THREE.Vector3(5, 0, 0),
        ]
        var closedSpline = new THREE.CatmullRomCurve3(steps);
        closedSpline.closed = true;
        closedSpline.curveType = 'catmullrom';
        radius = radius ? radius : 1
        radiusSegments = radiusSegments ? radiusSegments : 100
        extrusionSegments = extrusionSegments ? extrusionSegments : radiusSegments
        const tubeGeometry = new THREE.TubeBufferGeometry(closedSpline, extrusionSegments, radius, radiusSegments, closedSpline.closed);
        setCatwalk(tubeGeometry)
    }, [])
    return <group ref={ref}>
        <mesh geometry={catwalk} />
        <group >
            {React.Children.toArray(props.children).map(child => {
                return React.cloneElement(child, { catwalk: catwalk })
            })}
        </group>
    </group>
}
