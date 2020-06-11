import { a } from '@react-spring/three';
import * as THREE from 'three';
import React, { useEffect } from 'react';
import { useFrame, useResource } from 'react-three-fiber';
import useYScroll from '../../../Common/Scroll/useYScroll';
import * as C from '../constants';

export default function Single({ head, complexity }) {
    const [head1y] = useYScroll([-2400, 2400], { domTarget: window });
    const [ref, headspace] = useResource()
    const [head1GroupRef, head1Group] = useResource()
    const [head1MeshRef, head1Mesh] = useResource();

useEffect(() => {
    if (!headspace) return;
    headspace.rotation.y += THREE.Math.degToRad(90);
}, [headspace])

    useEffect(() => {
        if (!head1Group) return;
        if (complexity == C.SMALL) {
            head1Group.scale.x *= .75;
            head1Group.scale.y *= .75;
            head1Group.scale.z *= .75;
        } else if (complexity == C.MEDIUM) {
            head1Group.scale.x = 1.;
            head1Group.scale.y = 1.;
            head1Group.scale.z = 1.;
        } else if (complexity == C.LARGE) {
            head1Group.scale.x *= 2.;
            head1Group.scale.y *= 2.;
            head1Group.scale.z *= 2.;
        }
    }, [complexity, head1Group])

    useFrame(() => {
        if (!headspace) return;
        headspace.rotation.x += .00001;
        headspace.rotation.y += .008;
        headspace.rotation.z += .0001;
    })


    return (
        <group ref={ref}>
            <a.group ref={head1GroupRef} rotation-y={head1y.to(head1y => head1y / 200)} >
                <mesh ref={head1MeshRef} material={head.material} position={[0, 0, 0.05]}  >
                    <bufferGeometry attach="geometry" {...head.geometry} />
                </mesh>
            </a.group>
        </group>
    );
}
