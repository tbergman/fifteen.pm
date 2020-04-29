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
    const [y] = useYScroll([-100, 2400], { domTarget: window })
    const [ref, headspaces] = useResource()
    const { foamGripPurple } = useContext(MaterialsContext);
    const gltf = useLoader(GLTFLoader, C.HEADSPACE_1_PATH, loader => {
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco-gltf/')
        loader.setDRACOLoader(dracoLoader)
    })
    const geometry = useMemo(() => {
        let geometry;
        console.log("BACK AGAIN... only load me once! ")
        gltf.scene.traverse(child => {

            if (child.type == "Mesh") {
                console.log("MESH", child)
                geometry = child.geometry.clone();
            } else {
                console.log("OTHER", child)
            }

        })
        return geometry;
    });
    useFrame(() => {
        if (!headspaces) return;
        headspaces.rotation.y += .01;
    })
    return (
        <a.group ref={ref} rotation-y={y.interpolate(y => (y/ 750) * 25)}>
            {headspaces &&
                <mesh material={foamGripPurple} onUpdate={self => console.log("WTF", self)}>
                    <bufferGeometry attach="geometry" {...geometry} />
                </mesh>
            }
        </a.group>
    );
}
