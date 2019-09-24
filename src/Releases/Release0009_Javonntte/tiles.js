import React from 'react';
import * as THREE from 'three';
import {
    getMiddle,
    triangleCentroidFromVertices as centroidFromPoints,
    triangleCentroid as centroidFromTriangle,
    triangleFromVertices
} from '../../Utils/geometry';
import { faceCentroid, triangleFromFace } from '../../Utils/geometry';
import { randomArrayVal } from '../../Utils/random';
import * as C from './constants';
import { Buildings } from './buildings';
import { tileId } from '../../Utils/SphereTiles';
import { randFloat } from '../../Utils/random';
import { cloneDeep } from 'lodash';

require('three-instanced-mesh')(THREE);

function formationSmallMediumTallPresent6({ centroid, triangleComponents, geometries }) {
    return [
        {
            geometry: randomArrayVal(geometries[C.SMALL][C.TALL][C.PRESENT]),
            centroid: centroidFromPoints(triangleComponents.i1, triangleComponents.a, centroid),
            normal: triangleComponents.normal,
        },
        {
            geometry: randomArrayVal(geometries[C.SMALL][C.TALL][C.PRESENT]),
            centroid: centroidFromPoints(triangleComponents.a, triangleComponents.i2, centroid),
            normal: triangleComponents.normal,
        },
        {
            geometry: randomArrayVal(geometries[C.MEDIUM][C.TALL][C.PRESENT]),
            centroid: centroidFromPoints(triangleComponents.i2, triangleComponents.b, centroid),
            normal: triangleComponents.normal,
        },
        {
            geometry: randomArrayVal(geometries[C.MEDIUM][C.TALL][C.PRESENT]),
            centroid: centroidFromPoints(triangleComponents.b, triangleComponents.i3, centroid),
            normal: triangleComponents.normal,
        },
        {
            geometry: randomArrayVal(geometries[C.MEDIUM][C.TALL][C.PRESENT]),
            centroid: centroidFromPoints(triangleComponents.i3, triangleComponents.c, centroid),
            normal: triangleComponents.normal,
        },
        {
            geometry: randomArrayVal(geometries[C.MEDIUM][C.TALL][C.PRESENT]),
            centroid: centroidFromPoints(triangleComponents.c, triangleComponents.i1, centroid),
            normal: triangleComponents.normal,
        },
    ]
}

function formationLargeTallPresent1({ centroid, triangleComponents, geometries }) {
    return [{
        geometry: randomArrayVal(geometries[C.LARGE][C.TALL][C.PRESENT]),
        centroid: centroid,
        normal: triangleComponents.normal,
    }]
}

function formationArchAndSmallShortFuture3({ centroid, triangleComponents, geometries }) {
    return [
        {
            geometry: randomArrayVal(geometries[C.LARGE][C.TALL][C.ARCH]),
            centroid: centroid,
            normal: triangleComponents.normal,
        },
        {
            geometry: randomArrayVal(geometries[C.SMALL][C.SHORT][C.FUTURE]),
            centroid: centroidFromPoints(triangleComponents.i1, triangleComponents.a, centroid),
            normal: triangleComponents.normal,
        },
        {
            geometry: randomArrayVal(geometries[C.SMALL][C.SHORT][C.FUTURE]),
            centroid: centroidFromPoints(triangleComponents.a, triangleComponents.i2, centroid),
            normal: triangleComponents.normal,
        },
        {
            geometry: randomArrayVal(geometries[C.SMALL][C.SHORT][C.FUTURE]),
            centroid: centroidFromPoints(triangleComponents.i2, triangleComponents.b, centroid),
            normal: triangleComponents.normal,
        },
        {
            geometry: randomArrayVal(geometries[C.SMALL][C.SHORT][C.FUTURE]),
            centroid: centroidFromPoints(triangleComponents.b, triangleComponents.i3, centroid),
            normal: triangleComponents.normal,
        },
        {
            geometry: randomArrayVal(geometries[C.SMALL][C.SHORT][C.FUTURE]),
            centroid: centroidFromPoints(triangleComponents.i3, triangleComponents.c, centroid),
            normal: triangleComponents.normal,
        },
        {
            geometry: randomArrayVal(geometries[C.SMALL][C.SHORT][C.FUTURE]),
            centroid: centroidFromPoints(triangleComponents.c, triangleComponents.i1, centroid),
            normal: triangleComponents.normal,
        },
    ]
}



