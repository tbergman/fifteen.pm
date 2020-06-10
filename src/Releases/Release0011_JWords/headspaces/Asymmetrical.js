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
    console.log("ASSYMETICAL", "MATERIAL1:", material1, "geometry", mesh1.geometry)
    // const [material1, setMaterial1] = useState()
    // const [material2, setMaterial2] = useState()

    // useEffect(() => {
    //     if (!material) return;
    //     console.log("SETTING MATERIALS!")
    //     setMaterial1(material.clone())
    //     setMaterial2(material.clone())
    // }, [material])

    // useEffect(() => {
    //     if (!material1) return;
    //     console.log("MAT1", material1.map)
    // }, [material1])

    // useFrame(() => {
    //     if (!head2Group) return;
    //     head2Group.rotation.y -= .01;
    // })

    // useFrame(() => {
    //     if (!head1Group) return;
    //     head1Group.rotation.y += .01;
    // })

    // useEffect(() => {
    //     if (!material2) return;
    //     material2.map = head2.colorMap;
    //     // setMaterial2(material2);
    // }, [material2]);


    // useEffect(() => {
    //     if (!material1) return;
    //     console.log("COLORMAP: ", head1.colorMap, "MATERIAL1", material1)
    //     material1.map = head1.colorMap;
    //     // setMaterial2(material2);
    // }, [material1]);
    // useEffect(() => {
    //     if (!material1 || !originalMap1) return;

    //     material1.map = originalMap1;
    //     setMaterial1Map(originalMap1);
    //     console.log("ASSIGNED MAP?", material1.map)
    // }, [material1, originalMap1])

    return (
        <>
            {/* {material1 && material2 && */}
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
            {/* } */}
        </>
    );
}
