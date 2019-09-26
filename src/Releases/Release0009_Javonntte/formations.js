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

function formatElement({ triangle, normal, centroid, geometries }) {
    if (triangle) centroid = centroidFromPoints(triangle.a, triangle.b, triangle.c);
    return {
        geometry: randomArrayVal(geometries),
        centroid: centroid,
        normal: normal,
    }
}

function format36({ geometries, normal, centroid, triangle }) {
    const subdividedTriangle = subdivideTriangle(triangle);
    return subdivide36(subdividedTriangle, centroid).map(triangle => formatElement({ triangle, normal, geometries }));
}

function format6({ geometries, normal, centroid, triangle }) {
    const subdividedTriangle = subdivideTriangle(triangle);
    return subdivide6(subdividedTriangle, centroid).map(triangle => formatElement({ triangle, normal, geometries }));
}

function format1({ geometries, normal, centroid }) {
    return [formatElement({ normal, centroid, geometries })]
}

function pickCategory() {
    return C.TILE_CATEGORIES[THREE.Math.randInt(0, C.TILE_CATEGORIES.length - 1)];
}

function pickSubdivisionBucket(triangle) {
    const area = triangle.getArea();
    // TODO choose subdivision size based on size of triangle?
    return [1, 6, 36][THREE.Math.randInt(0, 2)]
}

function pickFootprint(tile) {
    // TODO don't populate if it's this close to pole
    const closeToPole = Math.abs(tile.centroid.y) < C.WORLD_RADIUS * .98 + Math.random() * .1;
    return closeToPole ? C.SMALL : C.WIDTH_BUCKETS[THREE.Math.randInt(0, C.WIDTH_BUCKETS.length - 1)];
}

function pickHeight(tile, neighborhoodCentroid, neighborhoodRadius) {
    const relativeDistFromNeighborhoodCenter = neighborhoodCentroid.distanceTo(tile.centroid) / neighborhoodRadius;
    return relativeDistFromNeighborhoodCenter > .5 ? C.SHORT : C.TALL;
}

function filterGeometries(category, tile, neighborhoodCentroid, neighborhoodRadius, geometries) {
    const footprint = pickFootprint(tile);
    const height = pickHeight(tile, neighborhoodCentroid, neighborhoodRadius);
    return geometries[footprint][height][category];
}

function formatTile(category, tile, neighborhoodCentroid, neighborhoodRadius, geometries) {
    const allowedGeometries = filterGeometries(category, tile, neighborhoodCentroid, neighborhoodRadius, geometries);
    const subdivisionBucket = pickSubdivisionBucket(tile.triangle);
    const formationProps = { geometries: allowedGeometries, ...tile };
    const formation = (() => {
        switch (subdivisionBucket) {
            case 1: return format1(formationProps);
            case 6: return format6(formationProps);
            case 36: return format36(formationProps);
        }
    })().filter(f => f.geometry && THREE.Math.randInt(0, 10) > 1); // Add chaos monkey removal of random subdivisions and only add if geom exists
    return formation;
}

function randomPointsOnSphere(sphereCenter, numPoints) {
    const pointsOnSphere = [];
    for (let i = 0; i < numPoints; i++) {
        const point = randomSpherePoint(sphereCenter, C.WORLD_RADIUS);
        pointsOnSphere.push(point);
    }
    return pointsOnSphere;
}

export function generateFormations(surfaceGeometry, geometries, neighborhoodProps) {
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
        const category = pickCategory(neighborhoodCentroid);
        // TODO oof need to refactor so you can do kdTree.findNearest here
        const [neighborhoodRadius, neighbors] = findNearest(neighborhoodCentroid, kdTree, neighborhoodProps.maxSize, neighborhoodProps.maxRadius, tiles);
        Object.values(neighbors).forEach(neighbor => {
            // if already assigned, 50% chance of replacement
            const id = neighbor.id;
            const replace = !formations[id].length || formations[id] && THREE.Math.randInt(0, 1) == 1;
            if (replace) {
                formations[id] = formatTile(category, neighbor, neighborhoodCentroid, neighborhoodRadius, geometriesByCategory);
            }
        });
    });
    return formations;
}