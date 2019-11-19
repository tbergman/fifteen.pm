import React, { useContext, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { randomPointsOnSphere, randomArrayVal, selectNRandomFromArray } from '../../../Utils/random';
import * as C from '../constants';
import { MaterialsContext } from '../MaterialsContext';
import BuildingInstances from './BuildingInstances';
import { BuildingsContext } from './BuildingsContext';
import { generateTilesets } from './tiles';
import { faceCentroid } from '../../../Utils/geometry';

class WorldNeighborhoods {
    constructor(surface, theme) {
        this.surface = surface;
        this.theme = theme;
        this.count = 100;
        this.numTiles = Math.floor(C.WORLD_RADIUS) * 2
        this.maxRadius = C.WORLD_RADIUS * 6 // Try to get this as low as possible after happy with maxSize (TODO there is probably a decent heuristic so you don't have to eyeball this)
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
        const area = tile.triangle.getArea();
        const subdivisions = area > 14 ? 3 : 6;
        return {
            allowedBuildings: buildings.filter(building => {
                return C.WORLD_BUILDING_CATEGORIES[this.theme].includes(building.name)
            }),
            subdivisions: subdivisions,
        }
    }
}


export function generateSphereWorldGeometry(radius, sides, tiers, maxHeight) {
    const geometry = new THREE.SphereGeometry(radius, sides, tiers);
    // geometry.scale(2, 1, 1);
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

export function WorldSurface({ geometry, themeName }) {

    const { tron, ground29, ornateBrass2Tiledx10, facade12, rock19 } = useContext(MaterialsContext);

    const exteriorMaterial = useMemo(() => ({
        hell: ornateBrass2Tiledx10,
        night: ground29,
        day: rock19,
        sunset: facade12,
    }))
    return <>
        <group>
            <mesh
                geometry={geometry}
                material={tron}
            />
            <mesh
                geometry={geometry}
                material={exteriorMaterial[themeName]}
                receiveShadow
            />
        </group>
    </>
}

function WorldLights({ surface }) {
    const faces = surface.faces;
    const vertices = surface.vertices;
    const numLights = 10;
    const canShuffleArray = false;
    const randFaces = selectNRandomFromArray(faces, numLights, canShuffleArray);
    const centroids = randFaces.map(face => faceCentroid(face, vertices).add(face.normal.multiplyScalar(3)))

    return <>
        {centroids.map((centroid, idx) => {
            return <pointLight
                key={idx}
                position={centroid}
                color={[0x0f0, 0xffa500][THREE.Math.randInt(0, 1)]}
            />
        })}
    </>
}

export function World({ themeName, setReady }) {
    const { buildings, loaded: buildingsLoaded } = useContext(BuildingsContext);

    const [surface, meshes] = useMemo(() => {
        if (!buildingsLoaded) return [];

        const _surface = generateSphereWorldGeometry(
            C.WORLD_RADIUS,
            C.WORLD_SIDES,
            C.WORLD_TIERS,
            C.MAX_WORLD_FACE_HEIGHT,
        )

        const _meshes = {}
        C.THEME_NAMES.forEach(themeName => {
            const _neighborhoods = new WorldNeighborhoods(_surface, themeName);
            _meshes[themeName] = generateTilesets({ buildings, neighborhoods: [_neighborhoods] });
        })

        return [_surface, _meshes]
    }, [buildingsLoaded]);

    useEffect(() => {
        if (meshes) setReady(true);
    }, [meshes])

    return (
        <>
            {meshes &&
                <>
                    <WorldSurface geometry={surface} themeName={themeName} />
                    <WorldLights surface={surface} />
                    <BuildingInstances meshes={meshes} themeName={themeName} />
                </>
            }
        </>
    )
}