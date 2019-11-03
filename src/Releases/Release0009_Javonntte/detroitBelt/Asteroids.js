import React, { useContext } from 'react';
import * as THREE from 'three';
// import { asteroidNeighborhoods } from './neighborhoods';
import isMobile from '../../../Utils/BrowserDetection';
import NoiseSphereGeometry from '../../../Utils/NoiseSphere';
import { selectNRandomFromArray } from '../../../Utils/random';
import { generateTiles } from '../../../Utils/SphereTiles';
// import Neighborhood from './neighborhoods';
import * as C from '../constants';
import { MaterialsContext } from '../MaterialsContext';


function getAsteroidCentroids({ tiles, surface }) {
    const numRandPoints = surface.radius / 6; // TODO; use instance.radius
    const centroids = selectNRandomFromArray(Object.values(tiles).map(v => v), numRandPoints).map(tile => tile.centroid);
    return centroids;
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

function generateAsteroidNoiseSphere({ centroid, radius, sides, tiers, noiseHeight, noiseWidth }) {
    const noiseSphere = new NoiseSphereGeometry({
        centroid: centroid,
        radius: radius,
        sides: sides,
        tiers: tiers,
        seed: Math.floor(Math.random() * 1000),
        noiseWidth: noiseWidth,
        noiseHeight: noiseHeight,
    })
    noiseSphere.verticesNeedUpdate = true;
    noiseSphere.computeBoundingSphere();
    noiseSphere.computeBoundingBox();
    noiseSphere.computeFaceNormals();
    return noiseSphere;
}



function generateAsteroidInstance({ centroid, beltRadius, maxAsteroidRadius, maxAsteroidNoise }) {
    const radius = THREE.Math.randInt(maxAsteroidRadius * .75, maxAsteroidRadius);
    const asteroidGeom = generateAsteroidNoiseSphere({
        centroid: centroid,
        radius: radius,
        sides: Math.floor(radius),
        tiers: Math.floor(Math.max(radius * Math.random(), radius)),
        noiseHeight: maxAsteroidNoise,
        noiseWidth: maxAsteroidNoise,
    })
    return {
        geometry: asteroidGeom,
        faces: asteroidGeom.faces,
        vertices: asteroidGeom.vertices,
        centroid: centroid,
        radius: radius,
    }
}
function generateAsteroidCentroids({ beltRadius, numAsteroids }) {
    const centroids = [];
    for (let i = 0; i < numAsteroids; i++) {
        const centroid = new THREE.Vector3(
            beltRadius * 1.5 * (Math.random() - .5),
            beltRadius * 1.5 * (Math.random() - .5),
            beltRadius * 1.5 * (Math.random() - .5),
        )
        centroids.push(centroid);
    }

    return centroids;
}

export function generateAsteroidSurfaces(props) {
    const asteroids = {
        geometry: undefined,
        instances: [],
    };
    const asteroidsGeom = new THREE.Geometry();
    asteroids.instances = generateAsteroidCentroids({ ...props }).map(centroid => {
        const instance = generateAsteroidInstance({ centroid: centroid, ...props });
        asteroidsGeom.merge(instance.geometry);
        return instance;
    });
    const asteroidBufferGeom = new THREE.BufferGeometry().fromGeometry(asteroidsGeom);
    asteroids.geometry = asteroidBufferGeom;
    return asteroids;
}


// TODO buildings should be grabbed in the provider since they are different
// than world geoms so it's the same number of total instances no matter how i slice it and there's no need to try and combine world vs asteroid instances
// then this can become a component again


export function generateAsteroidNeighborhoods(instances) {
    return instances.map(instance => {
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
}

export function AsteroidsSurface({ geometry, insideColor, outsideColor }) {
    const { tron, ground29 } = useContext(MaterialsContext);
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

