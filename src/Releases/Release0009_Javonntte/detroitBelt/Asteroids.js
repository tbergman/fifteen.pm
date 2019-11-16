
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
        const closestRingRadius = 10;
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





export function generateAsteroidNeighborhoods(surfaces) {
    const neighborhoods = []
    surfaces.instances.forEach(instance => {
        // TODO a shared type class with world neighborhood
        neighborhoods.push({
            numTiles: 1,//isMobile ? C.ASTEROID_MAX_RADIUS * 2 : Math.floor(C.ASTEROID_MAX_RADIUS) * 2,
            maxRadius: C.ASTEROID_MAX_RADIUS * 6, // Try to get this as low as possible after happy with maxSize (TODO there is probably a decent heuristic so you don't have to eyeball this)
            rules: () => true,
            getNeighborhoodCentroids: getAsteroidNeighborhoodCentroids,
            // centroids: this._generateAsteroidNeighborhoodCentroids(), // TODO when refactor World
            pickBuildings: pickAsteroidBuildings,
            surface: instance,
        });
    })
    return neighborhoods;
}

export class AsteroidNeighborhoods {
    constructor(surface){
        this.surface=surface
        this.numTiles=1
        this.maxRadius=C.ASTEROID_MAX_RADIUS * 6
        
    }

    rules = () => true

    getNeighborhoodCentroids({ tiles, surface }) {
        const numCentroids = Math.max(0, surface.radius / 2);
        const centroids = selectNRandomFromArray(Object.values(tiles).map(v => v), numCentroids).map(tile => tile.centroid);
        return centroids;
    }
    
    pickBuildings(tile, buildings) {
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

