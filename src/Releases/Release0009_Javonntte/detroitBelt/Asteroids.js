import React, { useContext } from 'react';
import * as THREE from 'three';
import NoiseSphereGeometry from '../../../Utils/NoiseSphere';
import { randomArrayVal, selectNRandomFromArray } from '../../../Utils/random';
import * as C from '../constants';
import { MaterialsContext } from '../MaterialsContext';

// TODO buildings should be grabbed in the provider since they are different
// than world geoms so it's the same number of total instances no matter how i slice it and there's no need to try and combine world vs asteroid instances
// then this can become a component again
class AsteroidBelt {
    constructor(props) {
        this.props = props;
        this.surfaces = {
            geometry: undefined,
            instances: [],
        };
        this.asteroidsGeom = new THREE.Geometry();
        this.neighborhoods = [];
    }

    getAsteroidNeighborhoodCentroids({ tiles, surface }) {
        const numCentroids = 1;//Math.max(0, surface.radius / 10);
        // console.log('num neighborhood points', numCentroids)
        // console.log('surface', surface);
        // console.log('tiles', tiles)
        // // const pointsOnSurface = surface.vertices;
        // const centroids = selectNRandomFromArray(surface.faces, numCentroids);
        
        // return centroids;
        // const numRandPoints = surface.radius / 6; // TODO; use instance.radius
        const centroids = selectNRandomFromArray(Object.values(tiles).map(v => v), numCentroids).map(tile => tile.centroid);
        return centroids;
    }

    pickAsteroidBuildings(tile, buildings) {
        const presentBuildings = buildings.filter(building => building.era === C.PRESENT);
        const area = tile.triangle.getArea();
        // if (area > 14) {
        //     return {
        //         allowedBuildings: presentBuildings.filter(building => building.footprint == C.LARGE),
        //         subdivisions: 1
        //     }
        // }
        // else {
        return {
            allowedBuildings: presentBuildings.filter(building => building.footprint == C.MEDIUM),
            subdivisions: 1
        }
        // }
    }

    _generateAsteroidCentroids({ beltRadius, numAsteroids }) {
        const centroids = [];
        const distBetweenRings = 5;
        const closestRingRadius = 0;
        let curRingRadius = closestRingRadius;
        const satelliteSlots = 20;
        while (centroids.length < numAsteroids) {
            curRingRadius += distBetweenRings;
            const orbitRing = new THREE.CircleGeometry(curRingRadius, satelliteSlots);
            const orbitPoint = randomArrayVal(orbitRing.vertices.slice(1, orbitRing.vertices.length));
            orbitPoint.z = [-1, 1][THREE.Math.randInt(0, 1)] * closestRingRadius + beltRadius * (Math.random() - 0.5);
            centroids.push(orbitPoint);
        }
        return centroids;
    }

    _generateSurfaces() {
        this.surfaces.instances = this._generateAsteroidCentroids({ ...this.props }).map(centroid => {
            const instance = this._generateAsteroidInstance({ centroid: centroid, ...this.props });
            this.asteroidsGeom.merge(instance.geometry);
            return instance;
        });
        this.surfaces.geometry = new THREE.BufferGeometry().fromGeometry(this.asteroidsGeom);
    }

    _generateSurfaceNeighborhoods() {
        if (!this.surfaces.instances) console.error("You need to generate surfaces before generating surface neighborhoods.");
        this.surfaces.instances.forEach(instance => {
            // TODO a shared type class with world neighborhood
            this.neighborhoods.push({
                numTiles: 1,//isMobile ? C.ASTEROID_MAX_RADIUS * 2 : Math.floor(C.ASTEROID_MAX_RADIUS) * 2,
                maxRadius: C.ASTEROID_MAX_RADIUS * 6, // Try to get this as low as possible after happy with maxSize (TODO there is probably a decent heuristic so you don't have to eyeball this)
                rules: () => true,
                getNeighborhoodCentroids: this.getAsteroidNeighborhoodCentroids,
                // centroids: this._generateAsteroidNeighborhoodCentroids(), // TODO when refactor World
                pickBuildings: this.pickAsteroidBuildings,
                surface: instance,
            });
        })
    }

    _generateAsteroidNoiseSphere({ centroid, radius, sides, tiers, noiseHeight, noiseWidth }) {
        const noiseSphere = new NoiseSphereGeometry(
            radius,
            sides,
            tiers,
            {centroid: centroid,
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

    _generateAsteroidInstance({ centroid, beltRadius, maxAsteroidRadius, maxAsteroidNoise }) {
        const radius = THREE.Math.randInt(maxAsteroidRadius * .75, maxAsteroidRadius);
        const asteroidGeom = this._generateAsteroidNoiseSphere({
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

    generate() {
        this._generateSurfaces();
        this._generateSurfaceNeighborhoods();
        return this;
    }
}

export function generateAsteroidAssets() {
    const belt = new AsteroidBelt({
        beltRadius: C.ASTEROID_BELT_RADIUS,
        beltCenter: C.ASTEROID_BELT_CENTER,
        numAsteroids: C.NUM_ASTEROIDS,
        maxAsteroidRadius: C.ASTEROID_MAX_RADIUS,
        maxAsteroidNoise: C.ASTEROID_MAX_FACE_NOISE,
    }).generate();
    return [belt.surfaces, belt.neighborhoods];
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

