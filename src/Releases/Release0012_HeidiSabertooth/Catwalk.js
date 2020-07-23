import React, { useEffect, useMemo, useContext, useRef, useState } from 'react';
import { useThree, useFrame } from 'react-three-fiber';
import * as THREE from 'three';
import { MaterialsContext } from './MaterialsContext';

export default function Catwalk({ extrusionSegments, radius, radiusSegments, ...props }) {
    const ref = useRef();
    const { wireframe, platformPolishedSpeckledMarbleTop, linedCement } = useContext(MaterialsContext);
    const catwalk = useMemo(() => {
        const steps = [
            new THREE.Vector3(-5, -1.25, 0),
            new THREE.Vector3(-5.5, 0, 0),
            new THREE.Vector3(-5.5, 1, 0),
            new THREE.Vector3(0, 1.25, 0),
            new THREE.Vector3(5, 1, 0),
            new THREE.Vector3(5, -1, 0),
            new THREE.Vector3(0, -1.25, 0),
        ]
        var closedSpline = new THREE.CatmullRomCurve3(steps);
        closedSpline.closed = true;
        closedSpline.curveType = 'catmullrom';
        radius = radius ? radius : .5
        radiusSegments = radiusSegments ? radiusSegments : 100
        extrusionSegments = extrusionSegments ? extrusionSegments : radiusSegments
        const geometry = new THREE.TubeBufferGeometry(closedSpline, extrusionSegments, radius, radiusSegments, closedSpline.closed);
        return geometry;
    })
    const childrenRef = useRef();
    useFrame(() => {
        // TODO (jeremy) this speed should change per track
        platformPolishedSpeckledMarbleTop.map.offset.x -= .005;
        // linedCement.map.offset.x -= .001;
    })
    const setRefs = useRef(new Map()).current
    const { children } = props
    return <group ref={ref}>
        <mesh geometry={catwalk} material={platformPolishedSpeckledMarbleTop} />
        <group ref={childrenRef}>
            {React.Children.map(children, child => {
                return React.cloneElement(
                    child,
                    {
                        catwalk: catwalk,
                        ...props,
                    },
                )
            })}
        </group>
    </group>
}
