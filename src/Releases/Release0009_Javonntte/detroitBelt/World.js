import React, { useContext } from 'react';
import { useResource } from 'react-three-fiber';
import * as THREE from 'three';
import { isMobile } from '../../../Utils/BrowserDetection';
import { randomPointsOnSphere } from '../../../Utils/random';
import { generateTiles } from '../../../Utils/SphereTiles';
import * as C from '../constants';
import { MaterialsContext } from '../MaterialsContext';

export class WorldNeighborhoods {
    constructor() {
        this.count = 100;
        this.numTiles = Math.floor(C.WORLD_RADIUS) * 2
        this.maxRadius = C.WORLD_RADIUS * 6 // Try to get this as low as possible after happy with maxSize (TODO there is probably a decent heuristic so you don't have to eyeball this)
        this.surface = generateSphereWorldGeometry(
            C.WORLD_RADIUS,
            C.WORLD_SIDES,
            C.WORLD_TIERS,
            C.MAX_WORLD_FACE_HEIGHT,
        )
    }

    onPath(centroid) {
        return C.WORLD_ROAD_PATH.map(pointOnPath => centroid.distanceTo(pointOnPath))
            .filter(distFromPoint => distFromPoint < C.WORLD_ROAD_WIDTH)
            .length > 0;
    }
    tooClose(centroid) {
        return C.WORLD_ROAD_PATH.map(pointOnPath => centroid.distanceTo(pointOnPath))
            .filter(distFromPoint => distFromPoint > C.WORLD_BUILDING_CORRIDOR_WIDTH)
            .length == C.WORLD_ROAD_PATH.length;
    }

    /*
    Return true if we should render the neighbor
    */
    rules(neighbor) {
        return !this.onPath(neighbor.centroid) && !this.tooClose(neighbor.centroid)
    }

    getNeighborhoodCentroids({ surface }) {
        const sphereCenter = new THREE.Vector3();
        surface.boundingBox.getCenter(sphereCenter);
        const numRandPoints = C.WORLD_RADIUS * 2;
        const centroids = randomPointsOnSphere(C.WORLD_RADIUS, sphereCenter, numRandPoints);
        return centroids;
    }

    pickBuildings(tile, buildings) {
        const futureBuildings = buildings.filter(building => building.era == C.FUTURE);
        const area = tile.triangle.getArea();
        if (area > 14) {
            return {
                allowedBuildings: futureBuildings.filter(building => building.footprint == C.MEDIUM),
                subdivisions: 3
            }
        } else {
            return [{
                allowedBuildings: futureBuildings.filter(building => building.footprint === C.SMALL),
                subdivisions: 6
            },
            {
                allowedBuildings: futureBuildings.filter(building => building.footprint == C.MEDIUM),
                subdivisions: 1
            }][THREE.Math.randInt(0, 1)]
        }
    }
}


function generateSphereWorldGeometry(radius, sides, tiers, maxHeight) {
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

export function WorldSurface({ geometry, materialName }) {

    const { tron, ground29, ornateBrass2Tiledx10, rock19 } = useContext(MaterialsContext);
    function exteriorMaterial() {
        return {
            "ornateBrass2": ornateBrass2Tiledx10,
            "ground29": ground29,
            "rock19": rock19,
        }[materialName]
    }
    return <>
        <group>
            <mesh
                geometry={geometry}
                material={tron}
            />
            <mesh
                geometry={geometry}
                material={exteriorMaterial()}
                receiveShadow
            />
        </group>
    </>
}

