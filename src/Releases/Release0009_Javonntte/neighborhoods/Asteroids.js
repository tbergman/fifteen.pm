import React, { useContext } from 'react';
import { useResource } from 'react-three-fiber';
import * as THREE from 'three';
import useMusicPlayer from '../../../UI/Player/hooks';
import { Ground29Material, TronMaterial } from '../../../Utils/materials';
import NoiseSphereGeometry from '../../../Utils/NoiseSphere';
// import Neighborhood from './neighborhoods';
import * as C from '../constants';
import { MaterialsContext } from '../MaterialsContext';
// import { asteroidNeighborhoods } from './neighborhoods';

function generateAsteroid(radius, sides, tiers, noiseHeight, noiseWidth, center) {
    const seed = Math.floor(Math.random() * 1000);
    const noiseSphere = new NoiseSphereGeometry(radius, sides, tiers, { seed, noiseWidth: noiseWidth, noiseHeight: noiseHeight, center })
    noiseSphere.verticesNeedUpdate = true;
    noiseSphere.computeBoundingSphere();
    noiseSphere.computeBoundingBox();
    noiseSphere.computeFaceNormals();
    return noiseSphere;
}

export function generateAsteroids(asteroidBeltRadius, asteroidBeltCenter, numAsteroids, maxAsteroidRadius, maxFaceNoise) {
    const asteroidsGeom = new THREE.Geometry()
    const asteroids = {
        geometry: undefined,
        instances: [],
    };
    for (let i = 0; i < numAsteroids; i++) {
        const radius = THREE.Math.randInt(maxAsteroidRadius * .75, maxAsteroidRadius);
        const sides = Math.floor(radius);//Math.floor(Math.min(radius * Math.random(), 5));
        const tiers = Math.floor(Math.max(radius * Math.random(), radius));
        const center = new THREE.Vector3(
            asteroidBeltRadius * 1.5 * (Math.random() - .5),
            asteroidBeltRadius * 1.5 * (Math.random() - .5),
            asteroidBeltRadius * 1.5 * (Math.random() - .5),
        )
        const noiseHeight = maxFaceNoise;
        const noiseWidth = maxFaceNoise;
        const asteroidGeom = generateAsteroid(
            radius,
            sides,
            tiers,
            noiseHeight,
            noiseWidth,
            center,
        )
        asteroidsGeom.merge(asteroidGeom)
        asteroids.instances.push({
            faces: asteroidGeom.faces,
            vertices: asteroidGeom.vertices,
            centroid: center,
            radius: radius,
        })
    }
    const asteroidBufferGeom = new THREE.BufferGeometry().fromGeometry(asteroidsGeom);
    asteroids.geometry = asteroidBufferGeom;
    return asteroids;
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