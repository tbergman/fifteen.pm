import React, { Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useLoader, useResource, useFrame, useThree } from 'react-three-fiber';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { a } from '@react-spring/three';
import useYScroll from '../../Common/Scroll/useYScroll';
import * as C from './constants.js'

function _extractTheHairElements(gltf) {
    let mesh, skeleton, rootBone = {}
    gltf.scene.traverse(child => {
        if (child.name == "Hair07") {
            mesh = child.clone()
            console.log("MESH >GEOMETRY", mesh.geometry)
        }
        if (child.name == "Bone002") {
            rootBone = child.clone()
            const bones = [rootBone];
            rootBone.traverse(child => {
                bones.push(child)
            })
            skeleton = new THREE.Skeleton(bones);
        }
    })
    mesh.add(rootBone);
    mesh.bind(skeleton);
    return mesh;
}

export default function TheHair() {
    const [hairy] = useYScroll([-2400, 2400], { domTarget: window });
    const [hairLoaded, setHairLoaded] = useState(false);
    const [theHairMesh, setTheHairMesh] = useState();
    const { scene, clock } = useThree();
    const [theHairSkeleton, setTheHairSkeleton] = useState()
    const theHair = useLoader(GLTFLoader, C.THE_HAIR, loader => {
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco-gltf/')
        loader.setDRACOLoader(dracoLoader)
    });

    useEffect(() => {
        if (!theHair) return
        const mesh = _extractTheHairElements(theHair)
        const skeletonHelper = new THREE.SkeletonHelper(mesh);
        skeletonHelper.material.linewidth = 2;
        scene.add(skeletonHelper);
        setTheHairMesh(mesh)
        setHairLoaded(true)

        // animation
        const mixer = new THREE.AnimationMixer(theHair);

    }, [theHair])

    useFrame((state, delta) => {
        for (let i = 0; i < theHairMesh.skeleton.bones.length; i++) {
            theHairMesh.skeleton.bones[i].position.z = Math.sin(clock.elapsedTime) * 10 / theHairMesh.skeleton.bones.length;
        }
    })

    return (<>
        {hairLoaded &&
            <group>
                <a.group rotation-y={hairy.to(hairy => hairy / 200)} >
                    <mesh material={theHairMesh.material} position={[0, 0, 0.05]}  >
                        <bufferGeometry attach="geometry" {...theHairMesh.geometry} />
                    </mesh>
                </a.group>
            </group>
        }</>
    )
}
