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
            geometry: randomArrayVal(geometries[C.ARCH]),
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
    const triangles = [];
    tinyTriangles.forEach(tiny => {
        triangles.push(
            {
                geometry: randomArrayVal(geometries[C.SMALL][C.TALL][C.PRESENT]),
                centroid: centroidFromPoints(tiny.components.i1, tiny.components.a, tiny.centroid),
            },
            {
                geometry: randomArrayVal(geometries[C.SMALL][C.TALL][C.PRESENT]),
                centroid: centroidFromPoints(tiny.components.a, tiny.components.i2, tiny.centroid),
            },
            {
                geometry: randomArrayVal(geometries[C.SMALL][C.TALL][C.PRESENT]),
                centroid: centroidFromPoints(tiny.components.i2, tiny.components.b, tiny.centroid),
            },
            {
                geometry: randomArrayVal(geometries[C.SMALL][C.TALL][C.PRESENT]),
                centroid: centroidFromPoints(tiny.components.b, tiny.components.i3, tiny.centroid),
            },
            {
                geometry: randomArrayVal(geometries[C.SMALL][C.TALL][C.PRESENT]),
                centroid: centroidFromPoints(tiny.components.i3, tiny.components.c, tiny.centroid),
            },
            {
                geometry: randomArrayVal(geometries[C.SMALL][C.TALL][C.PRESENT]),
                centroid: centroidFromPoints(tiny.components.c, tiny.components.i1, tiny.centroid),
            }
        );
    });
    return triangles;
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
    formation.id = THREE.Math.randInt(0, 3);
    // formation.id = 3;
    formation.subdivisions = (() => {
        switch (formation.id) {
            case 0: return formationSmallMediumTallPresent6(formationProps);
            case 1: return formationLargeTallPresent1(formationProps);
            case 2: return formationSmallTallPresent36(formationProps);
            case 3: return formationArchAndSmallShortFuture3(formationProps);
        }
    })()
    return formation;
}

//TODO https://github.com/mrdoob/three.js/issues/13506
function merge(triangles) {
}