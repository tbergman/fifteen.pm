import React, { useRef } from 'react';
import * as THREE from 'three';
import { SMALL, MEDIUM, LARGE } from "./constants";
import { randFloat } from '../../Utils/random';

function buildingName(building, position) {
    return [building.name,
    position.x,
    position.y,
    position.z,
    ].join("_")
}

function Building({ geometry, material, centroid, normal, color, visible }) {
    return <mesh
        onUpdate={self => {
            self.lookAt(normal);
            self.rotation.z = THREE.Math.randFloat(-2 * Math.PI, 2 * Math.PI);
            self.visible = visible
        }}
        geometry={geometry}
        position={centroid}
        material={material}
    />
}
export function Buildings({ material, subdivisions, normal }) {
    const buildingGroupRef = useRef();
    // return <>{geometry && <mesh
    //     onUpdate={self => {
    //         self.lookAt(normal);
    //         self.rotation.z = THREE.Math.randFloat(-2 * Math.PI, 2 * Math.PI);
    //         self.visible = true
    //     }}
    //     geometry={geometry}
    //     // position={centroid}
    //     material={material}
    // />}</>
    return <group>
        {subdivisions.map(subdivision => {
            return <group
                ref={buildingGroupRef}
                key={buildingName(subdivision.geometry, subdivision.centroid)}
            >
                <Building
                    material={material}
                    normal={normal}
                    geometry={subdivision.geometry}
                    centroid={subdivision.centroid}
                />
            </group>
        })}
    </group>;
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
            // if (child.name === "large_disco_geo001") {
            //     console.log("GOT THE GEOMETRY")
            //     child.position.set(0, 0, 0);
            //     const geometry = child.geometry.clone();
            //     geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI));
            //     geometries.medium.push(geometry)
            // }
            child.position.set(0, 0, 0);
            const geometry = child.geometry.clone();
            // this makes the 'lookAt(normal)' function as expected on the sphere by flipping the default blender output
            geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI));
            // give the buildings more organic positioning by rotating on z (UP)
            if (child.name.startsWith(MEDIUM)) {
                geometries.medium.push(geometry);
            } else if (child.name.startsWith(LARGE)) {
                geometries.large.push(geometry);
            } else if (child.name.startsWith(SMALL)) {
                geometries.small.push(geometry);
            }
        }
    })
    return geometries;
}