import * as THREE from 'three';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise';


// source: https://blog.webmaestro.fr/3d-noise-sphere-geometry-with-three-js/
export default class NoiseSphereGeometry extends THREE.SphereGeometry {
    constructor(radius, sides, tiers, { centroid = new THREE.Vector3(), seed, noiseWidth, noiseHeight }) {
        super(radius, sides, tiers);
        const getNoise = (vertice) => ImprovedNoise().noise(
            seed + vertice.x / noiseWidth,
            seed + vertice.y / noiseWidth,
            seed + vertice.z / noiseWidth
        ),
            noiseMap = this
                .vertices
                .map(getNoise),
            noiseMax = Math.max(...noiseMap),
            noiseMin = -Math.min(...noiseMap);
        for (const v in this.vertices) {
            if (noiseMap[v] > 0) {
                this
                    .vertices[v]
                    .elevation = noiseMap[v] / noiseMax;
            } else {
                this
                    .vertices[v]
                    .elevation = noiseMap[v] / noiseMin;
            }
            this
                .vertices[v]
                .multiplyScalar(1 + this.vertices[v].elevation * noiseHeight / radius)
                .addVectors(this.vertices[v], centroid);
        }
    }
}