
import React, { useContext } from 'react';
import * as THREE from 'three';
import NoiseSphereGeometry from '../../../Utils/NoiseSphere';
import { randomArrayVal, selectNRandomFromArray } from '../../../Utils/random';
import * as C from '../constants';
import { MaterialsContext } from '../MaterialsContext';

// TODO buildings should be grabbed in the provider since they are different
// than world geoms so it's the same number of total instances no matter how i slice it and there's no need to try and combine world vs asteroid instances
// then this can become a component again
export function generateAsteroidSurfaces(props) {
    const surfaces = {
        geometry: undefined,
        instances: [],
    };

    const asteroidsGeom = new THREE.Geometry();

    function _generateAsteroidCentroids({ beltRadius, numAsteroids }) {
        const centroids = [];
        const distBetweenRings = 4;
        const closestRingRadius = C.WORLD_RADIUS + 5;
        let curRingRadius = closestRingRadius;
        const satelliteSlots = 20; // potential locations on ring for satellite
        while (centroids.length < numAsteroids) {
            curRingRadius += distBetweenRings;
            const orbitRing = new THREE.CircleGeometry(curRingRadius, satelliteSlots);
            const orbitPoint = randomArrayVal(orbitRing.vertices.slice(1, orbitRing.vertices.length));
            orbitPoint.z = [-1, 1][THREE.Math.randInt(0, 1)] * closestRingRadius + beltRadius * (Math.random() - 0.5);
            centroids.push(orbitPoint);
        }
        return centroids;
    }

    function _generateAsteroidNoiseSphere({ centroid, radius }) {
        const noiseSphere = new NoiseSphereGeometry(
            radius,
            10, // sides
            Math.floor(Math.max(radius * Math.random(), radius * 2)), // tiers
            {
                centroid: centroid,
                seed: Math.floor(Math.random() * 1000),
                noiseWidth: 25,
                noiseHeight: 25,
                scale: { x: Math.random() * 1.5, y: 1, z: 1 }
            })
        noiseSphere.verticesNeedUpdate = true;
        noiseSphere.computeBoundingSphere();
        noiseSphere.computeBoundingBox();
        noiseSphere.computeFaceNormals();
        return noiseSphere;
    }

    function _generateAsteroidInstance({ centroid, beltRadius, maxAsteroidRadius }) {
        const radius = THREE.Math.randInt(maxAsteroidRadius * .75, maxAsteroidRadius);
        const asteroidGeom = _generateAsteroidNoiseSphere({ centroid: centroid, radius: radius })
        return {
            geometry: asteroidGeom,
            faces: asteroidGeom.faces,
            vertices: asteroidGeom.vertices,
            centroid: centroid,
            radius: radius,
        }
    }

    surfaces.instances = _generateAsteroidCentroids({ ...props }).map(centroid => {
        const instance = _generateAsteroidInstance({ centroid: centroid, ...props });
        asteroidsGeom.merge(instance.geometry);
        return instance;
    });
    surfaces.geometry = new THREE.BufferGeometry().fromGeometry(asteroidsGeom);
    return surfaces;
}

class AsteroidNeighborhoods {
    constructor(surface, category) {
        this.surface = surface;
        this.category = category;
        this.numTiles = 1;
        this.maxRadius = C.ASTEROID_MAX_RADIUS * 6

    }

    rules = () => true

    getNeighborhoodCentroids({ tiles, surface }) {
        const numCentroids = Math.max(0, surface.radius / 2);
        const centroids = selectNRandomFromArray(Object.values(tiles).map(v => v), numCentroids).map(tile => tile.centroid);
        return centroids;
    }

    pickFutureBuildings(tile, buildings) {
        const presentBuildings = buildings.filter(building => building.era === C.PRESENT);
        return [
            {
                allowedBuildings: presentBuildings.filter(building => building.footprint == C.LARGE),
                subdivisions: 1
            },
            {
                allowedBuildings: presentBuildings.filter(building => building.footprint == C.LARGE),
                subdivisions: 1
            }
        ][THREE.Math.randInt(0, 1)]
    }

    pickSquiggleBuildings(tile, buildings) {
        const presentBuildings = buildings.filter(building => building.era === C.PRESENT);
        return [
            {
                allowedBuildings: presentBuildings.filter(building => building.footprint == C.LARGE),
                subdivisions: 1
            },
            {
                allowedBuildings: presentBuildings.filter(building => building.footprint == C.LARGE),
                subdivisions: 1
            }
        ][THREE.Math.randInt(0, 1)]
    }

    pickIndustrialBuildings(tile, buildings) {
        const presentBuildings = buildings.filter(building => building.era === C.PRESENT);
        return [
            {
                allowedBuildings: presentBuildings.filter(building => building.footprint == C.LARGE),
                subdivisions: 1
            },
            {
                allowedBuildings: presentBuildings.filter(building => building.footprint == C.LARGE),
                subdivisions: 1
            }
        ][THREE.Math.randInt(0, 1)]
    }

    pickSunsetBuildings(tile, buildings) {
        const presentBuildings = buildings.filter(building => building.era === C.PRESENT);
        return [
            {
                allowedBuildings: presentBuildings.filter(building => building.footprint == C.LARGE),
                subdivisions: 1
            },
            {
                allowedBuildings: presentBuildings.filter(building => building.footprint == C.LARGE),
                subdivisions: 1
            }
        ][THREE.Math.randInt(0, 1)]
    }

    pickBuildings(tile, buildings) {
        const pick = {
            "future": this.pickFutureBuildings,
            "industrial": this.pickIndustrialBuildings,
            "squiggles": this.pickSquiggleBuildings,
            "sunset": this.pickSunsetBuildings,

        }[this.category]
        const picked = pick(tile, buildings);
        return picked;
    }
}

// TODO having issue getting these values to align with those passed into
// generateAsteroidNeighborhoods when placing this in its own useMemo,
// or even the same one.
export const surfaces = generateAsteroidSurfaces({
    beltRadius: C.ASTEROID_BELT_RADIUS,
    beltCenter: C.ASTEROID_BELT_CENTER,
    numAsteroids: C.NUM_ASTEROIDS,
    maxAsteroidRadius: C.ASTEROID_MAX_RADIUS,
})

export const neighborhoods = {
    future: surfaces.instances.map(surface => new AsteroidNeighborhoods(surface, "future")),
    squiggles: surfaces.instances.map(surface => new AsteroidNeighborhoods(surface, "squiggles")),
    industrial: surfaces.instances.map(surface => new AsteroidNeighborhoods(surface, "industrial")),
    sunset: surfaces.instances.map(surface => new AsteroidNeighborhoods(surface, "sunset")), 
}

export function AsteroidsSurface({ geometry, materialName }) {
    const { tron, ground29, ornateBrass2, rock19 } = useContext(MaterialsContext);

    function exteriorMaterial() {
        return {
            "ornateBrass2": ornateBrass2,
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

