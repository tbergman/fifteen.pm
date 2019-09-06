import React from 'react';
import { useThree } from 'react-three-fiber';


export function buildingName(building, position) {
    return [building.name,
    position.x,
    position.y,
    position.z,
    ].join("_")
}


// TODO
import {initPinkRockMaterial} from '../../Utils/materials';
import * as THREE from 'three';
const pinkRockMat = initPinkRockMaterial(new THREE.TextureLoader());

export function Building({ geometry, centroid, normal, color, visible }) {
    // TODO getting the buildings to sit on the curve properly will work with use of 'Spherical'
    const { camera } = useThree();
    return <mesh
        onUpdate={self => {
            self.lookAt(normal)
            self.visible = visible
        }}
        geometry={geometry}
        position={centroid}
        material={pinkRockMat}
    >
        {/* <meshBasicMaterial attach="material" color={color} /> */}
    </mesh>
}

export function onBuildingsLoaded(gltf) {
    // size as measured by footprint
    const geometries = {
        small: [],
        medium: [],
        large: []
    }
    gltf.scene.traverse(child => {
        if (child.isMesh) {
            child.geometry.center();
            // child.position.set(0, 0, 0);//new THREE.Vector3(0, 0, 0);
            const geometry = child.geometry.clone();
            // this makes the 'lookAt(normal)' easier to use later on by flipping the default blender output for expected placement on the sphere
            // geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI));
            if (child.name.startsWith("MID")) { // TODO these were names i made in blender so would need to update them there to match small, medium, large
                geometries.medium.push(geometry);
            } else if (child.name.startsWith("WIDE")) {
                geometries.large.push(geometry);
            } else if (child.name.startsWith("NARROW")) {
                geometries.small.push(geometry);
            }
        }
    })
    return geometries;
}