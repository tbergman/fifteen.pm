import React from 'react';
import * as THREE from 'three';

// from https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_fly.html
export default function Stars({ radius, colors }) {
    let i, r = radius, starsGeometry = [new THREE.BufferGeometry(), new THREE.BufferGeometry()];
    const vertices1 = [];
    const vertices2 = [];
    const vertex = new THREE.Vector3();
    for (i = 0; i < 2250; i++) {
        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random() * 2 - 1;
        vertex.multiplyScalar(r);
        vertices1.push(vertex.x, vertex.y, vertex.z);
    }
    for (i = 0; i < 3500; i++) {
        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random() * 2 - 1;
        vertex.multiplyScalar(r);
        vertices2.push(vertex.x, vertex.y, vertex.z);
    }
    starsGeometry[0].setAttribute('position', new THREE.Float32BufferAttribute(vertices1, 3));
    starsGeometry[1].setAttribute('position', new THREE.Float32BufferAttribute(vertices2, 3));

    const starsMaterials = [
        new THREE.PointsMaterial({ color: colors[0], size: 1, sizeAttenuation: false }),
        new THREE.PointsMaterial({ color: colors[0], size: .5, sizeAttenuation: false }),
        new THREE.PointsMaterial({ color: colors[1], size: .5, sizeAttenuation: false }),
        new THREE.PointsMaterial({ color: colors[1], size: .25, sizeAttenuation: false }),
        new THREE.PointsMaterial({ color: colors[2], size: 1, sizeAttenuation: false }),
        new THREE.PointsMaterial({ color: colors[2], size: .5, sizeAttenuation: false })
    ];
    const stars = [];
    for (i = 10; i < 30; i++) {
        const star = new THREE.Points(starsGeometry[i % 2], starsMaterials[i % 6]);
        star.rotation.x = Math.random() * 6;
        star.rotation.y = Math.random() * 6;
        star.rotation.z = Math.random() * 6;
        star.scale.setScalar(i * 10);
        star.matrixAutoUpdate = false;
        star.updateMatrix();
        stars.push(star);
    }
    return <group>
        {stars.map((star, index) => {
            return <group key={index}>
                <primitive object={star} />
            </group>
        })}
    </group>
}
