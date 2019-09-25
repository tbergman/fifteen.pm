import * as THREE from 'three';
import { faceCentroid, subdivideTriangle, triangleCentroid as centroidFromTriangle, triangleCentroidFromVertices as centroidFromPoints, triangleFromFace, triangleFromVertices } from '../../Utils/geometry';
import { randomArrayVal } from '../../Utils/random';
import { tileId } from '../../Utils/SphereTiles';
import { generateBuildingsByCategory } from './buildings';
import * as C from './constants';

// TODO namespacing for all of the formations
// TODO can we be more dynamic/expressive with picking geometries rather than declarative?

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

function formationSmallMediumTallFuture6({ centroid, triangleComponents, geometries }) {
    return [
        {
            geometry: randomArrayVal(geometries[C.SMALL][C.TALL][C.FUTURE]),
            centroid: centroidFromPoints(triangleComponents.i1, triangleComponents.a, centroid),
            normal: triangleComponents.normal,
        },
        {
            geometry: randomArrayVal(geometries[C.SMALL][C.TALL][C.FUTURE]),
            centroid: centroidFromPoints(triangleComponents.a, triangleComponents.i2, centroid),
            normal: triangleComponents.normal,
        },
        {
            geometry: randomArrayVal(geometries[C.MEDIUM][C.TALL][C.FUTURE]),
            centroid: centroidFromPoints(triangleComponents.i2, triangleComponents.b, centroid),
            normal: triangleComponents.normal,
        },
        {
            geometry: randomArrayVal(geometries[C.MEDIUM][C.TALL][C.FUTURE]),
            centroid: centroidFromPoints(triangleComponents.b, triangleComponents.i3, centroid),
            normal: triangleComponents.normal,
        },
        {
            geometry: randomArrayVal(geometries[C.MEDIUM][C.TALL][C.FUTURE]),
            centroid: centroidFromPoints(triangleComponents.i3, triangleComponents.c, centroid),
            normal: triangleComponents.normal,
        },
        {
            geometry: randomArrayVal(geometries[C.MEDIUM][C.TALL][C.FUTURE]),
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

function pickFormationId(prevId) {
    switch (prevId) {
        case 0: return THREE.Math.randInt(0, 5) < 1 ? 0 : 1;
        case 1: return THREE.Math.randInt(0, 2) < 1 ? 1 : 0;
        case 2: return THREE.Math.randInt(0, 10) < 1 ? 2 : 0;
        case 3: return THREE.Math.randInt(0, 10) < 1 ? 3 : 5;
        case 4: return THREE.Math.randInto(0, 1) < 1 ? 4 : 5;
        case 5: return THREE.Math.randInt(0, 1) < 1 ? 5 : 0;
    }
}

function pickFormation({ triangle, centroid, geometriesByCategory, prevFormationId }) {
    // TODO some heuristic for which formations work best where
    const formation = {};
    const formationProps = {
        centroid: centroid,
        triangleComponents: subdivideTriangle(triangle),
        geometries: geometriesByCategory,
    }
    // TODO hack to sketch what this looks like...
    // formation.id = pickFormationId(prevFormationId);
    formation.id = THREE.Math.randInt(0, 5);
    // formation.id = 4;
    formation.centroid = centroid;
    formation.elements = (() => {
        // formation.geometry = BufferGeometryUtils.mergeBufferGeometries((() => {
        switch (formation.id) {
            case 0: return formationSmallMediumTallPresent6(formationProps);
            case 1: return formationLargeTallPresent1(formationProps);
            case 2: return formationSmallTallPresent36(formationProps);
            case 3: return formationArchAndSmallShortFuture3(formationProps);
            case 4: return formationSmallMediumTallFuture6(formationProps);
            case 5: return [];
        }
    })()
    return formation;
}

export function generateFormations(surfaceGeometry, geometries) {
    const geometriesByCategory = generateBuildingsByCategory(geometries);
    const vertices = surfaceGeometry.vertices;
    const faces = surfaceGeometry.faces;
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