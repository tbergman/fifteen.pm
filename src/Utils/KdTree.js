import { useState } from 'react';
import * as THREE from 'three';
import { TypedArrayUtils } from 'three-full';
import { tileId } from './tiles';

const distanceFunction = function (a, b) {
    return Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2);
};

export function loadKDTree(tiles) {
    const amountOfParticles = Object.keys(tiles).length;
    const positions = new Float32Array(amountOfParticles * 3);
    const alphas = new Float32Array(amountOfParticles);
    Object.values(tiles).forEach((tile, idx) => {
        positions[idx * 3] = tile.centroid.x
        positions[idx * 3 + 1] = tile.centroid.y
        positions[idx * 3 + 2] = tile.centroid.z
        alphas[idx] = 1.0;

    })
    // creating the kdtree takes a lot of time to execute, in turn the nearest neighbour search will be much faster
    const kdTree = new TypedArrayUtils.Kdtree(positions, distanceFunction, 3);
    return kdTree;
}

export const useKDTree = (tiles) => {
    const [loading, setLoading] = useState(false);
    const [kdTree, setKDTree] = useState(false);
    // const [loading, setLoading] = useState(false);
    // const [model, setModel] = useState(false);
    useEffect(() => {
        (async () => {
            setLoading(true);
            const kdTree = await loadKDTree(tiles);
            setKDTree(kdTree);
            setLoading(false);
        })();
    }, [tiles]);
    return [loading, kdTree]
}


// TODO This belongs as a method of a SphereTiles object that is refactored from ./tiles/generateTiles
// frustum culling widen buffer --> https://stackoverflow.com/questions/54826600/expand-scale-camera-frustum
export function findNearest(position, kdTree, numMatches, maxDistance, tileLookup) {
    const matchingTiles = [];
    // take the nearest n around them. distance^2 'cause we use the manhattan distance and no square is applied in the distance function
    const positionsInRange = kdTree.nearest([position.x, position.y, position.z], numMatches, maxDistance);
    let farthestMatch = 0;
    for (var i = 0, il = positionsInRange.length; i < il; i++) {
        const kdNode = positionsInRange[i];
        const objectPoint = new THREE.Vector3().fromArray(kdNode[0].obj);
        const tId = tileId(objectPoint);
        const tile = tileLookup[tId];
        // the distance is not the same as dist = objectPoint.distanceTo(position); i think it's normalized from 0-100
        const dist = kdNode[1];
        if (dist > farthestMatch) farthestMatch = dist;
        // Sometimes tile is undefined because of floating point differences between kdTree results and original vals
        if (tile) {
            matchingTiles.push(tile);
        }
    }
    const neighborhoodRadius = farthestMatch;
    return [neighborhoodRadius, matchingTiles];
}