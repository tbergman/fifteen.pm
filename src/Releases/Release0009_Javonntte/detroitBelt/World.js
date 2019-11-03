import React, { useContext } from 'react';
import { useResource } from 'react-three-fiber';
import * as THREE from 'three';
import { Ground29Material, TronMaterial } from '../../../Utils/materials';
import {MaterialsContext} from '../MaterialsContext';

export function generateSphereWorldGeometry(radius, sides, tiers, maxHeight) {
    const geometry = new THREE.SphereGeometry(radius, sides, tiers);
    // variate sphere heights
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
            vertexVector = geometry.vertices[i + vertexIndex].clone();
            if (j % 2 !== 0) {
                if (i == 0) {
                    firstVertexVector = vertexVector.clone();
                }
                nextVertexVector = geometry.vertices[i + vertexIndex + 1].clone();
                if (i == sides - 1) {
                    nextVertexVector = firstVertexVector;
                }
                lerpValue = (Math.random() * (0.75 - 0.25)) + 0.25;
                vertexVector.lerp(nextVertexVector, lerpValue);
            }
            heightValue = (Math.random() * maxHeight) - (maxHeight / 2);
            offset = vertexVector.clone().normalize().multiplyScalar(heightValue);
            geometry.vertices[i + vertexIndex] = (vertexVector.add(offset));
        }
    }
    geometry.verticesNeedUpdate = true;
    geometry.computeBoundingSphere();
    geometry.computeBoundingBox();
    return geometry;
}

export function WorldSurface({ geometry, color }) {
    const [tronMaterialRef, tronMaterial] = useResource();
    const [ground29MaterialRef, ground29Material] = useResource();
    const {tron, ground29} = useContext(MaterialsContext);
    return <>
            <group>
                <mesh
                    geometry={geometry}
                    material={tron}
                />
                <mesh
                    geometry={geometry}
                    material={ground29}
                    receiveShadow
                />
            </group>
    </>
}

