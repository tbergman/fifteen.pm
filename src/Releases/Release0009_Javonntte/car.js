import React from 'react';
import * as THREE from 'three';
import { useResource } from 'react-three-fiber';
import { Metal03Material } from '../../Utils/materials';

export function onCarLoaded(gltf) {
    // return gltf.scene
    const geometries = []
    gltf.scene.traverse(child => {
        if (child.isMesh) {
            const geometry = child.geometry.clone();
            geometry.name = child.name;
            geometries.push(geometry);
        }
    })
    return geometries;
}

export function Cadillac({ geometries, position }) {
    const [metal03MaterialRef, metal03Material] = useResource();
    console.log(geometries)
    return (
        <>
            {/* <Metal03Material materialRef={metal03MaterialRef} />
            {metal03MaterialRef &&
                geometries.map(geometry => {
                    return <mesh
                        geometry={geometry}
                        material={metal03Material}

                    // position={position ? [position.x, position.y, position.z - 10] : new THREE.Vector3()}
                    />
                })

            } */}
        </>
    )
}