import React from 'react';
import * as THREE from 'three';
import { useResource } from 'react-three-fiber';
import { MemoizedTile } from '../../Utils/TileGenerator';
import { Buildings, Building } from "./buildings";
import { Face, faceName } from "./face";
import { faceCentroid } from "../../Utils/geometry"

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


// https://codesandbox.io/s/react-three-fiber-suspense-gltf-loader-l900i
// endless roller: https://jsfiddle.net/juwalbose/bk4u5wcn/embedded/
// TODO generalize parameters
export function World({ worldRadius, sides, tiers, buildingGeometries, worldPos, maxHeight }) {
    // const [geometryRef, geometry] = useResource();
    let sphereGeometry = new THREE.SphereGeometry(worldRadius, sides, tiers);
    let sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xfffafa, flatShading: THREE.FlatShading, vertexColors: THREE.FaceColors })
    // sphereGeometry = variateSphereFaceHeights({sphereGeometry, worldRadius, sides, tiers, maxHeight});
    console.log("RENDER WORLD");
    return <group>
        <mesh
            geometry={sphereGeometry}
            material={sphereMaterial}
            castShadow
            receiveShadow
            rotation-z={-Math.PI / 2}
            // position={worldPos}
        />
        {buildingGeometries && sphereGeometry.faces.map(face => {
            const vertices = sphereGeometry.vertices;
            // console.log("--")
            const centroid = faceCentroid(face, vertices)
            // console.log(centroid);
            // centroid.subVectors(centroid, worldPos);
            // console.log(centroid);
            return <group key={faceName(face)}>
                <Face
                    buildingGeometries={buildingGeometries}
                    centroid={centroid}
                    normal={face.normal}
                    triangle={new THREE.Triangle(
                        vertices[face.a],
                        vertices[face.b],
                        vertices[face.c])}
                />
            </group>
        })
        }
    </group>
}


/*        // TODO remove (what do the faces look like)
        const a = vertices[faces[i].a];
        const b = vertices[faces[i].b];
        const c = vertices[faces[i].c];
        const tmpVertices = new Float32Array(
            [a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z]
        );
        const line = lineSegmentFromVertices(tmpVertices);
 */