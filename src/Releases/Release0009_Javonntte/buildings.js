import React from 'react';
import * as THREE from 'three';

export function buildingName(building, position) {
    return [building.name,
    position.x,
    position.y,
    position.z,
    ].join("_")
}

export function Building({ geometry, material, centroid, normal, color, visible }) {
    return <mesh
        onUpdate={self => {
            self.lookAt(normal);
            self.visible = visible
        }}
        geometry={geometry}
        position={centroid}
        material={material}
    // TODO random rotations
    />
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
            // For devving minimal number of faces
            // if (child.name === "MID_tower") {
            //     child.position.set(0, 0, 0);
            //     const geometry = child.geometry.clone();
            //     geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI));
            //     geometries.medium.push(geometry)
            // }
            child.position.set(0, 0, 0);
            const geometry = child.geometry.clone();
            // this makes the 'lookAt(normal)' function as expected on the sphere by flipping the default blender output
            geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI));
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