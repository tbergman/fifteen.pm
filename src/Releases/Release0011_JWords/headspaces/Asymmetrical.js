import React, { useEffect, useMemo, useContext, Suspense, useState } from 'react';
import * as THREE from 'three';
import { useLoader, useResource, useFrame, useThree } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import * as C from '../constants';
import { MaterialsContext } from '../MaterialsContext';
import { a } from '@react-spring/three'
import useYScroll from '../../../Common/Scroll/useYScroll'
import useXScroll from '../../../Common/Scroll/useXScroll'
import { cloudEnvMap } from '../../../Common/Materials/utils.js';


export default function Asymmetrical({ mesh1, mesh2, complexity, material1, material2 }) {
    const [y] = useYScroll([-2400, 2400], { domTarget: window })
    const [head1GroupRef, head1Group] = useResource()
    const [head2GroupRef, head2Group] = useResource();
    const [head1MeshRef, head1Mesh] = useResource();
    const [head2MeshRef, head2Mesh] = useResource();


    useFrame(() => {
        if (!head2Group) return;
        head2Group.rotation.y -= .01;
    })

    useFrame(() => {
        if (!head1Group) return;
        head1Group.rotation.y += .01;
    })

    return (
        <>
            <a.group ref={head1GroupRef} scale={[2., 2., 2.]} position={[0, 0, -.1]} rotation-y={y.to(y => y / 200)}>
                <mesh ref={head1MeshRef} material={material1} >
                    <bufferGeometry attach="geometry" {...mesh1.geometry} />
                </mesh>
            </a.group>
            <a.group ref={head2GroupRef} scale={[3., 3., 3.,]} position={[0, 0, .1]} rotation-x={y.to(y => y / 100)}>
                <mesh ref={head2MeshRef} material={material2} >
                    <bufferGeometry attach="geometry" {...mesh2.geometry} />
                </mesh>
            </a.group>
        </>
    );
}
