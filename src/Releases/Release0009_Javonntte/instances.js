import * as THREE from 'three';
import { generateFormations } from './formations';


require('three-instanced-mesh')(THREE);

function createInstance(elements, material) {
    const totalInstances = elements.length;
    const geometry = elements[0].geometry;
    const cluster = new THREE.InstancedMesh(
        geometry,
        material,
        totalInstances,              // instance count
        false,                       //is it dynamic
        // true,                        //does it have color
        // true,                        //uniform scale, if you know that the placement function will not do a non-uniform scale, this will optimize the shader
    );
    var _v3 = new THREE.Vector3();
    var randCol = function () {
        return Math.random();
    };
    for (let i = 0; i < totalInstances; i++) {
        var obj = new THREE.Object3D();
        obj.lookAt(elements[i].normal);
        obj.updateMatrix();
        const quaternion = new THREE.Quaternion().setFromRotationMatrix(obj.matrix);
        // TODO include random z rotation
        // const rotation = new THREE.Euler(0, 0, THREE.Math.randFloat(-2 * Math.PI, 2 * Math.PI));
        // const quaternion = new THREE.Quaternion().setFromEuler(rotation);
        cluster.setQuaternionAt(i, quaternion);
        const centroid = elements[i].centroid;
        cluster.setPositionAt(i, _v3.set(centroid.x, centroid.y, centroid.z));
        cluster.setScaleAt(i, _v3.set(1, 1, 1));
        // cluster.setColorAt(i, new THREE.Color(randCol(), randCol(), randCol()));
    }
    cluster.castShadow = true;
    return cluster;
}

// TODO maybe the material ref should be assigned to the incoming geometries array of objects
// TODO combine formation-generating props together
export function generateInstanceGeometries(sphereGeometry, buildings, neighborhoodProps) {
    const elementsByName = {};
    const instancesByName = {};
    // build up a lookup of each geometry by name
    buildings.geometries.forEach((geometry) => elementsByName[geometry.name] = []);
    // generate formations for all tiles
    const formations = generateFormations(sphereGeometry, buildings.geometries, neighborhoodProps);
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