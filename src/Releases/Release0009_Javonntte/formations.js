import * as THREE from 'three';
import { faceCentroid, subdivideTriangle, triangleCentroid as centroidFromTriangle, triangleCentroidFromVertices as centroidFromPoints, triangleFromFace, triangleFromVertices } from '../../Utils/geometry';
import { randomArrayVal } from '../../Utils/random';
import { tileId } from '../../Utils/SphereTiles';
import { generateBuildingsByCategory } from './buildings';
import * as C from './constants';


// const totalFormations = {}
// `
// formations

// `

function subdivide6(triangleComponents, centroid) {
    return [
        triangleFromVertices(triangleComponents.i1, triangleComponents.a, centroid),
        triangleFromVertices(triangleComponents.a, triangleComponents.i2, centroid),
        triangleFromVertices(triangleComponents.i2, triangleComponents.b, centroid),
        triangleFromVertices(triangleComponents.b, triangleComponents.i3, centroid),
        triangleFromVertices(triangleComponents.i3, triangleComponents.c, centroid),
        triangleFromVertices(triangleComponents.c, triangleComponents.i1, centroid),
    ]
}

function subdivide36(triangleComponents, centroid) {
    const thirtySix = [];
    subdivide6(triangleComponents, centroid).forEach(triangle => {
        const subTriangleComponents = subdivideTriangle(triangle);
        const subCentroid = centroidFromTriangle(triangle);
        return thirtySix.push(...subdivide6(subTriangleComponents, subCentroid))
    });
    return thirtySix;
}

function pickGeometry(geometries) {
    return randomArrayVal(geometries[C.SMALL][C.TALL][C.PRESENT])
}

function formatElement({ triangle, normal, centroid, allowedGeometries }) {
    if (triangle) centroid = centroidFromPoints(triangle.a, triangle.b, triangle.c);
    return {
        geometry: pickGeometry(allowedGeometries),
        centroid: centroid,
        normal: normal,
    }
}

function format36({ centroid, triangleComponents, normal, geometries }) {
    const allowedKeys = Object.keys(geometries).filter(k => k == C.SMALL); 
    const allowedGeometries = (({...allowedKeys}) => ({...allowedKeys}))(geometries);
    return subdivide36(triangleComponents, centroid).map(triangle => formatElement({ triangle, normal, allowedGeometries }));
}

function format6({ centroid, triangleComponents, normal, geometries }) {
    const allowedKeys = Object.keys(geometries).filter(k => k != C.EXTRA_LARGE); 
    const allowedGeometries = (({...allowedKeys}) => ({...allowedKeys}))(geometries);
    return subdivide6(triangleComponents, centroid).map(triangle => formatElement({ triangle, normal, allowedGeometries }));
}

function format1({ centroid, triangleComponents, normal, geometries }) {
    const allowedGeometries = geometries;
    return [formatElement({ normal, centroid, allowedGeometries })]
}



function pickFormation({ faceIndex, triangle, normal, centroid, geometriesByCategory, prevFormationId }) {
    // TODO some heuristic for which formations work best where
    const formation = {};
    const formationProps = {
        centroid: centroid,
        normal: normal,
        triangleComponents: subdivideTriangle(triangle),
        geometries: geometriesByCategory,
    }
    // TODO hack to sketch what this looks like...
    // formation.id = pickFormationId(prevFormationId);
    formation.id = THREE.Math.randInt(0, 3);
    // formation.id = 2;
    formation.centroid = centroid;
    
    if (faceIndex % 13 != 0) formation.elements = [];
    else {
        formation.elements = (() => {
            // formation.geometry = BufferGeometryUtils.mergeBufferGeometries((() => {
            switch (formation.id) {
                case 0: return [];
                case 1: return format1(formationProps);
                case 2: return format6(formationProps);
                case 3: return format36(formationProps);
            }
        })()
    }
    return formation;
}

export function generateFormations(surfaceGeometry, faceNormals, geometries) {
    const geometriesByCategory = generateBuildingsByCategory(geometries);
    const vertices = surfaceGeometry.vertices;
    const faces = surfaceGeometry.faces;
    const formations = {};
    let prevFormationId = 0;
    faces.forEach((face, faceIndex) => {
        const centroid = faceCentroid(face, vertices);
        const tId = tileId(centroid);
        const triangle = triangleFromFace(face, vertices);
        const normal = faceNormals[faceIndex];
        formations[tId] = pickFormation({ faceIndex, triangle, normal, centroid, geometriesByCategory, prevFormationId })
        prevFormationId = formations[tId].id;
    })
    return formations;
}