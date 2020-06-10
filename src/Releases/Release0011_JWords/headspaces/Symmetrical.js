import { a } from '@react-spring/three';
import React, { useContext, useMemo, useState, useEffect } from 'react';
import { useFrame, useResource, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import useYScroll from '../../../Common/Scroll/useYScroll';
import { MaterialsContext } from '../MaterialsContext';


export default function Symmetrical({ mesh, material }) {
    const [head1y] = useYScroll([-2400, 2400], { domTarget: window });
    const [ref, headspaces] = useResource()
    const [head1GroupRef, head1Group] = useResource()
    const [head2GroupRef, head2Group] = useResource();
    const [head1MeshRef, head1Mesh] = useResource();
    const [head2MeshRef, head2Mesh] = useResource();
    console.log("DID SOMETHING CHANGE??", mesh, material)

    // useFrame(() => {
    //     if (!headspaces) return;
    //     headspaces.rotation.y += .001;
    //     headspaces.rotation.x += .003;
    // })

    useFrame(() => {
        if (!head2Group || !head1Group) return;
        head2Group.rotation.y = head1Group.rotation.y - THREE.Math.degToRad(180);
    })

    return (
        <group ref={ref}>
            {/* <group ref={head1GroupRef} position-x={.1}> */}
            <a.group ref={head1GroupRef} position-x={.1} rotation-y={head1y.to(head1y => head1y / 200)}>
                <mesh ref={head1MeshRef} material={material}>
                    <bufferGeometry attach="geometry" {...mesh.geometry} />
                </mesh>
                {/* </group> */}
            </a.group>

            <a.group ref={head2GroupRef} position-x={-.1}>
                {/* <group ref={head2GroupRef} position-x={-.1}> */}
                <mesh ref={head2MeshRef} material={material} >
                    <bufferGeometry attach="geometry" {...mesh.geometry} />
                </mesh>
            </a.group>
            {/* </group> */}
        </group>
    );
}
