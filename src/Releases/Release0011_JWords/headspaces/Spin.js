import React, { useEffect, useMemo, useContext, Suspense } from 'react';
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

function loadGLTF(gltf) {
    let head;
    gltf.scene.traverse(child => {
        if (child.name == "Object_0") {
            head = child.clone();
            // head.material = material;
            // head.material.envMap = cloudEnvMap();
            head.material.wireframe = true;
            head.material.color = new THREE.Color("white");
        }
    })
    return head;
}

export default function Spin({ gltf1, gltf2, material1, material2, colorMap1, colorMap2 }) {
    // export default function Headspaces({ }) {
    const [y] = useYScroll([-2400, 2400], { domTarget: window })

    const { mouse } = useThree();
    const [head1GroupRef, head1Group] = useResource()
    const [head2GroupRef, head2Group] = useResource();
    const [head1MeshRef, head1Mesh] = useResource();
    const [head2MeshRef, head2Mesh] = useResource();
    // const [wireframeRef, useWireframe] = useResource();

    const { naiveGlass } = useContext(MaterialsContext);

    const head1 = useMemo(() => loadGLTF(gltf1, naiveGlass));

    const head2 = useMemo(() => loadGLTF(gltf2, naiveGlass));



    // useFrame(() => {
    //     if (!head2Group) return;
    //     head2Group.rotation.y -= .01;
    //     if (Math.abs(head2Group.rotation.x % .1) < .01) {
    //         head2Mesh.visible = true
    //         head2Mesh.material = head2.material
    //     } else if (Math.abs(head2Group.rotation.x % .1) > .9){
    //         head2Mesh.visible = false
    //     } else {
    //         head2Mesh.visible = true
    //         head2Mesh.material = foamGripPurple
    //     }
    // })

    // useFrame(() => {
    //     if (!head1Group) return;
    //     head1Group.rotation.y += .01;
    //     if (Math.abs(head1Group.rotation.y % .1) < .1) {
    //         head1Mesh.material = head1.material
    //     } else {
    //         head1Mesh.material = foamGripPurple
    //     }
    // })

    useEffect(()=>{
        if (!colorMap1) return;
        material.map = colorMap1
    }, [colorMap1, material])

    return (
        <>
            <a.group ref={head1GroupRef} scale={[2., 2., 2.]} position={[0, 0, -.1]} rotation-y={y.to(y => y / 200)}>
                <mesh ref={head1MeshRef} material={head1.material} >
                    <bufferGeometry attach="geometry" {...head1.geometry} />
                </mesh>
            </a.group>
            <a.group ref={head2GroupRef} scale={[3., 3., 3.,]} position={[0, 0, .1]} rotation-x={y.to(y => y / 100)}>
                <mesh ref={head2MeshRef} material={head2.material} >
                    <bufferGeometry attach="geometry" {...head2.geometry} />
                </mesh>
            </a.group>
        </>
    );
}