function formationSmallTallPresent36({ centroid, triangleComponents, geometries }) {
    const tinyTriangles = [
        triangleFromVertices(triangleComponents.i1, triangleComponents.a, centroid),
        triangleFromVertices(triangleComponents.a, triangleComponents.i2, centroid),
        triangleFromVertices(triangleComponents.i2, triangleComponents.b, centroid),
        triangleFromVertices(triangleComponents.b, triangleComponents.i3, centroid),
        triangleFromVertices(triangleComponents.i3, triangleComponents.c, centroid),
        triangleFromVertices(triangleComponents.c, triangleComponents.i1, centroid),
    ].map(triangle => {
        return {
            components: subdivideTriangle(triangle),
            centroid: centroidFromTriangle(triangle)
        }
    })
    const formations = [];
    tinyTriangles.forEach(tiny => {
        formations.push(
            {
                geometry: randomArrayVal(geometries[C.SMALL][C.TALL][C.PRESENT]),
                centroid: centroidFromPoints(tiny.components.i1, tiny.components.a, tiny.centroid),
                normal: triangleComponents.normal,
            },
            {
                geometry: randomArrayVal(geometries[C.SMALL][C.TALL][C.PRESENT]),
                centroid: centroidFromPoints(tiny.components.a, tiny.components.i2, tiny.centroid),
                normal: triangleComponents.normal,
            },
            {
                geometry: randomArrayVal(geometries[C.SMALL][C.TALL][C.PRESENT]),
                centroid: centroidFromPoints(tiny.components.i2, tiny.components.b, tiny.centroid),
                normal: triangleComponents.normal,
            },
            {
                geometry: randomArrayVal(geometries[C.SMALL][C.TALL][C.PRESENT]),
                centroid: centroidFromPoints(tiny.components.b, tiny.components.i3, tiny.centroid),
                normal: triangleComponents.normal,
            },
            {
                geometry: randomArrayVal(geometries[C.SMALL][C.TALL][C.PRESENT]),
                centroid: centroidFromPoints(tiny.components.i3, tiny.components.c, tiny.centroid),
                normal: triangleComponents.normal,
            },
            {
                geometry: randomArrayVal(geometries[C.SMALL][C.TALL][C.PRESENT]),
                centroid: centroidFromPoints(tiny.components.c, tiny.components.i1, tiny.centroid),
                normal: triangleComponents.normal,
            }
        );
    });
    return formations;
}

function subdivideTriangle(triangle) {
    const normal = new THREE.Vector3();
    return {
        i1: triangle.a,
        i2: triangle.b,
        i3: triangle.c,
        a: getMiddle(triangle.a, triangle.b),
        b: getMiddle(triangle.b, triangle.c),
        c: getMiddle(triangle.a, triangle.c),
        normal: triangle.getNormal(normal), // TODO this is not strictly all the normals, but generally it's close
    }
}

function pickTileFormationId(prevId) {
    switch (prevId) {
        case 0: return THREE.Math.randInt(0, 5) < 1 ? 0 : 1;
        case 1: return THREE.Math.randInt(0, 10) > 1 ? 1 : 0;
        case 2: return THREE.Math.randInt(0, 10) < 1 ? 2 : 0;
        case 3: return THREE.Math.randInt(0, 10) < 1 ? 3 : 0
    }
}

function pickTileFormation({ triangle, centroid, geometriesByCategory, prevFormationId }) {
    // TODO some heuristic for which formations work best where
    const formation = {};
    const formationProps = {
        centroid: centroid,
        triangleComponents: subdivideTriangle(triangle),
        geometries: geometriesByCategory,
    }
    // TODO hack to sketch what this looks like...
    // formation.id = pickTileFormationId(prevFormationId);
    formation.id = THREE.Math.randInt(0, 3);
    // formation.id = 1;
    formation.centroid = centroid;
    formation.elements = (() => {
        // formation.geometry = BufferGeometryUtils.mergeBufferGeometries((() => {
        switch (formation.id) {
            case 0: return formationSmallMediumTallPresent6(formationProps);
            case 1: return formationLargeTallPresent1(formationProps);
            case 2: return formationSmallTallPresent36(formationProps);
            case 3: return formationArchAndSmallShortFuture3(formationProps);
        }
    })()
    return formation;
}

// // TODO v3 is always centroid
function localMatrix(v1, v2, v3, worldTriangleCentroid) {
    const worldSubdivisionCentroid = centroidFromPoints(v1, v2, v3);
    const position = worldSubdivisionCentroid.subVectors(worldSubdivisionCentroid, worldTriangleCentroid);
    const scale = new THREE.Vector3(1., 1., 1.);
    const rotation = new THREE.Euler(0, 0, THREE.Math.randFloat(-2 * Math.PI, 2 * Math.PI));
    const quaternion = new THREE.Quaternion().setFromEuler(rotation);
    const matrix = new THREE.Matrix4();
    matrix.compose(position, quaternion, scale);
    return matrix;
}

function localGeometry(geometry, v1, v2, v3, worldCentroid) {
    const requiredAttributes = ["normal", "position"];
    Object.keys(geometry.attributes).forEach(attributeName => {
        if (!requiredAttributes.includes(attributeName)) geometry.removeAttribute(attributeName);
    })
    const matrix = localMatrix(v1, v2, v3, worldCentroid)
    geometry.applyMatrix(matrix);
    return geometry;
}

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
        formations[tId] = pickTileFormation({ triangle, centroid, geometriesByCategory, prevFormationId })
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
    buildings.geometries.forEach((geometry) => elementsByName[geometry.name] = []);
    const formations = generateTileFormations(sphereGeometry, buildings.geometries);
    Object.keys(formations).forEach((tId) => {
        formations[tId].elements.forEach((element) => {
            elementsByName[element.geometry.name].push(element);
        })
    });
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