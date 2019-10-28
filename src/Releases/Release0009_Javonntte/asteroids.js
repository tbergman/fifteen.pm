import * as THREE from 'three';
import { randomPointInSphere } from '../../Utils/random';
import NoiseSphereGeometry from '../../Utils/NoiseSphere';

// TODO tilt and rotationSpeed
function generateAstroid(radius, sides, tiers, noiseHeight, noiseWidth, center) {
    const seed = Math.random() * 1000;
    const noiseSphere = new NoiseSphereGeometry(radius, sides, tiers, { seed, noiseWidth: 1, noiseHeight: 10, center })
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
        const center = new THREE.Vector3(
            asteroidBeltRadius * 1.5 * (Math.random() - .5),
            asteroidBeltRadius * 1.5 * (Math.random() - .5),
            asteroidBeltRadius * 1.5 * (Math.random() - .5),
        );
        const radius = THREE.Math.randInt(maxAsteroidRadius * .75, maxAsteroidRadius);
        const sides = Math.floor(radius / 4);
        const tiers = Math.floor(radius / 4);
        const noiseHeight = maxFaceNoise;// * Math.random();
        const noiseWidth = maxFaceNoise;// * Math.random();
        const asteroidGeom = generateAstroid(
            // TODO parameterize
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


