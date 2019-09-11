import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, useRender } from 'react-three-fiber';
import { faceCentroid, triangleFromFace } from '../../Utils/geometry';
import { SphereTileGenerator, tileId } from '../../Utils/SphereTileGenerator';
import "./index.css";
import { pickTileFormation } from "./tiles";


// TODO tilt and rotationSpeed
export function generateWorldGeometry(radius, sides, tiers, maxHeight) {
    const geometry = new THREE.SphereGeometry(radius, sides, tiers);
    geometry.computeBoundingSphere();
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
    return geometry;
}

// TODO this function needs to be passed to the SphereTileGenerator and folded into its logic somehow so that 
// we aren't creating tileIds in two locations and leaving room for errors
export function generateWorldTilePatterns(sphereGeometry, surfaceGeometries) {
    const vertices = sphereGeometry.vertices;
    const lookup = {};
    sphereGeometry.faces.forEach(face => {
        // TODO one way to pass this logic into SphereTileGenerator is to just use this part
        // but need to decide if knowledge of neighbor patterns matters (for now, no...)
        const triangle = triangleFromFace(face, vertices);
        const centroid = faceCentroid(face, vertices);
        const tId = tileId(centroid);
        lookup[tId] = pickTileFormation({ triangle, centroid, geometries: surfaceGeometries })
    })
    return lookup;
}


export function WorldSurface({ geometry, material }) {
    return <mesh
        geometry={geometry}
        material={material}
    />
}

export function World({ sphereGeometry, surfaceMaterial, ...props }) {
    const { camera } = useThree();
    const [renderTiles, setRenderTiles] = useState(true);
    const distThreshold = sphereGeometry.parameters.radius + sphereGeometry.parameters.radius * .1;
    // TODO what should be rendered if we're far from the sphere?
    useRender((state, time) => {
        if ((time % .05).toFixed(2) == 0) {
            const distToCenter = camera.position.distanceTo(sphereGeometry.boundingSphere.center);
            const tooFarAway = distToCenter > distThreshold;
            setRenderTiles(!tooFarAway);
        }
    })
    return <group>
        <WorldSurface
            geometry={sphereGeometry}
            material={surfaceMaterial}
        />
        {renderTiles && <SphereTileGenerator
            sphereGeometry={sphereGeometry}
            {...props}
        />}
    </group>
}