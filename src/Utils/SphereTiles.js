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

function triangleInFrustum(frustum, triangle){
    if (frustum.containsPoint(triangle.a)) return true;
    if (frustum.containsPoint(triangle.b)) return true;
    if (frustum.containsPoint(triangle.c)) return true;
    return false;
}

// function findNearest(camera, position, kdTree, numMatches, maxDistance, tileLookup) {
function findNearest(position, kdTree, numMatches, maxDistance, tileLookup) {
    const matchingTiles = [];
    // take the nearest 200 around them. distance^2 'cause we use the manhattan distance and no square is applied in the distance function
    const positionsInRange = kdTree.nearest([position.x, position.y, position.z], numMatches, maxDistance);
    // var positionsInRange = kdTree.nearest([position.x, position.y, position.z], numMatches, maxDistance);
    // const frustum = new THREE.Frustum();
    // const projScreenMatrix = new THREE.Matrix4();
// console.log(frustum, camera.projectionMatrix, camera.matrixWorldInverse);
    // projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    // frustum.setFromMatrix(projScreenMatrix);
    for (var i = 0, il = positionsInRange.length; i < il; i++) {
        const kdNode = positionsInRange[i];
        const objectPoint = new THREE.Vector3().fromArray(kdNode[0].obj);
        const tId = tileId(objectPoint);
        const tile = tileLookup[tId];

        // Sometimes tile is undefined because of floating point differences between kdTree results and original vals
        if (tile){//} && triangleInFrustum(frustum, tile.triangle)){
            matchingTiles.push(tile);
        }
    }
    return matchingTiles;
}

export function SphereTiles({ rotation, sphereGeometry, tileComponent, tileElements }) {
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
        const worldPos = cameraRaycaster.ray.at(radius / 5, inFrontOfCamera);
        // const sphereRelativePos = new THREE.Vector3(
        //  worldPos.x - Math.sin(rotation.z) * radius,
        //  worldPos.y - Math.sin(rotation.x) * radius,
        //  worldPos.z - Math.cos(rotation.x) * radius,
        // worldPos.x * Math.cos(rotation.x) - worldPos.y * Math.sin(rotation.x),
        // worldPos.y * Math.cos(rotation.x) - worldPos.x * Math.sin(rotation.x),
        // worldPos.z,
        // )
        // console.log(rotation, sphereRelativePos);
        // return sphereRelativePos;
        return worldPos;
    }

    useEffect(() => {
        allTiles.current = generateTiles(sphereGeometry);
        kdTree.current = loadKDTree(allTiles.current);
    }, [])

    useRender((state, time) => {
        if ((time % .05).toFixed(2) == 0) {
            searchPosition.current = getSearchPosition();
        }
        if (prevSearchPosition.current.distanceTo(searchPosition.current) > 2 * Math.PI / radius) {
            const allClosestTiles = findNearest(searchPosition.current, kdTree.current, numMatches, maxDistance, allTiles.current);
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

