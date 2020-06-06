import React, { useEffect, useMemo, useContext, Suspense } from 'react';
import * as THREE from 'three';
import { useLoader, useResource, useFrame, useThree } from 'react-three-fiber';

import * as C from '../constants';
import { MaterialsContext } from '../MaterialsContext';
import { a } from '@react-spring/three'
import useYScroll from '../../../Common/Scroll/useYScroll'
import useXScroll from '../../../Common/Scroll/useXScroll'
import cloudEnvMap from '../../../Common/Materials/utils.js';

export default function Reflect({ gltf }) {
    // export default function Headspaces({ }) {
    const [head1y] = useYScroll([-2400, 2400], { domTarget: window });
    const [head2y] = useYScroll([-2400, 2400], { domTarget: window });
    const [ref, headspaces] = useResource()
    const { mouse } = useThree();
    const [head1GroupRef, head1Group] = useResource()
    const [head2GroupRef, head2Group] = useResource();
    const [head1MeshRef, head1Mesh] = useResource();
    const [head2MeshRef, head2Mesh] = useResource();
    // const [wireframeRef, useWireframe] = useResource();


    const { foamGripPurple, naiveGlass } = useContext(MaterialsContext);
    const { noise1, head2Mat } = useContext(MaterialsContext);

    const [head1, head2] = useMemo(() => {
        let head1, head2;
        gltf.scene.traverse(child => {
            if (child.name == "Object_0") {
                const originalMap = child.material.map;
                child.material = naiveGlass;
                child.material.envMap = cloudEnvMap;
                child.material.map = originalMap;
                head1 = child.clone()
                head2 = child.clone()
            }
        })
        return [head1, head2];
    });

    useFrame(() => {
        if (!headspaces) return;
        headspaces.rotation.y += .01;
        // headspaces.rotation.y -= .1;
        headspaces.rotation.x += .03;
    })

    // useEffect(() => {
    //     if (!head1Group) return;
    //     head1Group.position.x = 100
    // }, [head1Group])

    useFrame(() => {
        if (!head2Group) return;
        // head2Group.rotation.y -= .01;
        // if (Math.abs(head2Group.rotation.x % .1) < .01) {
        //     head2Mesh.visible = true
        //     head2Mesh.material = head2.material
        // } else if (Math.abs(head2Group.rotation.x % .1) > .9){
        //     head2Mesh.visible = false
        // } else {
        //     head2Mesh.visible = true
        //     head2Mesh.material = foamGripPurple
        // }
    })

    useEffect(() => {
        if (!head2Group) return;
        // head2Group.rotation.y = THREE.Math.degToRad(180);
    }, [head2Group])

    // useEffect(() => {
    //     if (!head1Group || !head2Group) return;
    //     head2Group.position.x = -.1
    //     head2Group.rotation.y = THREE.Math.degToRad(180)
    // }, [head1Group])

    useFrame(() => {
        if (!head2Group || !head1Group) return;
        head2Group.rotation.y = head1Group.rotation.y - THREE.Math.degToRad(180);
    })

    return (
        <group ref={ref}>
            {headspaces &&
                <>
                    <a.group ref={head1GroupRef} position-x={.1} rotation-y={head1y.to(head1y => head1y / 200)}>
                        <mesh ref={head1MeshRef} material={head1.material} >
                            <bufferGeometry attach="geometry" {...head1.geometry} />
                        </mesh>
                    </a.group>

                    <a.group ref={head2GroupRef} position-x={-.1}>
                        <mesh ref={head2MeshRef} material={head2.material} >
                            <bufferGeometry attach="geometry" {...head2.geometry} />
                        </mesh>
                    </a.group>
                </>
            }
        </group>
    );
}
