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
    const asteroidFaceGroups = [];
    const asteroidVertexGroups = [];
    const asteroidCenters = [];
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
        asteroidCenters.push(center);
        asteroidFaceGroups.push(asteroidGeom.faces);
        asteroidVertexGroups.push(asteroidGeom.vertices);
        asteroidsGeom.merge(asteroidGeom)
    }
    const asteroidBufferGeom = new THREE.BufferGeometry().fromGeometry(asteroidsGeom);
    return {geometry: asteroidBufferGeom, faceGroups: asteroidFaceGroups, vertexGroups: asteroidVertexGroups, centroids: asteroidCenters}
}


