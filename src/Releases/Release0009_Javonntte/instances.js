import * as THREE from 'three';
import instancedMesh from 'three-instanced-mesh';
instancedMesh(THREE);

function updateCluster(cluster, normal, centroid, index, vector3) {
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
    cluster.setScaleAt(index, vector3.set(1, 1, 1));
}

export function createInstance(instances) {
    const totalInstances = instances.length;
    const cluster = new THREE.InstancedMesh(
        instances[0].geometry,
        instances[0].material,
        totalInstances,              // instance count
        false,                       // is it dynamic
    );
    var _v3 = new THREE.Vector3();    
    for (let i = 0; i < totalInstances; i++) {
        updateCluster(cluster, instances[i].normal, instances[i].centroid, i, _v3)
    }
    cluster.castShadow = true;
    return cluster;
}
