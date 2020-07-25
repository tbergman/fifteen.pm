import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { MaterialsContext } from './MaterialsContext';
import useAudioPlayer from '../../Common/UI/Player/hooks/useAudioPlayer';


export default function Catwalk({ extrusionSegments=100, radius=.5, radiusSegments=100, ...props }) {
    const {currentTrackName} = useAudioPlayer()
    const ref = useRef();
    const { platformPolishedSpeckledMarbleTop } = useContext(MaterialsContext);
    const catwalk = useMemo(() => {
        const steps = [
            new THREE.Vector3(-5, 0, 0),
            new THREE.Vector3(-4, .75, 0),
            new THREE.Vector3(0, .75, 0),
            new THREE.Vector3(4, .75, 0),
            new THREE.Vector3(5, 0, 0),
            new THREE.Vector3(4, -.75, 0),
            new THREE.Vector3(0, -.75, 0),
            new THREE.Vector3(-4, -.75, 0),
        ]
        var closedSpline = new THREE.CatmullRomCurve3(steps);
        closedSpline.closed = true;
        closedSpline.curveType = 'catmullrom';
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
        {currentTrackName !== "Looking For Roses" && <mesh
            lights={true}
            receiveShadow={true}
            geometry={catwalk}
            material={platformPolishedSpeckledMarbleTop}
            scale={[1,1,2]}
            />}
        {/* <CatwalkLight position={[0, 2., 0]} color={"purple"} intensity={10} />
        <CatwalkLight position={[0, 2., 0]} color={"purple"} intensity={10} />
        <CatwalkLight position={[2, 3., 0]} color={"pink"} intensity={10} stationary={true}/> 
        <CatwalkLight position={[-2, 3., 0]} color={"red"} intensity={10} stationary={true}/> 
        <CatwalkLight position={[3, 3., 0]} color={"yellow"} intensity={10} stationary={true}/> 
        <CatwalkLight position={[-3, 3., 0]} color={"green"} intensity={10} stationary={true}/>  */}
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
