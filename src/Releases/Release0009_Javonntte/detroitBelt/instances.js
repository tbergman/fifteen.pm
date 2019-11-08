import * as THREE from 'three';
import instancedMesh from 'three-instanced-mesh';
instancedMesh(THREE);


function updateCluster(cluster, normal, centroid, index, vector3, color) {
    // position
    const yOffset = -normal.y * .5;
    cluster.setPositionAt(index, vector3.set(centroid.x, centroid.y + yOffset, centroid.z));
    // rotation
    var obj = new THREE.Object3D();
    obj.lookAt(normal);
    obj.rotation.z += THREE.Math.randFloat(-2 * Math.PI, 2 * Math.PI); // random rotation of the objs
    obj.updateMatrix();
    const quaternion = new THREE.Quaternion().setFromRotationMatrix(obj.matrix);
    cluster.setQuaternionAt(index, quaternion);
    // scale
    cluster.setScaleAt(index, vector3.set(Math.random() + .5, Math.random() + .5, Math.random() + .5));
    if (color) {
        color.setHSL(Math.random(), 0.5, 0.5);
        cluster.setColorAt(index, color);
    }
}

export function createInstance(instances) {
    const totalInstances = instances.length;
    const cluster = new THREE.InstancedMesh(
        instances[0].geometry,
        instances[0].material,
        totalInstances,              // instance count
        false,                       // is it dynamic
        instances[0].randColor,                       // color
    );
    var _v3 = new THREE.Vector3();
    const _color = instances[0].randColor ? new THREE.Color() : null;
    for (let i = 0; i < totalInstances; i++) {
        updateCluster(cluster, instances[i].normal, instances[i].centroid, i, _v3, _color)
    }
    cluster.castShadow = true;
    return cluster;
}
