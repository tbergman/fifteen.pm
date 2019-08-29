import React from 'react';
import * as THREE from 'three';

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


// https://jsfiddle.net/juwalbose/bk4u5wcn/embedded/
// TODO generalize parameters
export function World({ worldRadius, sides, tiers, maxHeight }) {
    let sphereGeometry = new THREE.SphereGeometry(worldRadius, sides, tiers);
    let sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xfffafa, flatShading: THREE.FlatShading, vertexColors: THREE.FaceColors })
    // sphereGeometry = variateSphereFaceHeights({sphereGeometry, worldRadius, sides, tiers, maxHeight});
    // const world = new THREE.Mesh(sphereGeometry, sphereMaterial);
    // world.receiveShadow = true;
    // world.castShadow = false;
    // world.rotation.z = -Math.PI / 2;
    // world.position.y = -24;
    // world.position.z = 2;
    // return world;
    return <mesh
        geometry={sphereGeometry}
        material={sphereMaterial}
        castShadow
        receiveShadow
        rotation-z={-Math.PI / 2}
        position-y={-24}
        position-z={2}
    />
}