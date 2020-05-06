import React, { useEffect, useContext, useMemo, Suspense } from 'react';
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
    const { foamGripPurple } = useContext(MaterialsContext);
    const gltf = useLoader(GLTFLoader, C.HEADSPACE_4_PATH, loader => {
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco-gltf/')
        loader.setDRACOLoader(dracoLoader)
    })
    const [head1, head2] = useMemo(() => {
        let head1, head2;
        console.log("BACK AGAIN... only load me once! ")
        gltf.scene.traverse(child => {
            console.log("NAME", child.name)
            if (child.name == "head1") {
                console.log("NAME", child.name)
                head1 = child.geometry.clone();
            }
            if (child.name == "head2") {
                head2 = child.geometry.clone();
            }
        })
        return [head1, head2];
    });
    useFrame(() => {
        if (!headspaces) return;
        headspaces.rotation.y += .01;
    })
    return (
        <group ref={ref}>
            {headspaces &&
                <>
                    <a.group rotation-y={y.to(y => y / 200)}>
                        <mesh material={foamGripPurple} >
                            <bufferGeometry attach="geometry" {...head1} />
                        </mesh>
                    </a.group>
                    <a.group rotation-x={y.to(y => y / 200)}>
                        <mesh material={foamGripPurple} >
                            <bufferGeometry attach="geometry" {...head2} />
                        </mesh>
                    </a.group>
                </>
            }
        </group>
    );
}
