import React, { useMemo, Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useThree, extend, useResource } from 'react-three-fiber';
import TheHair from './TheHair.js';
import { MaterialsProvider } from './MaterialsContext';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// extend({ OrbitControls })
import Orbit from '../../Common/Controls/Orbit';
import GuapxX from './GuapxX.js';
import Alien1 from './Alien1.js';

export function Scene({ }) {
    const { camera } = useThree();
    const catwalk = useMemo(() => {
        const circle = new THREE.CircleGeometry(4, 4);
        const points = circle.vertices.reverse(); // reverse it so driver is going in expected dir
        const steps = points.slice(0, points.length - 2); // don't overlap the loop (rm last elt)
        var closedSpline = new THREE.CatmullRomCurve3(steps);
        closedSpline.closed = true;
        closedSpline.curveType = 'catmullrom';
        const extrusionSegments = 10
        const radius = 2
        const radiusSegments = 4
        return new THREE.TubeBufferGeometry(closedSpline, extrusionSegments, radius, radiusSegments, closedSpline.closed);
    })
    const [alienARef, alienA] = useResource()
    const [alienBRef, alienB] = useResource()
    const [controllerOn, setControllerOn] = useState(false)
    useEffect(() => {
        camera.position.z = 2
        camera.position.y = 2.5
    }, [])
    return (
        <>
            <ambientLight />
            <Orbit />
            <MaterialsProvider>
                <Suspense fallback={null} >
                    <TheHair catwalk={catwalk} />
                    <GuapxX catwalk={catwalk} />
                    {/* <Alien1 catwalk={catwalk} /> */}
                </Suspense>
            </MaterialsProvider>
        </>
    )
}
