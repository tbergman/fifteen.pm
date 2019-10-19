import * as THREE from 'three';
import { faceCentroid, subdivideTriangle, triangleCentroid as centroidFromTriangle, triangleCentroidFromVertices as centroidFromPoints, triangleFromFace, triangleFromVertices } from '../../Utils/geometry';
import { randomArrayVal, selectNRandomFromArray, randomPointsOnSphere } from '../../Utils/random';
import { generateTiles, generateTilesFromFacesAndVertices } from '../../Utils/SphereTiles';
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

// TODO tmp hack - this needs to be passed in so that it's shared by the Road component
const steps = [
    new THREE.Vector3(C.WORLD_RADIUS, 0, 0),
    new THREE.Vector3(3 * C.WORLD_RADIUS/4, 0, 3 * C.WORLD_RADIUS/4),
    new THREE.Vector3(C.WORLD_RADIUS/2, 0, C.WORLD_RADIUS/2),
    new THREE.Vector3(C.WORLD_RADIUS/4, 0, C.WORLD_RADIUS/4),
    new THREE.Vector3(0, 0, C.WORLD_RADIUS),
    new THREE.Vector3(3 * -C.WORLD_RADIUS/4, 0, 3 * C.WORLD_RADIUS/4), 
    new THREE.Vector3(-C.WORLD_RADIUS/2, 0, C.WORLD_RADIUS/2), 
    new THREE.Vector3(-C.WORLD_RADIUS/4, 0, C.WORLD_RADIUS/4), 
    new THREE.Vector3(-C.WORLD_RADIUS, 0, 0),
    new THREE.Vector3(3 * -C.WORLD_RADIUS/4, 0, 3 * -C.WORLD_RADIUS/4), 
    new THREE.Vector3(-C.WORLD_RADIUS/2, 0, -C.WORLD_RADIUS/2), 
    new THREE.Vector3(-C.WORLD_RADIUS/4, 0, -C.WORLD_RADIUS/4), 
    new THREE.Vector3(0, 0, -C.WORLD_RADIUS), 
    new THREE.Vector3( 3 * C.WORLD_RADIUS/4, 0, 4 * -C.WORLD_RADIUS/4),
    new THREE.Vector3(C.WORLD_RADIUS/2, 0, -C.WORLD_RADIUS/2),
    new THREE.Vector3(C.WORLD_RADIUS/4, 0, -C.WORLD_RADIUS/4),
]
// TODO these filter values need to be relative to the world radius.
function onPath(centroid){
    return steps.map(step => centroid.distanceTo(step)).filter(f => f < C.WORLD_ROAD_WIDTH).length > 0; // TODO ROAD_WIDTH passed in
}
function tooFar(centroid){
    return steps.map(step => centroid.distanceTo(step)).filter(f => f > C.WORLD_BUILDING_CORRIDOR_WIDTH).length == steps.length;
}


export function generateTileFormations( surfaceGeometry, geometries, neighborhoodProps) {
    const tiles = generateTiles(surfaceGeometry);
    const kdTree = loadKDTree(tiles);
    const formations = {}
    Object.keys(tiles).forEach(id => formations[id] = []);
    const geometriesByCategory = groupBuildingGeometries(geometries);
    const sphereCenter = new THREE.Vector3();
    surfaceGeometry.boundingBox.getCenter(sphereCenter);
    randomPointsOnSphere(C.ASTEROID_MAX_RADIUS, sphereCenter, neighborhoodProps.count).forEach(neighborhoodCentroid => {
        // TODO oof need to refactor so you can do kdTree.findNearest here
        const [neighborhoodRadius, neighbors] = findNearest(neighborhoodCentroid, kdTree, neighborhoodProps.maxSize, neighborhoodProps.maxRadius, tiles);
        Object.values(neighbors).forEach(neighbor => {
            // if already assigned, 50% chance of replacement
            const id = neighbor.id;
            // colors={track.theme.starColors}


            const replace = !formations[id].length || formations[id] && THREE.Math.randInt(0, 1) == 1;
            if (replace && !onPath(neighbor.centroid) && !tooFar(neighbor.centroid)) {
                formations[id] = formatTile(neighbor, neighborhoodCentroid, neighborhoodRadius, geometriesByCategory);
            }
        });
    });
    return formations;
}

// TODO just copying piecemail from the above function; this can all get cleaned up and/or combined
export function generateFormationsFromFaces(faceGroups, vertexGroups, geometries, neighborhoodProps) {
    const tiles = generateTilesFromFacesAndVertices(faceGroups, vertexGroups);
    const kdTree = loadKDTree(tiles);
    const formations = {}
    Object.keys(tiles).forEach(tileId => formations[tileId] = []);
    const geometriesByCategory = groupBuildingGeometries(geometries);
    const randomTiles = selectNRandomFromArray(Object.values(tiles).map(v => v), neighborhoodProps.count)
    randomTiles.forEach(tile => {
        // TODO oof need to refactor so you can do kdTree.findNearest here
        const [neighborhoodRadius, neighbors] = findNearest(tile.centroid, kdTree, neighborhoodProps.maxSize, neighborhoodProps.maxRadius, tiles);
        Object.values(neighbors).forEach(neighbor => {
            // if already assigned, 50% chance of replacement
            const id = neighbor.id;
            const replace = !formations[id].length || formations[id] && THREE.Math.randInt(0, 1) == 1;
            if (replace) {
                formations[id] = formatTile(neighbor, tile.centroid, neighborhoodRadius, geometriesByCategory);
            }
        });
    });
    return formations;
}