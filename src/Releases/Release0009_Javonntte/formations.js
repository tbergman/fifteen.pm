import * as THREE from 'three';
import { faceCentroid, subdivideTriangle, triangleCentroid as centroidFromTriangle, triangleCentroidFromVertices as centroidFromPoints, triangleFromFace, triangleFromVertices } from '../../Utils/geometry';
import { randomArrayVal, selectNRandomFromArray, randomPointsOnSphere } from '../../Utils/random';
import { generateTiles, generateDispersedTiles } from '../../Utils/SphereTiles';
import { loadKDTree, findNearest } from '../../Utils/KdTree';
import { groupBuildingGeometries } from './buildings';
import * as C from './constants';
import { tileId } from '../../Utils/tiles';

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
    subdivide6(triangleComponents, centroid).forEach(subTriangle => {
        const subTriangleComponents = subdivideTriangle(subTriangle);
        const subCentroid = centroidFromTriangle(subTriangle);
        return thirtySix.push(...subdivide6(subTriangleComponents, subCentroid))
    });
    return thirtySix;
}

function formatElement({ triangle, normal, centroid, geometry }) {
    if (triangle) centroid = centroidFromPoints(triangle.a, triangle.b, triangle.c);
    return {
        geometry: geometry,
        centroid: centroid,
        normal: normal,
    }
}

function format36({ geometries, normal, centroid, triangle }) {
    const subdividedTriangle = subdivideTriangle(triangle);
    const randGeoms = selectNRandomFromArray(geometries, 36)
    return subdivide36(subdividedTriangle, centroid).map((triangle, idx) => formatElement({ triangle, normal, geometry: randGeoms[idx] }));
}

function format6({ geometries, normal, centroid, triangle }) {
    const subdividedTriangle = subdivideTriangle(triangle);
    const randGeoms = selectNRandomFromArray(geometries, 6)
    return subdivide6(subdividedTriangle, centroid).map((triangle, idx) => formatElement({ triangle, normal, geometry: randGeoms[idx] }));
}

function format1({ geometries, normal, centroid }) {
    return [formatElement({ normal, centroid, geometry: randomArrayVal(geometries) })]
}

function pickSubdivisionBucket(triangle) {
    const area = triangle.getArea();
    // TODO choose subdivision size based on size of triangle?
    const ratio = area / C.ASTEROID_MAX_RADIUS;
    // console.log("RATIO", ratio);
    // if (ratio > .25) return 36;
    // if (ratio > .2) return [6, 36][THREE.Math.randInt(0, 1)];
    return [1, 6, 36][THREE.Math.randInt(0, 1)] // don't do 36...
}

function pickFootprint(tile) {
    // TODO don't populate if it's this close to pole
    // const poleLimit = C.ASTEROID_MAX_RADIUS - C.ASTEROID_MAX_RADIUS * .99 + Math.random() * .1;
    // const distToPole = C.ASTEROID_MAX_RADIUS - Math.abs(tile.centroid.y);
    // const closeToPole = distToPole < poleLimit;
    // return closeToPole ? C.SMALL : C.WIDTH_BUCKETS[THREE.Math.randInt(0, C.WIDTH_BUCKETS.length - 1)];
    return C.BUILDING_WIDTH_BUCKETS[THREE.Math.randInt(0, C.BUILDING_WIDTH_BUCKETS.length - 1)];
}

function pickHeight(tile, neighborhoodCentroid, neighborhoodRadius) {
    const relativeDistFromNeighborhoodCenter = neighborhoodCentroid.distanceTo(tile.centroid) / neighborhoodRadius;
    return relativeDistFromNeighborhoodCenter > .5 ? C.SHORT : C.TALL;
}

function filterGeometries(tile, neighborhoodCentroid, neighborhoodRadius, geometries) {
    const footprint = pickFootprint(tile);
    const height = pickHeight(tile, neighborhoodCentroid, neighborhoodRadius);
    return geometries[footprint][height];
}

function formatTile(tile, neighborhoodCentroid, neighborhoodRadius, geometries) {
    const allowedGeometries = filterGeometries(tile, neighborhoodCentroid, neighborhoodRadius, geometries);
    const subdivisionBucket = pickSubdivisionBucket(tile.triangle);
    const formationProps = { geometries: allowedGeometries, ...tile };
    const formation = (() => {
        switch (subdivisionBucket) {
            case 1: return format1(formationProps);
            case 6: return format6(formationProps);
            case 36: return format36(formationProps);
        }
    })().filter(f => f.geometry && THREE.Math.randInt(0, 20) > 1); // Add chaos monkey removal of random subdivisions and only add if geom exists
    return formation;
}

export function generateTileFormations(surface, geometries, neighborhoods) {
    const tiles = neighborhoods.generateTiles({surface});
    const kdTree = loadKDTree(tiles);
    const formations = {}
    Object.keys(tiles).forEach(id => formations[id] = []);
    const geometriesByCategory = groupBuildingGeometries(geometries);
    neighborhoods.getCentroids({surface, tiles}).forEach(neighborhoodCentroid => {
        const [neighborhoodRadius, neighbors] = findNearest(neighborhoodCentroid, kdTree, neighborhoods.maxSize, neighborhoods.maxRadius, tiles);
        Object.values(neighbors).forEach(neighbor => {
            // if already assigned, 50% chance of replacement
            const id = neighbor.id;
            const replace = !formations[id].length || formations[id] && THREE.Math.randInt(0, 1) == 1;
            if (replace && neighborhoods.rules(neighbor)) {
                formations[id] = formatTile(neighbor, neighborhoodCentroid, neighborhoodRadius, geometriesByCategory);
            }
        });
    });
    return formations;
}


// TODO just copying piecemail from the above function; this can all get cleaned up and/or combined
// export function generateFormationsFromFaces(faceGroups, vertexGroups, geometries, neighborhoods) {
//     const tiles = generateDispersedTiles(faceGroups, vertexGroups);
//     const kdTree = loadKDTree(tiles);
//     const formations = {}
//     Object.keys(tiles).forEach(tileId => formations[tileId] = []);
//     const geometriesByCategory = groupBuildingGeometries(geometries);
//     const randomTiles = selectNRandomFromArray(Object.values(tiles).map(v => v), neighborhoods.count)
//     randomTiles.forEach(tile => {
//         // TODO oof need to refactor so you can do kdTree.findNearest here
//         const [neighborhoodRadius, neighbors] = findNearest(tile.centroid, kdTree, neighborhoods.maxSize, neighborhoods.maxRadius, tiles);
//         Object.values(neighbors).forEach(neighbor => {
//             // if already assigned, 50% chance of replacement
//             const id = neighbor.id;
//             const replace = !formations[id].length || formations[id] && THREE.Math.randInt(0, 1) == 1;
//             if (replace) {
//                 formations[id] = formatTile(neighbor, tile.centroid, neighborhoodRadius, geometriesByCategory);
//             }
//         });
//     });
//     return formations;
// }