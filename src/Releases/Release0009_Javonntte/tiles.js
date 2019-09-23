import React from 'react';
import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';
import {
    getMiddle,
    triangleCentroidFromVertices as centroidFromPoints,
    triangleCentroid as centroidFromTriangle,
    triangleFromVertices
} from '../../Utils/geometry';
import { randomArrayVal } from '../../Utils/random';
import * as C from './constants';
import { Buildings } from './buildings';

export const SkyCityTile = props => {
    console.log("RENDER TILE!", props.tileId);
    return <group>
        <Buildings
            material={props.tileElements.buildings.material}
            formation={props.tileElements.formations[props.tileId]}
            normal={props.normal}
        />
    </group>
}

// TODO not using this atm
export const tileFormationRatios = () => {
    const ratios = {
        0: .2,
        1: .7,
        2: .1,
    }
    const sum = Object.values(ratios).reduce((a, b) => a + b, 0);
    console.assert(sum == 1., { sum: sum, errorMsg: "formationRatios sum must add up to 1." });
    return ratios;
}

function formationSmallMediumTallPresent6({ centroid, triangleComponents, geometries }) {
    return [
        {
            geometry: randomArrayVal(geometries[C.SMALL][C.TALL][C.PRESENT]),
            centroid: centroidFromPoints(triangleComponents.i1, triangleComponents.a, centroid)
        },
        {
            geometry: randomArrayVal(geometries[C.SMALL][C.TALL][C.PRESENT]),
            centroid: centroidFromPoints(triangleComponents.a, triangleComponents.i2, centroid)
        },
        {
            geometry: randomArrayVal(geometries[C.MEDIUM][C.TALL][C.PRESENT]),
            centroid: centroidFromPoints(triangleComponents.i2, triangleComponents.b, centroid)
        },
        {
            geometry: randomArrayVal(geometries[C.MEDIUM][C.TALL][C.PRESENT]),
            centroid: centroidFromPoints(triangleComponents.b, triangleComponents.i3, centroid)
        },
        {
            geometry: randomArrayVal(geometries[C.MEDIUM][C.TALL][C.PRESENT]),
            centroid: centroidFromPoints(triangleComponents.i3, triangleComponents.c, centroid)
        },
        {
            geometry: randomArrayVal(geometries[C.MEDIUM][C.TALL][C.PRESENT]),
            centroid: centroidFromPoints(triangleComponents.c, triangleComponents.i1, centroid)
        },
    ]
}

function formationLargeTallPresent1({ centroid, triangleComponents, geometries }) {
    return {
        geometry: geometries[C.LARGE][C.TALL][C.PRESENT][1],
        centroid: centroid,
    };
    return [
        {
            geometry: randomArrayVal(geometries[C.LARGE][C.TALL][C.PRESENT]),
            centroid: centroid
        }
    ]
}

function formationArchAndSmallShortFuture3({ centroid, triangleComponents, geometries }) {
    return [
        {
            geometry: randomArrayVal(geometries[C.LARGE][C.TALL][C.ARCH]),
            centroid: centroid,
        },
        {
            geometry: randomArrayVal(geometries[C.SMALL][C.SHORT][C.FUTURE]),
            centroid: centroidFromPoints(triangleComponents.i1, triangleComponents.a, centroid)
        },
        {
            geometry: randomArrayVal(geometries[C.SMALL][C.SHORT][C.FUTURE]),
            centroid: centroidFromPoints(triangleComponents.a, triangleComponents.i2, centroid)
        },
        {
            geometry: randomArrayVal(geometries[C.SMALL][C.SHORT][C.FUTURE]),
            centroid: centroidFromPoints(triangleComponents.i2, triangleComponents.b, centroid)
        },
        {
            geometry: randomArrayVal(geometries[C.SMALL][C.SHORT][C.FUTURE]),
            centroid: centroidFromPoints(triangleComponents.b, triangleComponents.i3, centroid)
        },
        {
            geometry: randomArrayVal(geometries[C.SMALL][C.SHORT][C.FUTURE]),
            centroid: centroidFromPoints(triangleComponents.i3, triangleComponents.c, centroid)
        },
        {
            geometry: randomArrayVal(geometries[C.SMALL][C.SHORT][C.FUTURE]),
            centroid: centroidFromPoints(triangleComponents.c, triangleComponents.i1, centroid)
        },
    ]
}

