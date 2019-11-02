import React, { useContext, useEffect, useState } from 'react';
import * as THREE from 'three';
import { isMobile } from '../../../Utils/BrowserDetection';
import { randomPointsOnSphere, selectNRandomFromArray } from '../../../Utils/random';
import { generateTiles } from '../../../Utils/SphereTiles';
import * as C from '../constants';
import { AsteroidsSurface, generateAsteroids } from './Asteroids';
import { BuildingsContext } from './BuildingsContext';
import { generateTilesets } from './tiles';
import { generateSphereWorldGeometry, WorldSurface } from './World';

function onPath(centroid) {
    return C.WORLD_ROAD_PATH.map(pointOnPath => centroid.distanceTo(pointOnPath))
        .filter(distFromPoint => distFromPoint < C.WORLD_ROAD_WIDTH)
        .length > 0;
}
function tooClose(centroid) {
    return C.WORLD_ROAD_PATH.map(pointOnPath => centroid.distanceTo(pointOnPath))
        .filter(distFromPoint => distFromPoint > C.WORLD_BUILDING_CORRIDOR_WIDTH)
        .length == C.WORLD_ROAD_PATH.length;
}

/*
Return true if we should render the neighbor
*/
function sphereWorldNeighborhoodRules(neighbor) {
    return !onPath(neighbor.centroid) && !tooClose(neighbor.centroid)
}

function getAsteroidCentroids({ tiles, surface }) {
    const numRandPoints = surface.radius / 6; // TODO; use instance.radius
    const centroids = selectNRandomFromArray(Object.values(tiles).map(v => v), numRandPoints).map(tile => tile.centroid);
    return centroids;
}

function getWorldCentroids({ surface }) {
    const sphereCenter = new THREE.Vector3();
    surface.boundingBox.getCenter(sphereCenter);
    const numRandPoints = C.WORLD_RADIUS * 2;
    const centroids = randomPointsOnSphere(C.WORLD_RADIUS, sphereCenter, numRandPoints);
    return centroids;
}

function pickWorldBuildings(tile, buildings) {
    const futureBuildings = buildings.filter(building => building.era == C.FUTURE);
    const area = tile.triangle.getArea();
    if (area > 14) {
        return {
            allowedBuildings: futureBuildings.filter(building => building.footprint == C.MEDIUM),
            subdivisions: 3
        }
    } else {
        return {
            allowedBuildings: futureBuildings.filter(building => building.footprint === C.SMALL),
            subdivisions: 6
        }
    }
}

function pickAsteroidBuildings(tile, buildings) {
    const presentBuildings = buildings.filter(building => building.era === C.PRESENT);
    const area = tile.triangle.getArea();
    if (area > 14) {
        return {
            allowedBuildings: presentBuildings.filter(building => building.footprint == C.LARGE),
            subdivisions: 1
        }
    }
    else {
        return {
            allowedBuildings: presentBuildings.filter(building => building.footprint == C.MEDIUM),
            subdivisions: 3
        }
    }
}

// TODO organize
const worldNeighborhoods = {
    count: 100,
    maxSize: isMobile ? C.WORLD_RADIUS * 2 : Math.floor(C.WORLD_RADIUS) * 2,
    maxRadius: C.WORLD_RADIUS * 6, // Try to get this as low as possible after happy with maxSize (TODO there is probably a decent heuristic so you don't have to eyeball this)
    rules: sphereWorldNeighborhoodRules,
    getCentroids: getWorldCentroids,
    generateTiles: generateTiles,
    pickBuildings: pickWorldBuildings,
    surface: generateSphereWorldGeometry(
        C.WORLD_RADIUS,
        C.WORLD_SIDES,
        C.WORLD_TIERS,
        C.MAX_WORLD_FACE_HEIGHT,
    ),
}

// TODO where to put
const asteroidSurfaces = generateAsteroids(
    C.ASTEROID_BELT_RADIUS,
    C.ASTEROID_BELT_CENTER,
    C.NUM_ASTEROIDS,
    C.ASTEROID_MAX_RADIUS,
    C.ASTEROID_MAX_FACE_NOISE,
);

// TODO can we clean this up...
export default function Neighborhoods({ colors }) {
    const { buildings, loaded } = useContext(BuildingsContext);
    const [meshes, setMeshes] = useState();

    useEffect(() => {
        if (loaded) {
            const asteroidGroups = asteroidSurfaces.instances.map(instance => {
                return {
                    count: 100,
                    maxSize: isMobile ? C.ASTEROID_MAX_RADIUS * 2 : Math.floor(C.ASTEROID_MAX_RADIUS) * 2,
                    maxRadius: C.ASTEROID_MAX_RADIUS * 6, // Try to get this as low as possible after happy with maxSize (TODO there is probably a decent heuristic so you don't have to eyeball this)
                    rules: () => true,
                    getCentroids: getAsteroidCentroids,
                    generateTiles: generateTiles,
                    pickBuildings: pickAsteroidBuildings,
                    surface: instance,
                }
            })
            const worldGroup = worldNeighborhoods;
            setMeshes(generateTilesets({
                buildings,
                groups: [worldGroup, ...asteroidGroups],
            }));
        }
    }, [loaded]);

    return <>
        <WorldSurface geometry={worldNeighborhoods.surface} color={colors.world} />
        <AsteroidsSurface geometry={asteroidSurfaces.geometry} {...colors.asteroid} />
        {meshes && Object.keys(meshes).map(meshName => {
            return <primitive key={meshName}
                object={meshes[meshName]}
            />
        })
        }
    </>
}
