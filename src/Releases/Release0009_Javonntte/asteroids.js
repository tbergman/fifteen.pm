import * as THREE from 'three';
import { randomPointInSphere } from '../../Utils/random';
import NoiseSphereGeometry from '../../Utils/NoiseSphere';

// TODO tilt and rotationSpeed
function generateAstroid(radius, sides, tiers, maxHeight, center) {
    const noiseWidth = 1.1 * sides;//maxHeight;
    const noiseHeight = 1.1 * tiers;//maxHeight;
    const seed = Math.random() * 1000;
    const noiseSphere = new NoiseSphereGeometry(radius, sides, tiers, { seed, noiseWidth, noiseHeight, center })
    noiseSphere.verticesNeedUpdate = true;
    noiseSphere.computeBoundingSphere();
    noiseSphere.computeBoundingBox();
    noiseSphere.computeFaceNormals();
    return noiseSphere;
}


export function generateAsteroids(asteroidBeltRadius, asteroidBeltCenter, numAsteroids, maxAsteroidRadius, maxSides, maxTiers, maxFaceHeight) {
    const asteroidFaceGroups = [];
    const asteroidVertexGroups = [];
    const asteroidsGeom = new THREE.Geometry()
    for (let i = 0; i < numAsteroids; i++) {
        const center = new THREE.Vector3(
            asteroidBeltRadius * 1.5 * (Math.random() - .5),
            asteroidBeltRadius * 1.5 * (Math.random() - .5),
            asteroidBeltRadius * 1.5 * (Math.random() - .5),
        );
        const radius = THREE.Math.randInt(maxAsteroidRadius * .75, maxAsteroidRadius);
        const sides = Math.floor(radius / 4);
        const tiers = Math.floor(radius / 4);
        const faceHeight = Math.floor(maxFaceHeight / radius);
        const asteroidGeom = generateAstroid(
            // TODO parameterize
            radius,
            sides,
            tiers,
            faceHeight,
            center,
        )
        asteroidFaceGroups.push(asteroidGeom.faces);
        asteroidVertexGroups.push(asteroidGeom.vertices);
        asteroidsGeom.merge(asteroidGeom)
    }
    const asteroidBufferGeom = new THREE.BufferGeometry().fromGeometry(asteroidsGeom);
    return [asteroidBufferGeom, asteroidFaceGroups, asteroidVertexGroups]
}


