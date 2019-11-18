import * as THREE from 'three';


function updateCluster(cluster, normal, centroid, index, vector3) {
    const obj3 = new THREE.Object3D();

    // position
    const yOffset = -normal.y * .5;
    obj3.position.set(centroid.x, centroid.y + yOffset, centroid.z);
    
    // rotation
    obj3.lookAt(normal);
    obj3.rotation.y += Math.PI ;
    obj3.rotation.z += THREE.Math.randFloat(-2 * Math.PI, 2 * Math.PI); // random rotation of the objs

    // scale
    // obj3.scale(Math.random() + .5, Math.random() + .5, Math.random() + .5);
    
    // apply transform
    obj3.updateMatrix();
    cluster.setMatrixAt(index, obj3.matrix);
}

export function createInstance(instances) {
    const totalInstances = instances.length;
    const cluster = new THREE.InstancedMesh(
        instances[0].geometry,
        instances[0].material,
        totalInstances,
    );
    const _v3 = new THREE.Vector3();
    // const _m4 = new THREE.Matrix4();
    for (let i = 0; i < totalInstances; i++) {
        updateCluster(cluster, instances[i].normal, instances[i].centroid, i, _v3)
    }
    cluster.castShadow = true;
    cluster.frustumCulled = false;
    return cluster;
}
