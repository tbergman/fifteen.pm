import React, { useEffect, useRef, useState } from 'react';
import { useRender, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { faceCentroid, getMiddle, triangleCentroid, triangleFromFace } from '../../Utils/geometry';

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

function withinBoundary(boundary, centroid, radius, maxDistance = 4) {
    return boundary.distanceTo(centroid) < maxDistance && hardLimitYFaces(centroid, radius);
}

function initFaceTile(face, centroid, triangle) {
    return {
        id: tileId(face),
        centroid: centroid,
        normal: face.normal,
        triangle: triangle,
        hasRendered: false,
        visible: false,
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

function bucketTiles(radius, tiles) {
    // 8 sections.
    //  (radius is divisible by 8...)
    const bucketedTiles = {};
    const sections = [];
    const sectionSize = 3; // (radius / 8)
    for (let y = 0; y < 8; y++) {
        const startYVal = y * sectionSize;
        const endYVal = startYVal + sectionSize;
        for (let z = 0; z < 8; z++) {
            const startZVal = z * sectionSize;
            const endZVal = startZVal + sectionSize;
            // positives and negatives
            sections.push(
                {
                    minY: startYVal,
                    maxY: endYVal,
                    minZ: startZVal,
                    maxZ: endZVal,
                },
                {
                    minY: -endYVal,
                    maxY: -startYVal,
                    minZ: -endZVal,
                    maxZ: -startZVal,
                },
                {
                    minY: startYVal,
                    maxY: endYVal,
                    minZ: -endZVal,
                    maxZ: -startZVal,
                },
                {
                    minY: -endYVal,
                    maxY: -startYVal,
                    minZ: startZVal,
                    maxZ: endZVal,
                }
            )
        }
    }
    for (let i = 0; i < sections.length; i++) {
        bucketedTiles[i] = [];
    }
    Object.values(tiles).forEach(tile => {
        sections.forEach((section, index) => {
            if (tile.centroid.x < section.maxY && tile.centroid.x >= section.minY &&
                tile.centroid.z < section.maxZ && tile.centroid.z >= section.minZ) {
                bucketedTiles[index].push(tile);
            }
        })
    })
    return [bucketedTiles, sections];
}

// https://discourse.threejs.org/t/raycast-objects-that-arent-in-scene/6704/4 
// view-source:https://rawgit.com/pailhead/three.js/instancing-part2-200k-instanced/examples/webgl_interactive_cubes.html
// https://medium.com/@pailhead011/instancing-with-three-js-part-2-3be34ae83c57
export function TileGenerator({ radius, sides, tiers, tileComponent, geometries, startPos, maxHeight }) {
    const { camera, scene, raycaster } = useThree();
    const [lastUpdateTime, setLastUpdateTime] = useState(0);
    const section = useRef(0);
    // const [section.current, setCurrentSection] = useState(0);
    const bucketedTiles = useRef({});
    const sections = useRef([]);
    const boundary = useRef(new THREE.Vector3().copy(startPos));
    const prevBoundary = useRef(boundary.current.clone());
    const tilesGroup = useRef(new THREE.Group());
    const allTiles = useRef([]);
    const visibleTiles = useRef([]);
    const boundaryMax = 10;
    let sphereGeometry = new THREE.SphereGeometry(radius, sides, tiers);
    sphereGeometry = variateSphereFaceHeights({ sphereGeometry, radius, sides, tiers, maxHeight });
    useEffect(() => {
        allTiles.current = generateTiles(sphereGeometry, startPos);
        visibleTiles.current = Object.values(allTiles.current).filter(tile => {
            if (withinBoundary(startPos, tile.centroid, radius, boundaryMax)) {
                tile.visible = true;
                return tile;
            }
        });
        [bucketedTiles.current, sections.current] = bucketTiles(radius, allTiles.current);
        // console.log("bucketed tiles", bucketedTiles.current)
        section.current = 0;
    }, [])


    useRender((state, time) => {
        const rotXDelta = .0001;
        tilesGroup.current.rotation.x += rotXDelta; // TODO these are just mimicking rotation in world, no bueno
        // tilesGroup.current.rotation.x = tilesGroup.current.rotation.x % (2 * Math.PI);
        // tilesGroup.current.rotation.z = raycaster.ray.direction.x; // TODO these are just mimicking rotation in world, no bueno
        // tilesGroup.current.rotation.z = tilesGroup.current.rotation.z % (2 * Math.PI);
        const xRadiansRot = tilesGroup.current.rotation.x;
        // const zRadiansRot = tilesGroup.current.rotation.z;
        const curZOffset = Math.cos(xRadiansRot) * radius;
        const curYOffset = Math.sin(xRadiansRot) * radius;
        // const curXOffset = Math.sin(zRadiansRot) * radius;
        // boundary.current.x = -curXOffset;
        boundary.current.z = -curZOffset;
        boundary.current.y = -curYOffset;
        // let maxY, maxZ, minY, minZ;
        // TODO maybe this will just work with one dimension?
        // TODO bug... it's late
        // if (!section.current) section.current = 0;   

        // const previousSection = section.current;
        // for (let i = 0; i < sections.current.length; i++) {
        //     if (boundary.current.z < sections.current[i].maxZ &&
        //         boundary.current.z >= sections.current[i].minZ &&
        //         boundary.current.y < sections.current[i].maxY &&
        //         boundary.current.y >= sections.current[i].minY) {
        //         if (section.current !== i) {
        //             // bucketedTiles.current[previousSection].forEach(tile => {
        //             //     tile.visible = false;
        //             // }) // TODO fix turning off
        //             section.current = i;
        //             visibleTiles.current = bucketedTiles.current[section.current].map(tile => {
        //                 console.log("TLIE", tile);
        //                 if (tile.visible === true) tile.hasRendered = true;
        //                 else tile.visible = true;
        //                 return tile;
        //             });
        //             console.log('visible tiles', visibleTiles.current);
        //         }
        //         prevBoundary.current.copy(boundary.current);
        //     }
        // }
        // if (section.current !== previousSection) setLastUpdateTime(time);
        if (prevBoundary.current.distanceTo(boundary.current) > .5) {
            setLastUpdateTime(time);
            visibleTiles.current = Object.values(allTiles.current).filter(tile => {
                // TODO this could all be calculated once rather than interated thru once it's working...
                // (just calculate different tile groups for each boundary in a map)
                if (withinBoundary(boundary.current, tile.centroid, radius, boundaryMax)) {
                    if (tile.visible === true) tile.hasRendered = true;
                    else tile.visible = true;
                    // if (!maxZ || tile.centroid.z > maxZ) maxZ = tile.centroid.z;
                    // if (!maxY || tile.centroid.y > maxY) maxY = tile.centroid.y;
                    // if (!minZ || tile.centroid.z < minZ) minZ = tile.centroid.z;
                    // if (!minY || tile.centroid.y < minY) minY = tile.centroid.y;
                    return tile;
                } else {
                    // TODO these are not going to get passed thru this is placeholder 
                    allTiles.current[tile.id].visible = false;
                }
            })
            prevBoundary.current.copy(boundary.current);
        }
    });

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