// TODO v3 is always centroid
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
    const formationGeometries = [];
    tinyTriangles.forEach(tiny => {
        formationGeometries.push(
            localGeometry(
                randomArrayVal(geometries[C.SMALL][C.TALL][C.PRESENT]),
                tiny.components.i1,
                tiny.components.a,
                tiny.centroid,
                centroid,
            ),
            localGeometry(
                randomArrayVal(geometries[C.SMALL][C.TALL][C.PRESENT]),
                tiny.components.a,
                tiny.components.i2,
                tiny.centroid,
                centroid,
            ),
            localGeometry(randomArrayVal(geometries[C.SMALL][C.TALL][C.PRESENT]),
                tiny.components.i2,
                tiny.components.b,
                tiny.centroid,
                centroid,
            ),
            localGeometry(randomArrayVal(geometries[C.SMALL][C.TALL][C.PRESENT]),
                tiny.components.b,
                tiny.components.i3,
                tiny.centroid,
                centroid,
            ),
            localGeometry(randomArrayVal(geometries[C.SMALL][C.TALL][C.PRESENT]),
                tiny.components.i3,
                tiny.components.c,
                tiny.centroid,
                centroid,
            ),
            localGeometry(randomArrayVal(geometries[C.SMALL][C.TALL][C.PRESENT]),
                tiny.components.c,
                tiny.components.i1,
                tiny.centroid,
                centroid
            ),
        );
    });

    // const mergedGeom =BufferGeometryUtils.mergeBufferGeometries(formationGeometries); 
    // if (!mergedGeom){
    //     console.log("NULL", Array.from(new Set(Object.keys(formationGeometries.map(f=>f.attributes)))).sort());
    // } else {
    //     console.log("GOOD", formationGeometries.map(f=>f.attributes));
    // }

    return formationGeometries;
}

function subdivideTriangle(triangle) {
    return {
        i1: triangle.a,
        i2: triangle.b,
        i3: triangle.c,
        a: getMiddle(triangle.a, triangle.b),
        b: getMiddle(triangle.b, triangle.c),
        c: getMiddle(triangle.a, triangle.c),
    }
}

function pickTileFormationId(prevId) {
    switch (prevId) {
        case 0: return THREE.Math.randInt(0, 5) < 1 ? 0 : 1;
        case 1: return THREE.Math.randInt(0, 10) > 1 ? 1 : 0;
        case 2: return THREE.Math.randInt(0, 10) < 1 ? 2 : 1;
    }
}

export function pickTileFormation({ triangle, centroid, geometries, prevFormationId }) {
    // TODO some heuristic for which formations work best where
    const formation = {};
    const formationProps = {
        centroid: centroid,
        triangleComponents: subdivideTriangle(triangle),
        geometries: geometries,
    }
    // TODO hack to sketch what this looks like...
    // formation.id = pickTileFormationId(prevFormationId);
    // formation.id = THREE.Math.randInt(0, 3);
    formation.id = 1;
    formation.centroid = centroid;
    formation.geometry = (() => {
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

// TODO https://github.com/mrdoob/three.js/issues/13506
// TODO https://github.com/mrdoob/three.js/issues/13506
// TODO https://codepen.io/nicoptere/pen/gGemyV?editors=1010
// TODO https://stackoverflow.com/questions/41880864/how-to-use-three-js-instancedbuffergeometry-instancedbufferattribute
// TODO https://stackoverflow.com/questions/45669968/gltf-create-instances
/* 
After some time of investigation I discovered why using instancedbuffergeometries were not working with the buffergeometries found in my GLTF files.
The problem is that GLTF format uses indexedbuffergeometries and the workaround is very simple, just convert them with toNonIndexed() method.
*/
function merge(geometries) {



    // return geometries);
    // 
    // copy geom attributes position and normal - update position to centroid stored in tiles obj
    // subtract the geometry's specific centroid for each tile from the worldspace centroid of the tile to get the relative position of the geom 
    // const matrix = new THREE.Matrix4();
    // const geometries = [];
    // const scale = new THREE.Vector3();
    // for (let i = 0; i < tiles.length; i++) {
    // geometries.push(geometry);
    // }

    // const geoms = tiles.map(t => t.geometry);
    // console.log(geoms[0]);
    // const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries);
    // return mergedGeometry;
    // return geometry;
    // const instancedGeometry = new THREE.InstancedBufferGeometry();
    // for (let i = 0; i < tiles.length; i++) {
    //     Object.keys(tiles[i].geometry).forEach(attributeName => {
    //         instancedGeometry.attributes[attributeName] = tiles[i].geometry.attribute[attributeName]
    //     })
    //     instancedGeometry.index = tiles[i].geometry.index;
    //     instancedGeometry.maxInstancedCount = 2000; // TODO tiles.length...
    //     const matArraySize = 2000 * 4; // TODO tiles.length...
    //     const matrixArray = [
    //         new Float32Array(matArraySize),
    //         new Float32Array(matArraySize),
    //         new Float32Array(matArraySize),
    //         new Float32Array(matArraySize),
    //     ]
    // }
}