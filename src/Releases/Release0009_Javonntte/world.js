import React, { useEffect, useMemo, useRef } from 'react';
import { useResource } from 'react-three-fiber';
import * as THREE from 'three';
import { Ground29Material, TronMaterial } from '../../Utils/materials';
import Buildings from './Buildings';
import * as C from './constants';
import { generateTileset } from "./tiles";


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
    return <>
        <TronMaterial
            materialRef={tronMaterialRef}
            side={THREE.BackSide}
        />
        <Ground29Material
            materialRef={ground29MaterialRef}
            side={THREE.FrontSide}
            color={color}
        />
        {tronMaterial && ground29Material &&
            <group>
                <mesh
                    geometry={geometry}
                    material={tronMaterial}
                    receiveShadow
                />
                <mesh
                    geometry={geometry}
                    material={ground29Material}
                    receiveShadow
                />
            </group>
        }
    </>
}

export function World({ neighborhoods, surfaceColor }) {
    
    const sphereGeometry = useMemo(() => {
        return generateSphereWorldGeometry(
            C.WORLD_RADIUS,
            C.WORLD_SIDES,
            C.WORLD_TIERS,
            C.MAX_WORLD_FACE_HEIGHT,
        );
    });

    return <group >
        <WorldSurface geometry={sphereGeometry} color={surfaceColor} />
        <Buildings surface={sphereGeometry} neighborhoods={neighborhoods} />
    </group>
}
