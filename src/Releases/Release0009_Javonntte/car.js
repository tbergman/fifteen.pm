import React from 'react';
import * as THREE from 'three';
import { useResource } from 'react-three-fiber';
import { Metal03Material } from '../../Utils/materials';

export function onCarLoaded(gltf) {
    const geometries = []
    gltf.scene.traverse(child => {
        if (child.isMesh) {
            const geometry = child.geometry.clone();
            geometry.name = child.name;
            geometries.push(geometry);
        }
    })
    // just one geometry
    return geometries[0];
}


export function Cadillac({ geometry, position }) {
    const [metal03MaterialRef, metal03Material] = useResource();
    
    return (
        <>
            <Metal03Material materialRef={metal03MaterialRef} />
            {metal03MaterialRef &&
                <mesh
                    geometry={geometry}
                    material={metal03Material}
                    position={position ? [position.x, position.y, position.z - 10] : new THREE.Vector3()}
                />
            }
        </>
    )
}