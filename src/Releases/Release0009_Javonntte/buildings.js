import React, { useRef } from 'react';
import * as THREE from 'three';

// function buildingName(building, position) {
//     return [building.name,
//     position.x,
//     position.y,
//     position.z,
//     ].join("_")
// }

// function Building({ geometry, material, centroid, normal, color, visible }) {
//     // if (!geometry) return null;
//     return <mesh
//         onUpdate={self => {
//             self.lookAt(normal);
//             self.rotation.z = THREE.Math.randFloat(-2 * Math.PI, 2 * Math.PI);
//             self.visible = visible
//         }}
//         geometry={geometry}
//         position={centroid}
//         material={material}
//     />
// }

export function Buildings({ material, formation, normal }) {
    // const buildingGroupRef = useRef();
    // console.log("----")
    // console.log(formation.geometry);
    // console.log(formation.centroid);
    return <mesh
        // onUpdate={self => {
        //     self.lookAt(normal);
        // }}
        geometry={formation.geometry}
        material={material}
        position={formation.centroid}
    />
    // return <group>
    //     {formation.subdivisions.map(subdivision => {
    //         return <group
    //             ref={buildingGroupRef}
    //             key={buildingName(subdivision.geometry, subdivision.centroid)}
    //         >
    //             <Building
    //                 material={material}
    //                 normal={normal}
    //                 geometry={subdivision.geometry}
    //                 centroid={subdivision.centroid}
    //             />
    //         </group>
    //     })}
    // </group>;
}

export function onBuildingsLoaded(gltf) {
    const geometries = []
    const geometrySize = new THREE.Vector3();
    gltf.scene.traverse(child => {
        if (child.isMesh) {
            child.position.set(0, 0, 0);
            const geometry = child.geometry.clone();
            geometry.toNonIndexed();
            geometry.computeBoundingBox();
            geometry.boundingBox.getSize(geometrySize);
            geometry.name = child.name;
            geometries.push(geometry);
        }
    })
    return geometries;
}