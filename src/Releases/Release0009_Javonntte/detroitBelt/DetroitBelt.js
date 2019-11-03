import React, { useRef, useContext, useEffect, useState } from 'react';
import * as THREE from 'three';
import { isMobile } from '../../../Utils/BrowserDetection';
import { randomPointsOnSphere, selectNRandomFromArray } from '../../../Utils/random';
import { generateTiles } from '../../../Utils/SphereTiles';
import * as C from '../constants';
import { AsteroidsSurface, generateAsteroidSurfaces, AsteroidBelt, generateAsteroidNeighborhoods } from './Asteroids';
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



// TODO can we clean this up...
export default function DetroitBelt({ colors }) {
    const { buildings, loaded } = useContext(BuildingsContext);
    const [meshes, setMeshes] = useState();
    const asteroidSurfaces = useRef();
    useEffect(() => {
        if (loaded) {
            const asteroidSurfaces = generateAsteroidSurfaces({
                beltRadius: C.ASTEROID_BELT_RADIUS,
                beltCenter: C.ASTEROID_BELT_CENTER,
                numAsteroids: C.NUM_ASTEROIDS,
                maxAsteroidRadius: C.ASTEROID_MAX_RADIUS,
                maxAsteroidNoise: C.ASTEROID_MAX_FACE_NOISE,
            })
            const asteroidNeighborhoods = generateAsteroidNeighborhoods(asteroidSurfaces.instances);
            console.log("NABEs", asteroidNeighborhoods);
            setMeshes(generateTilesets({
                buildings,
                groups: [worldNeighborhoods, ...asteroidNeighborhoods],
            }));
        }
    }, [loaded]);

    return <>
        <WorldSurface geometry={worldNeighborhoods.surface} color={colors.world} />
        {asteroidSurfaces.current && <AsteroidsSurface geometry={asteroidSurfaces.current.geometry} {...colors.asteroid} />}
        {meshes && Object.keys(meshes).map(meshName => {
            return <primitive key={meshName}
                object={meshes[meshName]}
            />
        })
        }
    </>
}
