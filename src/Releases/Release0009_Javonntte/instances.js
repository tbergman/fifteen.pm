import * as THREE from 'three';
import { generateTileFormations } from './formations';
import instancedMesh from 'three-instanced-mesh';
instancedMesh(THREE);

function updateCluster(cluster, normal, centroid, index, vector3) {
    var obj = new THREE.Object3D();
    obj.lookAt(normal);
    obj.rotation.z += THREE.Math.randFloat(-2 * Math.PI, 2 * Math.PI); // random rotation of the objs
    obj.updateMatrix();
    const quaternion = new THREE.Quaternion().setFromRotationMatrix(obj.matrix);
    // TODO include random z rotation
    const rotation = new THREE.Euler(0, 0, THREE.Math.randFloat(-2 * Math.PI, 2 * Math.PI));
    // const quaternion = new THREE.Quaternion().setFromEuler(rotation);
    cluster.setQuaternionAt(index, quaternion);
    cluster.setPositionAt(index, vector3.set(centroid.x, centroid.y, centroid.z));
    cluster.setScaleAt(index, vector3.set(1, 1, 1));
    // var randCol = function () {
    //     return Math.random();
    // };
    // cluster.setColorAt(i, new THREE.Color(randCol(), randCol(), randCol()));
}

function createInstance(elements, material) {
    const totalInstances = elements.length;
    const geometry = elements[0].geometry;
    const cluster = new THREE.InstancedMesh(
        geometry,
        material,
        totalInstances,              // instance count
        false,                       //is it dynamic
        // true,                     //does it have color
        // true,                     //uniform scale, if you know that the placement function will not do a non-uniform scale, this will optimize the shader
    );
    var _v3 = new THREE.Vector3();    
    for (let i = 0; i < totalInstances; i++) {
        updateCluster(cluster, elements[i].normal, elements[i].centroid, i, _v3)
    }
    cluster.castShadow = true;
    return cluster;
}

// TODO maybe the material ref should be assigned to the incoming geometries array of objects
export function generateInstanceGeometriesByName({ surface, buildings, neighborhoods }) {
    const elementsByName = {};
    const instancesByName = {};
    // build up a lookup of each geometry by name
    buildings.geometries.forEach((geometry) => elementsByName[geometry.name] = []);
    // get centers for each formation
    // generate formations for all tiles
    const formations = generateTileFormations(surface, buildings.geometries, neighborhoods);
    // add each geometry instance from each tile formation to the elements by name look up
    Object.keys(formations).forEach((tId) => {
        formations[tId].forEach((element) => {
            elementsByName[element.geometry.name].push(element);
        })
    });
    // create an instance geometry for each geometry type that includes all locations on each formation for that geometry
    Object.keys(elementsByName).forEach((name) => {
        if (elementsByName[name].length) {
            instancesByName[name] = createInstance(elementsByName[name], buildings.materials[THREE.Math.randInt(0, buildings.materials.length - 1)]);
        }
    });
    return instancesByName;
}
