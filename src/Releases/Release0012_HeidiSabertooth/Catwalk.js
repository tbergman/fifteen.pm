import React, { useEffect, useMemo, useContext, useRef, useState } from 'react';
import { useThree, useFrame } from 'react-three-fiber';
import * as THREE from 'three';
import { MaterialsContext } from './MaterialsContext';

export default function Catwalk({ extrusionSegments, radius, radiusSegments, ...props }) {
    const ref = useRef();
    const { wireframe, platformPolishedSpeckledMarbleTop, linedCement } = useContext(MaterialsContext);
    const catwalk = useMemo(() => {
        const steps = [
            new THREE.Vector3(-10, -5, 0),
            new THREE.Vector3(-11, 0, 0),
            new THREE.Vector3(-10, 4, 0),
            new THREE.Vector3(0, 5, 0),
            new THREE.Vector3(10, 4, 0),
            new THREE.Vector3(10, -4, 0),
            new THREE.Vector3(0, -5, 0),
        ]
        var closedSpline = new THREE.CatmullRomCurve3(steps);
        closedSpline.closed = true;
        closedSpline.curveType = 'catmullrom';
        radius = radius ? radius : 1
        radiusSegments = radiusSegments ? radiusSegments : 100
        extrusionSegments = extrusionSegments ? extrusionSegments : radiusSegments
        // const geometry = new THREE.TubeBufferGeometry(closedSpline, extrusionSegments, radius, radiusSegments, closedSpline.closed);
        const geometry = new THREE.TubeBufferGeometry(closedSpline, 100, 1, 4, closedSpline.closed);
        return geometry;
    })
    const childrenRef = useRef();
    useFrame(() => {
        // TODO (jeremy) this speed should change per track
        platformPolishedSpeckledMarbleTop.map.offset.x -= .01;
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
