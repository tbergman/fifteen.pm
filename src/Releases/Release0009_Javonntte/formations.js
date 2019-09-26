import * as THREE from 'three';
import { randomSpherePoint, faceCentroid, subdivideTriangle, triangleCentroid as centroidFromTriangle, triangleCentroidFromVertices as centroidFromPoints, triangleFromFace, triangleFromVertices } from '../../Utils/geometry';
import { randomArrayVal } from '../../Utils/random';
import { generateTiles } from '../../Utils/SphereTiles';
import { loadKDTree, findNearest } from '../../Utils/KdTree';
import { generateBuildingsByCategory } from './buildings';
import * as C from './constants';


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

function pickAllowedGeometries(profile, geometries) {
    return geometries;
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

function format36({ profile, geometries, normal, centroid, triangle }) {
    // TODO use pickAllowedGeometries
    const allowedKeys = Object.keys(geometries).filter(k => k == C.SMALL);
    const allowedGeometries = (({ ...allowedKeys }) => ({ ...allowedKeys }))(geometries);
    const subdividedTriangle = subdivideTriangle(triangle);
    return subdivide36(subdividedTriangle, centroid).map(triangle => formatElement({  triangle, normal, allowedGeometries }));
}

function format6({ profile, geometries, normal, centroid, triangle }) {
    // TODO use pickAllowedGeometries
    const allowedKeys = Object.keys(geometries).filter(k => k != C.EXTRA_LARGE);
    const allowedGeometries = (({ ...allowedKeys }) => ({ ...allowedKeys }))(geometries);
    const subdividedTriangle = subdivideTriangle(triangle);
    return subdivide6(subdividedTriangle, centroid).map(triangle => formatElement({  triangle, normal, allowedGeometries}));
}

function format1({ profile, geometries, normal, centroid }) {
    const allowedGeometries = pickAllowedGeometries(profile, geometries);
    return [formatElement({ normal, centroid, allowedGeometries })]
}

function pickSuperCategory() {
    return C.TILE_CATEGORIES[THREE.Math.randInt(0, C.TILE_CATEGORIES.length - 1)];
}


// TODO
function pickSubdivisionBucket() {
    return 36;
}

// TODO more fun to be had here...
function formatTile(superCategory, tile, neighborhoodCentroid, neighborhoodRadius, geometries) {
    // TODO don't populate if it's this close to pole
    const closeToPole = Math.abs(tile.centroid.y) < C.WORLD_RADIUS * .98 + Math.random() * .1;
    const footprint = closeToPole ? C.SMALL : C.SMALL; // TODO
    const relativeDistFromNeighborhoodCenter = neighborhoodCentroid.distanceTo(tile.centroid) / neighborhoodRadius;
    const height = relativeDistFromNeighborhoodCenter > .5 ? C.SHORT : C.TALL;
    const profile = {
        footprint: footprint,
        height: height,
        category: superCategory,
    }
    const subdivisionBucket = pickSubdivisionBucket(tile.triangle);
    const formationProps = { profile, geometries, ...tile };
    switch (subdivisionBucket) {
        case 1: return format1(formationProps);
        case 6: return format6(formationProps);
        case 36: return format36(formationProps);
    }

}

function randomPointsOnSphere(sphereCenter, numPoints) {
    const pointsOnSphere = [];
    for (let i = 0; i < numPoints; i++) {
        const point = randomSpherePoint(sphereCenter, C.WORLD_RADIUS);
        pointsOnSphere.push(point);
    }
    return pointsOnSphere;
}

export function generateFormations(surfaceGeometry, faceNormals, geometries, neighborhoodProps) {
    const tiles = generateTiles(surfaceGeometry);
    const kdTree = loadKDTree(tiles);
    const formations = {}
    Object.keys(tiles).forEach(tileId => {
        formations[tileId] = []
    });
    if (!surfaceGeometry.boundingBox) surfaceGeometry.computeBoundingBox();
    const sphereCenter = new THREE.Vector3();
    surfaceGeometry.boundingBox.getCenter(sphereCenter);
    const geometriesByCategory = generateBuildingsByCategory(geometries);
    randomPointsOnSphere(sphereCenter, neighborhoodProps.count).forEach(neighborhoodCentroid => {
        const superCategory = pickSuperCategory(neighborhoodCentroid);
        // TODO oof why not kdTree.findNearest
        const neighbors = findNearest(neighborhoodCentroid, kdTree, neighborhoodProps.maxSize, neighborhoodProps.maxRadius, tiles);
        Object.values(neighbors).forEach(neighbor => {
            // if already assigned, 50% chance of replacement
            const id = neighbor.id;
            const replace = !formations[id].length || formations[id] && THREE.Math.randInt(0, 1) == 1;
            if (replace) {
                formations[id] = formatTile(superCategory, neighbor, neighborhoodCentroid, neighborhoodProps.maxRadius, geometriesByCategory);
            }
        });
    });
    return formations;
}