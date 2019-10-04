import React from 'react';
import * as THREE from 'three';
import { cloneDeep } from 'lodash';
import * as C from './constants';

export function groupBuildingGeometries(geometries) {
    const maxHeightBucket = {
        short: [],
        tall: [],
    }
    /**
     * geometries are a nested key structure with each leaf an array: geometries.{maxWidthBucket}.{maxHeightBucket}.{category}
     */
    const maxWidthBucket = {
        // these are bucketed by approximate max widths
        small: cloneDeep(maxHeightBucket),
        medium: cloneDeep(maxHeightBucket),
        large: cloneDeep(maxHeightBucket),
    }
    const grouped = maxWidthBucket;
    geometries.forEach(geometry => {
        // Not using categories
        const [maxWidthBucket, maxHeightBucket, category, name] = geometry.name.split("_");
        grouped[maxWidthBucket][maxHeightBucket].push(geometry);
    })
    return grouped;
}

export function Buildings({ material, formation, normal }) {
    return <mesh
        geometry={formation.geometry}
        material={material}
        position={formation.centroid}
    />
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
            geometry.scale(C.BASE_SCALE, C.BASE_SCALE, C.BASE_SCALE);
            geometries.push(geometry);
        }
    })
    return geometries;
}