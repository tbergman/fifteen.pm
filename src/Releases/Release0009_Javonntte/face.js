import React, { useEffect, useRef, useState } from 'react';
import { useRender, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { faceCentroid, getMiddle, triangleCentroid, triangleFromFace } from '../../Utils/geometry';
import { Building, buildingName } from './buildings';
import { randomClone } from './utils';





export function tileId(face) {
    return [face.a, face.b, face.c].join("_");
}

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

function withinBoundary(boundary, centroid, boundaryLimit) {
    return Math.abs(boundary.distanceTo(centroid) < boundaryLimit);
}

function initFaceTile(face, centroid, triangle) {
    return {
        id: tileId(face),
        centroid: centroid,
        normal: face.normal,
        triangle: triangle,
        isInitialRender: true,
        visible: false,
        // mesh: mesh,
    }
}

function updateFaceTile(faceObj) {
    faceObj.visible = true;
    faceObj.isInitialRender = false;
    return faceObj;
}

function generateTiles(sphereGeometry, triangleGroup, boundary) {
    const vertices = sphereGeometry.vertices;
    const normal = new THREE.Vector3();
    const geom0 = new THREE.Geometry();
    const boundaryLimit = sphereGeometry.parameters.radius / 3; // TODO this is too big unless we do instancing
    const tiles = {}
    sphereGeometry.faces.forEach((face, index) => {
        const triangle = triangleFromFace(face, vertices);
        // const geom = geom0.clone();
        // geom.vertices.push(triangle.a);
        // geom.vertices.push(triangle.b);
        // geom.vertices.push(triangle.c);
        // triangle.getNormal(normal);
        // geom.faces.push(new THREE.Face3(0, 1, 2, normal));
        // const material = new THREE.MeshStandardMaterial({ color: 0x0000ff, transparent: true, opacity: 0.9, flatShading: THREE.FlatShading });
        // // const material = new THREE.MeshStandardMaterial({ color: 0xfffafa, flatShading: THREE.FlatShading })
        // const mesh = new THREE.Mesh(geom, material);
        // mesh.name = tileId(face);
        // mesh.userData = { face: face }
        // mesh.castShadow = true;
        // mesh.receiveShadow = true;
        // mesh.matrixWorldNeedsUpdate = true;
        const centroid = faceCentroid(face, vertices);
        // triangleGroup.current.add(mesh); // TODO optimiziation/instancing here?
        const tile = initFaceTile(face, centroid, triangle);
        if (withinBoundary(boundary.current, centroid, boundaryLimit)) tile.visible = true;
        const tId = tileId(face);
        tiles[tId] = tile;
    })
    return tiles;
}

function setupRaycasters(lookAts, camera) {
    const direction = new THREE.Vector3();
    const far = new THREE.Vector3();
    return lookAts.map(lookAt => {
        const raycaster = new THREE.Raycaster();
        raycaster.set(camera.position, direction.subVectors(lookAt.mesh.position, camera.position).normalize());
        raycaster.far = far.subVectors(lookAt.mesh.position, camera.position).length() + 3; // TODO added this random int currently this is FIFTY EIGHT raycasters this is not gonna work.
        return raycaster
    });
}

// https://discourse.threejs.org/t/raycast-objects-that-arent-in-scene/6704/4 
// view-source:https://rawgit.com/pailhead/three.js/instancing-part2-200k-instanced/examples/webgl_interactive_cubes.html
// https://medium.com/@pailhead011/instancing-with-three-js-part-2-3be34ae83c57
export function TileGenerator({ radius, sides, tiers, tileComponent, geometries, startPos, maxHeight }) {
    const { camera, scene, raycaster } = useThree();
    const [needsUpdate, setNeedsUpdate] = useState(false);
    // const faces = useRef({});
    const boundary = useRef(new THREE.Vector3);
    const raycasters = useRef([]);
    const tilesGroup = useRef(new THREE.Group());
    const allTiles = useRef([]);
    const allMeshes = useRef([]);
    const visibleTiles = useRef([]);
    let sphereGeometry = new THREE.SphereGeometry(radius, sides, tiers);
    sphereGeometry = variateSphereFaceHeights({ sphereGeometry, radius, sides, tiers, maxHeight });
    const vertices = sphereGeometry.vertices;
    const seenIds = []; // TODO optimize or rethink?

    useEffect(() => {
        boundary.current = startPos;
        allTiles.current = generateTiles(sphereGeometry, tilesGroup, boundary);
        // allMeshes.current = Object.values(allTiles.current).map(tile => tile.mesh);
        // scene.add(tilesGroup.current); // TODO point of optimization
        visibleTiles.current = Object.values(allTiles.current).filter(tile => tile.visible);
        // raycasters.current = setupRaycasters(visibleTiles.current, camera);
    }, [])

    useRender((state, time) => {
        tilesGroup.current.rotation.x -= .001; // TODO these are just mimicking rotation in world, no bueno
        tilesGroup.current.rotation.z = raycaster.ray.direction.x * .6; // TODO these are just mimicking rotation in world, no bueno
        // boundary.current += .1;
        // if (boundary.current % 1000){
        //     faces.current = updateFaceTiles(face.current)
        // }
        //  TODO is there a better way to bucket? Event detection?
        // if ((time % .001).toFixed(3) == 0) {
        // visibleTiles.current = Object.values(allTiles.current).filter(tile => tile.visible);
        // for (let i = 0; i < raycasters.current.length; i++) {
        // const intersects = raycasters.current[i].intersectObjects(allMeshes.current); // TODO should we be looking at other things to interesect? Using layers?
        // for (let i = 0; i < intersects.length; i++) {
        // const intersectedObj = intersects[i].object;
        // if (seenIds.indexOf(intersectedObj.name) < 0) {
        //     seenIds.push(intersectedObj.name);
        //     boundary.current = intersectedObj.position;
        //     // TODO state control for this component -- is this a usecase for useCallback? (so that faces is set by state?)
        //     setNeedsUpdate(true);
        //     const face = intersectedObj.userData.face;
        //     const tId = tileId(face);
        //     if (!allTiles.current.hasOwnProperty(tId)) {
        //         allTiles.current[tId] = updateFaceTile(allTiles.current[tId])
        //     } else {
        //         allTiles.current[tId] = initFaceTile(face, intersectedObj, vertices);
        //     }
        //     // faces.current = updateFaceTiles(faces.current, intersectedObj.userData.face, intersectedObj, vertices)
        //     setNeedsUpdate(false);
        // }
        // }
        // }
        // }
    });

    return <group ref={tilesGroup}>
        {visibleTiles.current && visibleTiles.current.map(props => {
            return <group key={props.id}>
                <MemoizedSphereTile
                    buildingGeometries={geometries}
                    tileComponent={tileComponent}
                    tileId={props.id}
                    {...props}
                />
            </group>
        })}
    </group>
}


export const MemoizedSphereTile = React.memo(props => {
    if (!props.visible) return null;
    return <>{props.tileComponent(props)}</>;
}, props => !props.hasRendered);

