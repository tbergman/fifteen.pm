import React from 'react';
import * as THREE from 'three';
import * as C from './constants';

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
            geometry.scale(C.BUILDING_BASE_SCALE, C.BUILDING_BASE_SCALE, C.BUILDING_BASE_SCALE);
            geometries.push(geometry);
        }
    })
    return geometries;
}

export function groupBuildingGeometries(geometries) {
    const maxWidthBucket = {
        // these are bucketed by approximate max widths
        small: [],
        medium: [],
        large: [],
    }
    const grouped = maxWidthBucket;
    geometries.forEach(geometry => {
        // Not using categories
        const [maxWidthBucket, maxHeightBucket, category, name] = geometry.name.split("_");
        grouped[maxWidthBucket].push(geometry);
    })
    return grouped;
}

export default function Buildings({ instancedBuildings }) {
    return <>
        {Object.keys(instancedBuildings).map(instanceName => {
            return <primitive key={instanceName}
                object={instancedBuildings[instanceName]}
            />
        })
        }
    </>;
}
