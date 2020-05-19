import React, { useEffect, useMemo, useContext, Suspense } from 'react';
import { useLoader, useResource, useFrame } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import * as C from './constants';
import { MaterialsContext } from './MaterialsContext';
import { a } from '@react-spring/three'
import useYScroll from '../../Common/Scroll/useYScroll'
import useXScroll from '../../Common/Scroll/useXScroll'

export default function Headspaces({ }) {
    const [y] = useYScroll([-2400, 2400], { domTarget: window })
    const [ref, headspaces] = useResource()
    const [head1GroupRef, head1Group] = useResource()
    const [head2GroupRef, head2Group] = useResource();
    const [head1MeshRef, head1Mesh] = useResource();
    const [head2MeshRef, head2Mesh] = useResource();
    const { foamGripPurple } = useContext(MaterialsContext);
    const { head1Mat, head2Mat } = useContext(MaterialsContext);
    const gltf = useLoader(GLTFLoader, C.HEADSPACE_4_PATH, loader => {
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco-gltf/')
        loader.setDRACOLoader(dracoLoader)
    })
    const [head1, head2] = useMemo(() => {
        let head1, head2;
        console.log("BACK AGAIN... only load me once! ")
        gltf.scene.traverse(child => {
            if (child.type == "Mesh") {
                // child.material.transparent = true;
                // child.material.opacity = .9;
                // child.material.wireframe = true;
                // console.log(child.material)
                // child.material = sunsetGradientNoise;
            }
            if (child.name == "head1") {
                head1 = child;
                head1.material = head1Mat
            }
            if (child.name == "head2") {
                head2 = child;
                head2.material = head2Mat;
            }
        })
        return [head1, head2];
    });
    // useFrame(() => {
    //     if (!headspaces) return;
    //     headspaces.rotation.y += .01;
    // })

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

    useFrame(() => {
        if (!head1Group) return;
        // head1Group.rotation.y += .01;
        // if (Math.abs(head1Group.rotation.y % .1) < .1) {
        //     head1Mesh.material = head1.material
        // } else {
        //     head1Mesh.material = foamGripPurple
        // }
    })

    return (
        <group ref={ref}>
            {headspaces &&
                <>
                    <a.group ref={head1GroupRef} rotation-y={y.to(y => y / 200)}>
                        <mesh ref={head1MeshRef} material={head1.material} >
                            <bufferGeometry attach="geometry" {...head1.geometry} />
                        </mesh>
                    </a.group>
                    <a.group ref={head2GroupRef} rotation-x={y.to(y => y / 200)}>
                        <mesh ref={head2MeshRef} material={head2.material} >
                            <bufferGeometry attach="geometry" {...head2.geometry} />
                        </mesh>
                    </a.group>
                </>
            }

        </group>
    );
}
