import React, { useRef } from 'react';
import * as THREE from 'three';
import * as C from './constants';
import { randFloat } from '../../Utils/random';
import { cloneDeep } from 'lodash';

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

export function Buildings({ material, formation, normal }) {
    const buildingGroupRef = useRef();
    // return <mesh
    //     geometry={formation.geometry}
    //     material={material}
    // />
    return <group>
        {formation.subdivisions.map(subdivision => {
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

    const category = {
        // TODO this is where more playfulness and specificity can be added (e.g. the tilt brush types -- disco, petal etc.)
        future: [],
        present: [],
        arch: [],
    }
    const maxHeightBucket = {
        short: cloneDeep(category),
        average: cloneDeep(category),
        tall: cloneDeep(category),
    }

    /**
     * geometries are a nested key structure with each leaf an array: geometries.{maxWidthBucket}.{maxHeightBucket}.{category}
     */
    const geometries = {
        // these are bucketed by approximate max widths
        small: cloneDeep(maxHeightBucket),
        medium: cloneDeep(maxHeightBucket),
        large: cloneDeep(maxHeightBucket),
        xlarge: cloneDeep(maxHeightBucket),
    }

    const geometrySize = new THREE.Vector3();
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
            geometry.toNonIndexed();
            geometry.computeBoundingBox();
            geometry.boundingBox.getSize(geometrySize);
            // this makes the 'lookAt(normal)' function as expected on the sphere by flipping the default blender output
            geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI));
            const [maxWidthBucket, maxHeightBucket, category] = child.name.split("_");
            geometries[maxWidthBucket][maxHeightBucket][category].push(geometry);
        }
    })
    return geometries;
}