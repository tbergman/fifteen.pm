import { a } from '@react-spring/three';
import React, { useContext, useMemo, useState, useEffect } from 'react';
import { useFrame, useResource, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import useYScroll from '../../../Common/Scroll/useYScroll';
import { MaterialsContext } from '../MaterialsContext';
import * as C from '../constants';

export default function Symmetrical({ head, complexity }) {
    const [head1y] = useYScroll([-2400, 2400], { domTarget: window });
    const [ref, headspace] = useResource()
    const [head1GroupRef, head1Group] = useResource()
    const [head2GroupRef, head2Group] = useResource();
    const [head1MeshRef, head1Mesh] = useResource();
    const [head2MeshRef, head2Mesh] = useResource();


    useFrame(() => {
        if (!head2Group || !head1Group) return;
        head2Group.rotation.y = head1Group.rotation.y - THREE.Math.degToRad(180);
    })

    useFrame(() => {
        if (!headspace) return;
        if (complexity == C.SMALL) {
            headspace.rotation.y += .001;
            headspace.rotation.x += .003;
        } else if (complexity == C.MEDIUM) {
            headspace.rotation.y += .09;
            headspace.rotation.x += .09;
        } else if (complexity == C.LARGE) {
            headspace.rotation.y += .5;
            headspace.rotation.x += .5;
        }
    })

    return (
        <group ref={ref}>
            <a.group ref={head1GroupRef} position-x={.1} rotation-y={head1y.to(head1y => head1y / 200)}>
                <mesh ref={head1MeshRef} material={head.material}>
                    <bufferGeometry attach="geometry" {...head.geometry} />
                </mesh>
                {/* </group> */}
            </a.group>
            <a.group ref={head2GroupRef} position-x={-.1}>
                <mesh ref={head2MeshRef} material={head.material} >
                    <bufferGeometry attach="geometry" {...head.geometry} />
                </mesh>
            </a.group>
        </group>
    );
}
