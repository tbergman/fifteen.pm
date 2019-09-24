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
require('three-instanced-mesh')(THREE);

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

function pickTileFormation({ triangle, centroid, geometries, prevFormationId }) {
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


// TODO not using this atm
const tileFormationRatios = () => {
    const ratios = {
        0: .2,
        1: .7,
        2: .1,
    }
    const sum = Object.values(ratios).reduce((a, b) => a + b, 0);
    console.assert(sum == 1., { sum: sum, errorMsg: "formationRatios sum must add up to 1." });
    return ratios;
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

// TODO this function needs to be passed to the SphereTileGenerator and folded into its logic somehow
export function generateTileGeometries(sphereGeometry, geometries) {
    const vertices = sphereGeometry.vertices;
    const faces = sphereGeometry.faces;
    const formations = {};
    let prevFormationId = 0;
    // TODO here is a hacky version of allocating tiles by type.
    let prevTileId;
    faces.forEach((face, index) => {
        const centroid = faceCentroid(face, vertices);
        const tId = tileId(centroid);
        const triangle = triangleFromFace(face, vertices);
        formations[tId] = pickTileFormation({ triangle, centroid, geometries, prevFormationId })
        prevFormationId = formations[tId].id;
        prevTileId = tId;
    })
    //geometry to be instanced
    const geo = formations[prevTileId].geometry.geometry; // just need one geometry
    //material that the geometry will use
    var material = new THREE.MeshPhongMaterial();
    const totalInstances = 250;
    //the instance group
    var cluster = new THREE.InstancedMesh(
        geo,                 //this is the same 
        material,
        totalInstances,                       //instance count
        false,                       //is it dynamic
        true,                        //does it have color
        true,                        //uniform scale, if you know that the placement function will not do a non-uniform scale, this will optimize the shader
    );
    var _v3 = new THREE.Vector3();
    var _q = new THREE.Quaternion();
    var randCol = function () {
        return Math.random();
    };
    for (var i = 0; i < totalInstances; i++) {
        cluster.setQuaternionAt(i, _q);
        cluster.setPositionAt(i, _v3.set(Math.random() * 40 - 20, Math.random() * 40 - 20, Math.random() * 40 - 20));
        cluster.setScaleAt(i, _v3.set(1, 1, 1));
        cluster.setColorAt(i, new THREE.Color(randCol(), randCol(), randCol()))
    }
    return cluster;
}