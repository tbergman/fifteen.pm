
import React, { useContext, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import NoiseSphereGeometry from '../../../Utils/NoiseSphere';
import { randomArrayVal, selectNRandomFromArray } from '../../../Utils/random';
import * as C from '../constants';
import { MaterialsContext } from '../MaterialsContext';
import BuildingInstances from './BuildingInstances';
import { BuildingsContext } from './BuildingsContext';
import { generateTilesets } from './tiles';

// TODO buildings should be grabbed in the provider since they are different
// than world geoms so it's the same number of total instances no matter how i slice it and there's no need to try and combine world vs asteroid instances
// then this can become a component again
function generateAsteroidSurfaces(props) {
    const surfaces = {
        geometry: undefined,
        instances: [],
    };

    const asteroidsGeom = new THREE.Geometry();

    function _generateAsteroidCentroids({ beltRadius, numAsteroids }) {
        const centroids = [];
        const distBetweenRings = 8;
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
            10,//Math.floor(Math.max(radius * Math.random(), radius * 2)), // tiers
            {
                centroid: centroid,
                seed: Math.floor(Math.random() * 1000),
                noiseWidth: 1,
                noiseHeight: 1,
                scale: { x: Math.random() * 1.5, y: Math.random() * 1.5, z: Math.random() * 1.5 }
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
    constructor(surface, theme) {
        this.surface = surface;
        this.theme = theme;
        this.numTiles = 1;
        this.maxRadius = C.ASTEROID_MAX_RADIUS * 6
    }

    rules = () => true

    getNeighborhoodCentroids({ tiles, surface }) {
        const numCentroids = Math.max(0, surface.radius / 2);
        const centroids = selectNRandomFromArray(Object.values(tiles).map(v => v), numCentroids).map(tile => tile.centroid);
        return centroids;
    }


    pickBuildings(tile, buildings) {
        return {
            allowedBuildings: buildings.filter(building => {
                return C.ASTEROID_BUILDING_CATEGORIES[this.theme].includes(building.name)
            }),
            subdivisions: 1,
        }
    }
}


export function AsteroidsSurface({ geometry, themeName }) {
    const { tron, ground29Purple, ornateBrass2, rock19, scuffedPlasticBlack } = useContext(MaterialsContext);

    const exteriorMaterial = useMemo(() => ({
        dream: ornateBrass2,
        night: ground29Purple,
        natural: rock19,
        sunset: scuffedPlasticBlack,
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

export function Asteroids({ themeName, setReady }) {
    const { buildings, loaded: buildingsLoaded } = useContext(BuildingsContext);
    // TODO having issue getting these values to align with those passed into
    // generateAsteroidNeighborhoods when placing this in its own useMemo,
    // or even the same one.
    const [surfaces, meshes] = useMemo(() => {
        if (!buildingsLoaded) return [];

        const _surfaces = generateAsteroidSurfaces({
            beltRadius: C.ASTEROID_BELT_RADIUS,
            beltCenter: C.ASTEROID_BELT_CENTER,
            numAsteroids: C.NUM_ASTEROIDS,
            maxAsteroidRadius: C.ASTEROID_MAX_RADIUS,
        })

        const _meshes = {}
        C.THEME_NAMES.forEach(themeName => {
            const neighborhoods = _surfaces.instances.map(surface => new AsteroidNeighborhoods(surface, themeName))

            _meshes[themeName] = generateTilesets({ buildings, neighborhoods });
        })

        return [_surfaces, _meshes];
    }, [buildingsLoaded])

    useEffect(() => {
        if (meshes) setReady(true);
    }, [meshes])

    return (
        <>
            {meshes &&
                <>
                    <AsteroidsSurface geometry={surfaces.geometry} themeName={themeName} />
                    <BuildingInstances themeName={themeName} meshes={meshes} />
                </>
            }
        </>
    )
}