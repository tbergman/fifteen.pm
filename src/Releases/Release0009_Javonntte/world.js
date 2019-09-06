import * as THREE from 'three';

// TODO convert to jsx
// from https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_fly.html
export function makeStars({radius, scene}) {
    var i, r = radius, starsGeometry = [new THREE.BufferGeometry(), new THREE.BufferGeometry()];
    var vertices1 = [];
    var vertices2 = [];
    var vertex = new THREE.Vector3();
    for (i = 0; i < 250; i++) {
        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random() * 2 - 1;
        vertex.multiplyScalar(r);
        vertices1.push(vertex.x, vertex.y, vertex.z);
    }
    for (i = 0; i < 1500; i++) {
        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random() * 2 - 1;
        vertex.multiplyScalar(r);
        vertices2.push(vertex.x, vertex.y, vertex.z);
    }
    starsGeometry[0].addAttribute('position', new THREE.Float32BufferAttribute(vertices1, 3));
    starsGeometry[1].addAttribute('position', new THREE.Float32BufferAttribute(vertices2, 3));
    var stars;
    var starsMaterials = [
        new THREE.PointsMaterial({ color: 0x555555, size: 2, sizeAttenuation: false }),
        new THREE.PointsMaterial({ color: 0x555555, size: 1, sizeAttenuation: false }),
        new THREE.PointsMaterial({ color: 0x333333, size: 2, sizeAttenuation: false }),
        new THREE.PointsMaterial({ color: 0x3a3a3a, size: 1, sizeAttenuation: false }),
        new THREE.PointsMaterial({ color: 0x1a1a1a, size: 2, sizeAttenuation: false }),
        new THREE.PointsMaterial({ color: 0x1a1a1a, size: 1, sizeAttenuation: false })
    ];
    for (i = 10; i < 30; i++) {
        stars = new THREE.Points(starsGeometry[i % 2], starsMaterials[i % 6]);
        stars.rotation.x = Math.random() * 6;
        stars.rotation.y = Math.random() * 6;
        stars.rotation.z = Math.random() * 6;
        stars.scale.setScalar(i * 10);
        stars.matrixAutoUpdate = false;
        stars.updateMatrix();
        scene.add(stars);
    }

}

export function makeWorld({ radius, sides, tiers, maxHeight }) {
    const sphereGeometry = new THREE.SphereGeometry(radius, sides, tiers);
    // variate sphere heights
    var vertexIndex;
    var vertexVector = new THREE.Vector3();
    var nextVertexVector = new THREE.Vector3();
    var firstVertexVector = new THREE.Vector3();
    var offset = new THREE.Vector3();
    var currentTier = 1;
    var lerpValue = 0.5;
    var heightValue;
    for (var j = 1; j < tiers - 2; j++) {
        currentTier = j;
        for (var i = 0; i < sides; i++) {
            vertexIndex = (currentTier * sides) + 1;
            vertexVector = sphereGeometry.vertices[i + vertexIndex].clone();
            if (j % 2 !== 0) {
                if (i == 0) {
                    firstVertexVector = vertexVector.clone();
                }
                nextVertexVector = sphereGeometry.vertices[i + vertexIndex + 1].clone();
                if (i == sides - 1) {
                    nextVertexVector = firstVertexVector;
                }
                lerpValue = (Math.random() * (0.75 - 0.25)) + 0.25;
                vertexVector.lerp(nextVertexVector, lerpValue);
            }
            heightValue = (Math.random() * maxHeight) - (maxHeight / 2);
            offset = vertexVector.clone().normalize().multiplyScalar(heightValue);
            sphereGeometry.vertices[i + vertexIndex] = (vertexVector.add(offset));
        }
    }
    return sphereGeometry;
}