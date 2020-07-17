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
        const radiusSegments = radiusSegments ? radiusSegments : 100
        // const geometry = new THREE.CircleGeometry(1, radiusSegments);
        // console.log('geom', geometry)
        // const points = geometry.vertices.reverse(); // reverse it so driver is going in expected dir
        // const steps = points.slice(0, points.length - 2); // don't overlap the loop (rm last elt)
        // const steps = 
        // var curve = new THREE.QuadraticBezierCurve3(
        const steps = [
            new THREE.Vector3(-5, 0, 0),
            new THREE.Vector3(10, 7.5, 0),
            new THREE.Vector3(5, 0, 0),
        ]
        // );
        var closedSpline = new THREE.CatmullRomCurve3(steps);
        closedSpline.closed = true;
        closedSpline.curveType = 'catmullrom';
        const extrusionSegments = extrusionSegments ? extrusionSegments : radiusSegments
        console.log("RADIUS", radius)
        radius = radius ? radius : .1
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
