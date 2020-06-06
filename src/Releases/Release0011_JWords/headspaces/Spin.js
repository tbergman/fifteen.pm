import React, { useEffect, useMemo, useContext, Suspense } from 'react';
import { useLoader, useResource, useFrame, useThree } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import * as C from '../constants';
import { MaterialsContext } from '../MaterialsContext';
import { a } from '@react-spring/three'
import useYScroll from '../../../Common/Scroll/useYScroll'
import useXScroll from '../../../Common/Scroll/useXScroll'


export default function Spin({gltf }) {
    // export default function Headspaces({ }) {
    const [y] = useYScroll([-2400, 2400], { domTarget: window })
    
    const { mouse } = useThree();
    const [head1GroupRef, head1Group] = useResource()
    const [head2GroupRef, head2Group] = useResource();
    const [head1MeshRef, head1Mesh] = useResource();
    const [head2MeshRef, head2Mesh] = useResource();
    // const [wireframeRef, useWireframe] = useResource();

    const { foamGripPurple } = useContext(MaterialsContext);
    const { noise1, head2Mat } = useContext(MaterialsContext);
 
    const [head1, head2] = useMemo(() => {
        let head1, head2;
        // console.log("BACK AGAIN... only load me once! ")
        gltf.scene.traverse(child => {
            // console.log(child.name)
            if (child.type == "Mesh") {
                // child.material.transparent = true;
                // child.material.opacity = .9;
                // child.material.wireframe = true;
                // console.log(child.material)
                // child.material = sunsetGradientNoise;
            }
            if (child.name == "Object_0") {
                head1 = child
                if (head1.material.map) {
                    // passing the map in here to copy it directly from the
                    // gltf, which gets initialized after the material 
                    noise1.uniforms.map = { value: head1.material.map }
                }

                head1.material = noise1
            }
            // if (child.name == "head1") {
            //     head1 = child;
            //     head1.material = noise1
            // }
            // if (child.name == "head2") {
            //     head2 = child;
            //     head2.material = head2Mat;
            // }
        })
        return [head1, head2];
    });



    useFrame(() => {
        if (!head2Group) return;
        head2Group.rotation.y -= .01;
        if (Math.abs(head2Group.rotation.x % .1) < .01) {
            head2Mesh.visible = true
            head2Mesh.material = head2.material
        } else if (Math.abs(head2Group.rotation.x % .1) > .9){
            head2Mesh.visible = false
        } else {
            head2Mesh.visible = true
            head2Mesh.material = foamGripPurple
        }
    })

    useFrame(() => {
        if (!head1Group) return;
        head1Group.rotation.y += .01;
        if (Math.abs(head1Group.rotation.y % .1) < .1) {
            head1Mesh.material = head1.material
        } else {
            head1Mesh.material = foamGripPurple
        }
    })

    return (
        
            
                <>
                    <a.group ref={head1GroupRef} rotation-y={y.to(y => y / 200)}>
                        <mesh ref={head1MeshRef} material={head1.material} >
                            <bufferGeometry attach="geometry" {...head1.geometry} />
                        </mesh>
                    </a.group>
                    {/* <a.group ref={head2GroupRef} rotation-x={y.to(y => y / 200)}>
                        <mesh ref={head2MeshRef} material={head2.material} >
                            <bufferGeometry attach="geometry" {...head2.geometry} />
                        </mesh>
                    </a.group> */}
                </>
            


    );
}
