import React, { useEffect, useRef, useState } from 'react';
import { useRender, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { faceCentroid, getMiddle, triangleCentroid, triangleFromFace } from '../../Utils/geometry';
import { Building, buildingName } from './buildings';
import { randomClone } from './utils';
import { lawOfSines } from "../../Utils/geometry";

const tileId = (face) => [face.a, face.b, face.c].join("_");

function variateSphereFaceHeights({ sides, tiers, maxHeight, worldRadius, sphereGeometry }) {
    var vertexIndex;
    var vertexVector = new THREE.Vector3();
    var nextVertexVector = new THREE.Vector3();
    var firstVertexVector = new THREE.Vector3();
    var offset = new THREE.Vector3();
    var currentTier = 1;
    var lerpValue = 0.5;
    var heightValue;
    for (var j = 1; j < tiers - 2; j++) {
        currentTier = j;
        for (var i = 0; i < sides; i++) {
            vertexIndex = (currentTier * sides) + 1;
            vertexVector = sphereGeometry.vertices[i + vertexIndex].clone();
            if (j % 2 !== 0) {
                if (i == 0) {
                    firstVertexVector = vertexVector.clone();
                }
                nextVertexVector = sphereGeometry.vertices[i + vertexIndex + 1].clone();
                if (i == sides - 1) {
                    nextVertexVector = firstVertexVector;
                }
                lerpValue = (Math.random() * (0.75 - 0.25)) + 0.25;
                vertexVector.lerp(nextVertexVector, lerpValue);
            }
            heightValue = (Math.random() * maxHeight) - (maxHeight / 2);
            offset = vertexVector.clone().normalize().multiplyScalar(heightValue);
            sphereGeometry.vertices[i + vertexIndex] = (vertexVector.add(offset));
        }
    }
    return sphereGeometry;
}


// TODO add back in
function hardLimitYFaces(centroid, radius) {
    // don't populate the tiny triangles on top of the sphere
    return Math.abs(centroid.y) < radius * .98 + Math.random() * .1;
}

function withinBoundary(boundary, centroid, radius, maxDistance=4) {
    return Math.abs(boundary.distanceTo(centroid) < maxDistance) && hardLimitYFaces(centroid, radius);
}

function initFaceTile(face, centroid, triangle) {
    return {
        id: tileId(face),
        centroid: centroid,
        normal: face.normal,
        triangle: triangle,
        hasRendered: false,
        visible: false,
        timestamp: 0,
        // mesh: mesh,
    }
}

function generateTiles(sphereGeometry, boundary) {
    const vertices = sphereGeometry.vertices;
    // const boundaryLimit = sphereGeometry.parameters.radius / 3; // TODO this is too big unless we do instancing
    const tiles = {}
    sphereGeometry.faces.forEach((face, index) => {
        const triangle = triangleFromFace(face, vertices);
        const centroid = faceCentroid(face, vertices);
        const tile = initFaceTile(face, centroid, triangle);
        if (withinBoundary(boundary, centroid)) tile.visible = true;
        const tId = tileId(face);
        tiles[tId] = tile;
    })
    return tiles;
}

function generateRaycastMeshes(sphereGeometry, startPos) {
    const subdivisionCount = 8;
    const subdivisions = {}
    const faceLookup = {};
    const tmpCount = {}; // TODO rm
    for (let i = 0; i < subdivisionCount; i++) {
        subdivisions[i] = new THREE.Geometry();
        faceLookup[i] = [];
        tmpCount[i] = 0;
    }
    const radius = sphereGeometry.parameters.radius;
    const vertices = sphereGeometry.vertices;
    const normal = new THREE.Vector3();
    sphereGeometry.faces.forEach(face => {
        const centroid = faceCentroid(face, vertices);
        const triangle = triangleFromFace(face, vertices)
        const geom = new THREE.Geometry();
        geom.vertices.push(triangle.a);
        geom.vertices.push(triangle.b);
        geom.vertices.push(triangle.c);
        triangle.getNormal(normal);
        geom.faces.push(new THREE.Face3(0, 1, 2, normal));
        // TODO cleanly divide these values?
        const dist = centroid.distanceTo(startPos);
        let key;
        // TODO make this dynamic....
        // TODO right now we are only hitting about 26 faces out of 3k :(
        if (dist < radius * .05) key = 0;
        else if (dist < radius * .1) key = 1;
        else if (dist < radius * .15) key = 2;
        else if (dist < radius * .2) key = 3;
        else if (dist < radius * .25) key = 4;
        else if (dist < radius * .33) key = 5;
        else if (dist < radius * 1.66) key = 6;
        else key = 7;
        tmpCount[key]++
        subdivisions[key].merge(geom);
        faceLookup[key].push(tileId(face));
        const s = new THREE.Spherical()
        console.log('centroid:', centroid);
    })
    const rayGroup = new THREE.Group()
    const rayMeshes = Object.keys(subdivisions).map(key => {
        const mesh = new THREE.Mesh(subdivisions[key]);
        mesh.name = key;
        rayGroup.add(mesh);
        return mesh;
    });
    return [rayMeshes, rayGroup, faceLookup]
}

function setupRaycasters(lookAts, camera) {
    const direction = new THREE.Vector3();
    const far = new THREE.Vector3();
    return lookAts.map(lookAt => {
        const raycaster = new THREE.Raycaster();
        raycaster.set(camera.position, direction.subVectors(lookAt.centroid, camera.position).normalize());
        raycaster.far = far.subVectors(lookAt.centroid, camera.position).length() + 3; // TODO added this random int currently this is FIFTY EIGHT raycasters this is not gonna work.
        return raycaster
    });
}

// https://discourse.threejs.org/t/raycast-objects-that-arent-in-scene/6704/4 
// view-source:https://rawgit.com/pailhead/three.js/instancing-part2-200k-instanced/examples/webgl_interactive_cubes.html
// https://medium.com/@pailhead011/instancing-with-three-js-part-2-3be34ae83c57
export function TileGenerator({ radius, sides, tiers, tileComponent, geometries, startPos, maxHeight }) {
    const { camera, scene, raycaster } = useThree();
    const [needsUpdate, setUpdated] = useState(false);
    const [lastRaycastFaceIdx, setLastRaycastFaceIdx] = useState();
    const [lastUpdateTime, setLastUpdateTime] = useState(0);
    // const [prevBoundary, setPrevBoundary] = useState(new THREE.Vector3().copy(startPos));
    const boundary = useRef(new THREE.Vector3().copy(startPos));//useRef(new THREE.Vector3);
    const prevBoundary = useRef(boundary.current.clone());
    const raycasters = useRef([]);
    const tilesGroup = useRef(new THREE.Group());
    const allTiles = useRef([]);
    const visibleTiles = useRef([]);
    const raycastMeshes = useRef([]);
    const raycastMeshesGroup = useRef([]);
    const faceLookup = useRef([]);
    // const visibleTiles = useRef([]);
    let sphereGeometry = new THREE.SphereGeometry(radius, sides, tiers);
    sphereGeometry = variateSphereFaceHeights({ sphereGeometry, radius, sides, tiers, maxHeight });
    const vertices = sphereGeometry.vertices;
    const seenIds = []; // TODO optimize or rethink?
    const spherical = new THREE.Spherical().setFromVector3(startPos);
    useEffect(() => {
        // boundary.current = startPos;
        allTiles.current = generateTiles(sphereGeometry, startPos);
        // allMeshes.current = Object.values(allTiles.current).map(tile => tile.mesh);
        // scene.add(tilesGroup.current); // TODO point of optimization
        // [raycastMeshes.current, raycastMeshesGroup.current, faceLookup.current] = generateRaycastMeshes(sphereGeometry, startPos);
        visibleTiles.current = Object.values(allTiles.current).filter(tile => {
            if (withinBoundary(startPos, tile.centroid, radius)) {
                tile.visible = true;
                return tile;
            }
            // else tile.visible = false;
        });
        // raycasters.current = setupRaycasters(visibleTiles.current, camera);
    }, [])

    // useEffect(() => {
    //     if (prevBoundary.distanceTo(boundary.current) > 5){
    //         setPrevBoundary(boundary.current)
    //         console.log("SET", prevBoundary, 'to', boundary)
    //     }        
    // }, [boundary])

    useRender((state, time) => {
        const rotXDelta = -.0001;
        tilesGroup.current.rotation.x += rotXDelta; // TODO these are just mimicking rotation in world, no bueno
        tilesGroup.current.rotation.x = tilesGroup.current.rotation.x % (2 * Math.PI);
        tilesGroup.current.rotation.z = raycaster.ray.direction.x * .6; // TODO these are just mimicking rotation in world, no bueno
        tilesGroup.current.rotation.z = tilesGroup.current.rotation.z % (2 * Math.PI);
        const xRadiansRot = tilesGroup.current.rotation.x;
        const zRadiansRot = tilesGroup.current.rotation.z;
        const xDegrees = xRadiansRot * 180 / Math.PI;
        const zDegrees = zRadiansRot * 180 / Math.PI;
        const curZOffset = Math.cos(xRadiansRot) * radius;
        const curYOffset = Math.sin(xRadiansRot) * radius;
        boundary.current.z = -curZOffset;
        boundary.current.y = -curYOffset;
        if (prevBoundary.current.distanceTo(boundary.current) > 1) {
            setLastUpdateTime(time);
            visibleTiles.current = Object.values(allTiles.current).filter(tile => {
                if (withinBoundary(boundary.current, tile.centroid, radius, 10)) {
                    console.log('current', boundary.current, 'xDegrees', xDegrees)
                    if (!seenIds.includes(tile.id)) {
                        seenIds.push(tile.id);
                    }
                    if (tile.visible === true) tile.hasRendered = true;
                    else tile.visible = true;
                    return tile;
                } else {
                    // TODO these are not going to get passed thru this is placeholder 
                    allTiles.current[tile.id].visible = false;
                }
            })
            prevBoundary.current.copy(boundary.current);
        }
    });

    console.log("RenderTiles", visibleTiles.current.length);
    return <group ref={tilesGroup}>
        {visibleTiles.current && visibleTiles.current.map(props => {
            return <group key={props.id}>
                <MemoizedSphereTile
                    {...props}
                    buildingGeometries={geometries}
                    tileComponent={tileComponent}
                    tileId={props.id}
                />
            </group>
        })}
    </group>
}


export const MemoizedSphereTile = React.memo(props => {
    if (!props.visible) return null;
    return <>{props.tileComponent(props)}</>;
}, props => !props.hasRendered);

