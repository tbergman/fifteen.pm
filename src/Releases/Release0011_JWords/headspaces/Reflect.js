import { a } from '@react-spring/three';
import React, { useContext, useMemo, useState, useEffect } from 'react';
import { useFrame, useResource, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import useYScroll from '../../../Common/Scroll/useYScroll';
import { MaterialsContext } from '../MaterialsContext';


export default function Reflect({ gltf, material }) {
    const [head1y] = useYScroll([-2400, 2400], { domTarget: window });
    const [head2y] = useYScroll([-2400, 2400], { domTarget: window });
    const [ref, headspaces] = useResource()
    const { mouse } = useThree();
    const [head1GroupRef, head1Group] = useResource()
    const [head2GroupRef, head2Group] = useResource();
    const [head1MeshRef, head1Mesh] = useResource();
    const [head2MeshRef, head2Mesh] = useResource();

    const { naiveGlass } = useContext(MaterialsContext);

    const [head1, head2, originalMap] = useMemo(() => {
        let head1, head2, originalMap;
        gltf.scene.traverse(child => {
            if (child.name == "Object_0") {
                // const originalMap = child.material.map;
                // child.material = naiveGlass;
                // child.material.map = originalMap;
                originalMap = child.material.map
                head1 = child.clone()
                head2 = child.clone()
            }
        })
        return [head1, head2, originalMap];
    }, [gltf]);

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

    // useFrame(() => {
    // if (!head2Group) return;
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
    // })

    // useEffect(() => {
    //     if (!head2Group) return;
    //     // head2Group.rotation.y = THREE.Math.degToRad(180);
    // }, [head2Group])


    // useEffect(() => {
    //     if (!head1Group || !head2Group) return;
    //     head2Group.position.x = -.1
    //     head2Group.rotation.y = THREE.Math.degToRad(180)
    // }, [head1Group])

    useFrame(() => {
        if (!head2Group || !head1Group) return;
        head2Group.rotation.y = head1Group.rotation.y - THREE.Math.degToRad(180);
    })

    useEffect(() => {
        if (!material) return;
        material.map = originalMap;
    }, [material])

    return (
        <group ref={ref}>
            {headspaces &&
                <>
                    <a.group ref={head1GroupRef} position-x={.1} rotation-y={head1y.to(head1y => head1y / 200)}>
                        <mesh ref={head1MeshRef} material={material}>
                            <bufferGeometry attach="geometry" {...head1.geometry} />
                        </mesh>
                    </a.group>

                    <a.group ref={head2GroupRef} position-x={-.1}>
                        <mesh ref={head2MeshRef} material={material} >
                            <bufferGeometry attach="geometry" {...head2.geometry} />
                        </mesh>
                    </a.group>
                </>
            }
        </group>
    );
}
