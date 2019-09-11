import React, { useEffect, useRef, useState } from 'react';
import { useRender, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { TypedArrayUtils } from 'three-full';
import { faceCentroid, triangleFromFace } from './geometry';

// we cut off the floating point length here to insure 99% match with the kdTree model (since the model can change the exact value a bit)
export const tileId = (centroid) => [centroid.x.toFixed(3), centroid.y.toFixed(3), centroid.z.toFixed(3)].join("_");

// TODO add back in
function hardLimitYFaces(centroid, radius) {
    // don't populate the tiny triangles on top of the sphere
    return Math.abs(centroid.y) < radius * .98 + Math.random() * .1;
}

function initFaceTile(face, centroid, triangle) {
    return {
        id: tileId(centroid),
        centroid: centroid,
        normal: face.normal,
        triangle: triangle,
        hasRendered: false,
        visible: true,//false, // TODO
    }
}

function generateTiles(sphereGeometry) {
    const vertices = sphereGeometry.vertices;
    const tiles = {}
    sphereGeometry.faces.forEach((face, index) => {
        const triangle = triangleFromFace(face, vertices);
        const centroid = faceCentroid(face, vertices);
        const tile = initFaceTile(face, centroid, triangle);
        const tId = tileId(centroid);
        tiles[tId] = tile;
    })
    return tiles;
}

//create particles with buffer geometry
var distanceFunction = function (a, b) {
    return Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2);
};

// TODO could make this hook :/
// TODO use loading state logic here (when we make it a hook)
function loadKDTree(tiles) {
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

function displayNearest(position, kdTree, numMatches, maxDistance, tileLookup) {
    const matchingTiles = [];
    // take the nearest 200 around them. distance^2 'cause we use the manhattan distance and no square is applied in the distance function
    var positionsInRange = kdTree.nearest([position.x, position.y, position.z], numMatches, maxDistance);
    for (var i = 0, il = positionsInRange.length; i < il; i++) {
        var kdNode = positionsInRange[i];
        var objectPoint = new THREE.Vector3().fromArray(kdNode[0].obj);
        const tId = tileId(objectPoint);
        const tile = tileLookup[tId];
        // Sometimes tile is undefined because of floating point differences between kdTree results and original vals
        if (tile) matchingTiles.push(tile);
    }
    return matchingTiles;
}

export function SphereTileGenerator({ sphereGeometry, tileComponent, tileElements }) {
    const { camera } = useThree();
    const [lastUpdateTime, setLastUpdateTime] = useState(0);
    const searchPosition = useRef(new THREE.Vector3());
    const prevSearchPosition = useRef(new THREE.Vector3());
    const tilesGroup = useRef(new THREE.Group());
    const allTiles = useRef([]);
    const kdTree = useRef();
    const closestTiles = useRef([]);
    const cameraRaycaster = new THREE.Raycaster;
    const inFrontOfCamera = new THREE.Vector3();
    const radius = sphereGeometry.parameters.radius;
    const maxDistance = Math.pow(radius / 2 * Math.PI, 2);
    const numMatches = 33; // TODO a prop (for kdTree) but > 100 might be too much for most comps...

    const getSearchPosition = () => {
        cameraRaycaster.setFromCamera(new THREE.Vector2(), camera);
        return cameraRaycaster.ray.at(radius / 5, inFrontOfCamera);
    }

    useEffect(() => {
        allTiles.current = generateTiles(sphereGeometry);
        kdTree.current = loadKDTree(allTiles.current);
    }, [])

    useRender((state, time) => {
        if ((time % .5).toFixed(1) == 0) {
            searchPosition.current = getSearchPosition();
        }
        if (prevSearchPosition.current.distanceTo(searchPosition.current) > radius / (2 * Math.PI)) {
            const allClosestTiles = displayNearest(searchPosition.current, kdTree.current, numMatches, maxDistance, allTiles.current);
            closestTiles.current = allClosestTiles;
            prevSearchPosition.current.copy(searchPosition.current);
            setLastUpdateTime(time); // TODO better way to set state??
        }
    });

    return <group ref={tilesGroup}>
        {closestTiles.current && closestTiles.current.map(props => {
            return <group key={props.id}>
                <MemoizedSphereTile
                    {...props}
                    tileElements={tileElements}
                    tileComponent={tileComponent}
                    tileId={props.id}
                />
            </group>
        })}
    </group>
}

export const MemoizedSphereTile = React.memo(props => {
    if (!props.visible) return null; // TODO remove?
    return <>{props.tileComponent(props)}</>;
}, props => !props.isRendered);

