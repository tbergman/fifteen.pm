import React, { useEffect, useRef, useState } from 'react';
import { useRender, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { TypedArrayUtils } from 'three-full';
import { faceCentroid, triangleFromFace } from '../../Utils/geometry';

// we cut off the floating point length here to insure 99% match with the kdTree model (since the model can change the exact value a bit)
const tileId = (centroid) => [centroid.x.toFixed(3), centroid.y.toFixed(3), centroid.z.toFixed(3)].join("_");


// TODO add back in
function hardLimitYFaces(centroid, radius) {
    // don't populate the tiny triangles on top of the sphere
    return Math.abs(centroid.y) < radius * .98 + Math.random() * .1;
}

function withinBoundary(boundary, centroid, radius, maxDistance = 4) {
    return boundary.distanceTo(centroid) < maxDistance && hardLimitYFaces(centroid, radius);
}

function initFaceTile(face, centroid, triangle) {
    return {
        id: tileId(centroid),
        centroid: centroid,
        normal: face.normal,
        triangle: triangle,
        hasRendered: false,
        visible: true,//false,
    }
}

function generateTiles(sphereGeometry) {
    const vertices = sphereGeometry.vertices;
    // const boundaryLimit = sphereGeometry.parameters.radius / 3; // TODO this is too big unless we do instancing
    const tiles = {}
    sphereGeometry.faces.forEach((face, index) => {
        const triangle = triangleFromFace(face, vertices);
        const centroid = faceCentroid(face, vertices);
        const tile = initFaceTile(face, centroid, triangle);
        // if (withinBoundary(boundary, centroid)) tile.visible = true; // TODO use tree!
        // const tId = tileId(face);
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

function displayNearest(camera, kdTree, numMatches, maxDistance, tileLookup) {
    const matchingTiles = [];
    // take the nearest 200 around them. distance^2 'cause we use the manhattan distance and no square is applied in the distance function
    const position = [camera.position.x, camera.position.y, camera.position.z];
    var positionsInRange = kdTree.nearest(position, numMatches, maxDistance);
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

export function SphereFileGenerator({ sphereGeometry, tileComponent, surfaceGeometries, startPos }) {
    const { camera } = useThree();
    const [lastUpdateTime, setLastUpdateTime] = useState(0);
    const boundary = useRef(new THREE.Vector3());
    const prevBoundary = useRef(new THREE.Vector3());
    const tilesGroup = useRef(new THREE.Group());
    const allTiles = useRef([]);
    console.log(sphereGeometry);
    const maxDistance = Math.pow(sphereGeometry.parameters.radius/4, 2);
    const numMatches = 100; // TODO a prop (for kdTree) but > 100 might be too much for most comps
    const kdTree = useRef();
    const closestTiles = useRef([]);
    useEffect(() => {
        allTiles.current = generateTiles(sphereGeometry);
        kdTree.current = loadKDTree(allTiles.current);
        boundary.current.copy(startPos);
        prevBoundary.current.copy(startPos);
    }, [])

    useRender((state, time) => {
        console.log(camera);
        // const rotXDelta = .0001;
        // tilesGroup.current.rotation.x += rotXDelta;
        boundary.current.copy(camera.position);
        if ((time % .001).toFixed(3) == 0) {
            // if (prevBoundary.current.distanceTo(boundary.current) > .5) {
            // TODO organize these args
            const allClosestTiles = displayNearest(camera, kdTree.current, numMatches, maxDistance, allTiles.current);
            // set some of these to not rerender here?
            // TODO setLastUpdateTime (below) seems to trigger an update but dont have access to changes to var
            // console.log('last update time', lastUpdateTime);
            // TODO turning renders on and off (cpu)
            // for (let i = 0; i < allClosestTiles.length; i++) {
            //     const tile = allClosestTiles[i];
            //     if (tile.timestamp === lastUpdateTime) tile.isRendered = true;
            //     else tile.isRendered = false;
            // }
            closestTiles.current = allClosestTiles;
            prevBoundary.current.copy(boundary.current);
            setLastUpdateTime(time);
        }
    });

    return <group ref={tilesGroup}>
        {closestTiles.current && closestTiles.current.map(props => {
            return <group key={props.id}>
                <MemoizedSphereTile
                    {...props}
                    buildingGeometries={surfaceGeometries}
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

