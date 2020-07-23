import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { MaterialsContext } from './MaterialsContext';

function CatwalkLight({ position, color, intensity}) {
    const ref = useRef();
    const { scene } = useThree();
    useEffect(() => {
        var helper = new THREE.PointLightHelper(ref.current);
        scene.add(helper);
    })
    useFrame(() => {
        if (ref.current.position.x < -5) ref.current.position.x = 5
        ref.current.position.x -= .1
    })

    return <pointLight
        ref={ref}
        position={position}
        castShadow={true}
        intensity={intensity}
        color={color}
    />
}

export default function Catwalk({ extrusionSegments, radius, radiusSegments, ...props }) {
    const ref = useRef();
    const { platformPolishedSpeckledMarbleTop } = useContext(MaterialsContext);
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
    })
    const setRefs = useRef(new Map()).current
    const { children } = props
    return <group ref={ref}>
        <mesh lights={true} receiveShadow={true} geometry={catwalk} material={platformPolishedSpeckledMarbleTop} scale={[1,1,2]} />
        <CatwalkLight position={[0, 1.95, 0]} color={"blue"} intensity={1} />
        <CatwalkLight position={[0, -1.95, 0]} color={"yellow"} intensity={1} />
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
