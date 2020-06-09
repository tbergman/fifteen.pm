import React, { useEffect, useMemo, useContext, Suspense } from 'react';
import { useLoader, useResource, useFrame, useThree } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import * as C from '../constants';
import { MaterialsContext } from '../MaterialsContext';
import { a } from '@react-spring/three'
import useYScroll from '../../../Common/Scroll/useYScroll'

export default function Explode({ gltf }) {
    // export default function Headspaces({ }) {
    // const [y] = useYScroll([-2400, 2400], { domTarget: window })
    const [ref, headspaces] = useResource()
    const { mouse } = useThree();
    const [head1GroupRef, head1Group] = useResource()
    const [head2GroupRef, head2Group] = useResource();
    const [head1MeshRef, head1Mesh] = useResource();
    const [head2MeshRef, head2Mesh] = useResource();
    // const [wireframeRef, useWireframe] = useResource();

    const { foamGripPurple, noise1 } = useContext(MaterialsContext);
    // This initializes all gltf headspaces to be used by Explode, Spin, or Reflect.
    const head1 = useMemo(() => {
        let head1;
        gltf.scene.traverse(child => {
            if (child.type == "Mesh") {
            }
            if (child.name == "Object_0") {
                head1 = child
                if (head1.material.map) {
                    // passing the map in here to copy it directly from the
                    // gltf, which gets initialized after the material 
                    noise1.uniforms.map = { value: head1.material.map }
                }
            }
        })
        return head1;
    }, [gltf]);

    useEffect(() => {
        if (!noise1) return;
        head1.material = noise1
    }, [noise1])
    
    // useFrame(() => {
    //     if (!headspaces) return;
    //     headspaces.rotation.y += .01;
    //     headspaces.position.x = mouse.x / 6.;
    //     headspaces.position.y = mouse.y / 6.;
    // })

    return (
        <group ref={ref}>
            {headspaces &&
                <>
                    {/* <a.group ref={head1GroupRef} rotation-y={y.to(y => y / 200)}> */}
                    <group ref={head1GroupRef}>
                        <mesh ref={head1MeshRef} material={head1.material}  >
                            <bufferGeometry attach="geometry" {...head1.geometry} />
                        </mesh>
                    </group>
                </>
            }
        </group>
    );
}
