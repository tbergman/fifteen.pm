import React from 'react';
import * as THREE from 'three';
import { faceCentroid, triangleFromFace } from '../../Utils/geometry';
import { Buildings } from './buildings';
import { tileId } from '../../Utils/SphereTiles';
import { cloneDeep } from 'lodash';
import {pickFormation} from './formations';

require('three-instanced-mesh')(THREE);

function createInstance(elements, material) {
    const totalInstances = elements.length;
    const geometry = elements[0].geometry;
    const cluster = new THREE.InstancedMesh(
        geometry,
        material,
        totalInstances,              // instance count
        false,                       //is it dynamic
        true,                        //does it have color
        true,                        //uniform scale, if you know that the placement function will not do a non-uniform scale, this will optimize the shader
    );
    var _v3 = new THREE.Vector3();
    var randCol = function () {
        return Math.random();
    };
    for (let i = 0; i < totalInstances; i++) {
        const tmpOffset = i;// * 15;
        var obj = new THREE.Object3D();
        obj.lookAt(elements[tmpOffset].normal);
        obj.updateMatrix();
        const quaternion = new THREE.Quaternion().setFromRotationMatrix(obj.matrix);
        // TODO include random z rotation
        // const rotation = new THREE.Euler(0, 0, THREE.Math.randFloat(-2 * Math.PI, 2 * Math.PI));
        // const quaternion = new THREE.Quaternion().setFromEuler(rotation);
        cluster.setQuaternionAt(i, quaternion);
        const centroid = elements[tmpOffset].centroid;
        cluster.setPositionAt(i, _v3.set(centroid.x, centroid.y, centroid.z));
        cluster.setScaleAt(i, _v3.set(1, 1, 1));
        cluster.setColorAt(i, new THREE.Color(randCol(), randCol(), randCol()));
    }
    return cluster;
}

function generateTileFormations(sphereGeometry, geometries) {
    const geometriesByCategory = generateBuildingsByCategory(geometries);
    const vertices = sphereGeometry.vertices;
    const faces = sphereGeometry.faces;
    const formations = {};
    let prevFormationId = 0;
    faces.forEach((face, index) => {
        const centroid = faceCentroid(face, vertices);
        const tId = tileId(centroid);
        const triangle = triangleFromFace(face, vertices);
        formations[tId] = pickFormation({ triangle, centroid, geometriesByCategory, prevFormationId })
        prevFormationId = formations[tId].id;
    })
    return formations;
}

// TODO rename
function generateBuildingsByCategory(geometries) {
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
    const maxWidthBucket = {
        // these are bucketed by approximate max widths
        small: cloneDeep(maxHeightBucket),
        medium: cloneDeep(maxHeightBucket),
        large: cloneDeep(maxHeightBucket),
        xlarge: cloneDeep(maxHeightBucket),
    }
    const categorized = maxWidthBucket;
    geometries.forEach(geometry => {
        const [maxWidthBucket, maxHeightBucket, category] = geometry.name.split("_");
        categorized[maxWidthBucket][maxHeightBucket][category].push(geometry);
    })
    return categorized;
}

// TODO maybe the material ref should be assigned to the incoming geometries array of objects
export function generateWorldInstanceGeometries(sphereGeometry, buildings) {
    const elementsByName = {};
    const instancesByName = {};
    // build up a lookup of each geometry by name
    buildings.geometries.forEach((geometry) => elementsByName[geometry.name] = []);
    // generate formations for all tiles
    const formations = generateTileFormations(sphereGeometry, buildings.geometries);
    // add each geometry instance from each tile formation to the elements by name look up
    Object.keys(formations).forEach((tId) => {
        formations[tId].elements.forEach((element) => {
            elementsByName[element.geometry.name].push(element);
        })
    });
    // create an instance geometry for each geometry type that includes all locations on each formation for that geometry
    Object.keys(elementsByName).forEach((name) => {
        if (elementsByName[name].length) {
            instancesByName[name] = createInstance(elementsByName[name], buildings.material);
        }
    });
    return instancesByName;
}

export const SkyCityTile = props => {
    return <group>
        <Buildings
            material={props.tileElements.buildings.material}
            formation={props.tileElements.formations[props.tileId]}
            normal={props.normal}
        />
    </group>
}