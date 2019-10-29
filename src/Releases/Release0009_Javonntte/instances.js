import * as THREE from 'three';
import instancedMesh from 'three-instanced-mesh';
instancedMesh(THREE);

function updateCluster(cluster, normal, centroid, index, vector3) {
    var obj = new THREE.Object3D();
    obj.lookAt(normal);
    obj.rotation.z += THREE.Math.randFloat(-2 * Math.PI, 2 * Math.PI); // random rotation of the objs
    obj.updateMatrix();
    const quaternion = new THREE.Quaternion().setFromRotationMatrix(obj.matrix);
    cluster.setQuaternionAt(index, quaternion);
    cluster.setPositionAt(index, vector3.set(centroid.x, centroid.y, centroid.z));
    cluster.setScaleAt(index, vector3.set(1, 1, 1));
}

export function createInstance(elements, material) {
    const totalInstances = elements.length;
    const geometry = elements[0].geometry;
    const cluster = new THREE.InstancedMesh(
        geometry,
        material,
        totalInstances,              // instance count
        false,                       //is it dynamic
    );
    var _v3 = new THREE.Vector3();    
    for (let i = 0; i < totalInstances; i++) {
        updateCluster(cluster, elements[i].normal, elements[i].centroid, i, _v3)
    }
    cluster.castShadow = true;
    return cluster;
}


