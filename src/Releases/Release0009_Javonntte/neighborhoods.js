import { isMobile } from '../../Utils/BrowserDetection'
import { generateTiles, generateDispersedTiles } from '../../Utils/SphereTiles';
import { randomPointsOnSphere, selectNRandomFromArray } from '../../Utils/random';
import * as THREE from 'three';
import * as C from './constants';


function onPath(centroid) {
    return C.WORLD_ROAD_PATH.map(step => centroid.distanceTo(step)).filter(f => f < C.WORLD_ROAD_WIDTH).length > 0; // TODO ROAD_WIDTH passed in
}
function tooFar(centroid) {
    return C.WORLD_ROAD_PATH.map(step => centroid.distanceTo(step)).filter(f => f > C.WORLD_BUILDING_CORRIDOR_WIDTH).length == C.WORLD_ROAD_PATH.length;
}

function sphereWorldNeighborhoodRules(neighbor) {
    return !onPath(neighbor.centroid) && !tooFar(neighbor.centroid)
}

function asteroidCentroids({tiles}) {
    const numRandPoints = C.NUM_ASTEROIDS * 5;
    const centroids = selectNRandomFromArray(Object.values(tiles).map(v => v), numRandPoints).map(tile => tile.centroid);
    return centroids;
}

function sphereCentroids({surface}) {
    const sphereCenter = new THREE.Vector3();
    surface.boundingBox.getCenter(sphereCenter);
    const numRandPoints = C.WORLD_RADIUS * 2;
    const centroids = randomPointsOnSphere(C.WORLD_RADIUS, sphereCenter, numRandPoints);
    return centroids;
}

export const worldNeighborhoods = {
    count: 100,
    maxSize: isMobile ? C.WORLD_RADIUS * 2 : Math.floor(C.WORLD_RADIUS) * 2,
    maxRadius: C.WORLD_RADIUS * 6, // Try to get this as low as possible after happy with maxSize (TODO there is probably a decent heuristic so you don't have to eyeball this)
    dispersed: true, // marking if the neighborhood is on a single world or not
    rules: sphereWorldNeighborhoodRules,
    getCentroids: sphereCentroids,
    generateTiles: generateTiles,
}

export const asteroidNeighborhoods = {
    count: 100,
    maxSize: isMobile ? C.ASTEROID_MAX_RADIUS * 2 : Math.floor(C.ASTEROID_MAX_RADIUS) * 2,
    maxRadius: C.ASTEROID_MAX_RADIUS * 6, // Try to get this as low as possible after happy with maxSize (TODO there is probably a decent heuristic so you don't have to eyeball this)
    dispersed: true, // marking if the neighborhood is on a single world or not
    rules: () => true,
    getCentroids: asteroidCentroids,
    generateTiles: generateDispersedTiles,
}
