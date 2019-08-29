import * as THREE from 'three';
import { faceCentroid } from "../../Utils/geometry";


function randomClone(arr) {
    return arr[THREE.Math.randInt(0, arr.length - 1)].clone();
}



const buildingGroupings = {
    small: [
        { numWide: 0, numMid: 5, numSmall: 0 },
    ],
    medium: [
        { numWide: 2, numMid: 0, numSmall: 0 }
    ],
    large: [
        { numWide: 4, numMid: 0, numSmall: 0 }
    ]
}



function generateFace(face, vertices, buildings) {
    // const newBuilding = buildings[THREE.Math.randInt(0, buildings.length - 1)].clone();
    // const newBuilding = buildings[9].clone();//THREE.Math.randInt(0, buildings.length - 1)].clone();

    const tri = new THREE.Triangle(vertices[face.a], vertices[face.b], vertices[face.c]);
    const area = tri.getArea();

    let newBuilding;
    if (area < 3.) {
        newBuilding = randomClone(buildings.narrow);
    } else if (area >= 3 && area <= 4) {
        newBuilding = randomClone(buildings.mid);
    } else {
        newBuilding = randomClone(buildings.wide);
    }
    // console.log(tri.getArea());    
    const centroid = faceCentroid(face, vertices);

    // let newPos = new THREE.Vector3();
    // const offset=1;
    // tri.closestPointToPoint(centroid.addScalar(offset), newPos)
    newBuilding.position.x = centroid.x;//newPos.x;
    newBuilding.position.y = centroid.y;
    newBuilding.position.z = centroid.z;
    newBuilding.lookAt(face.normal);
    // console.log(newBuilding);
    return newBuilding;
}

export function generateBuildings({ world, buildings, buildingsInPath, sphericalHelper, worldRadius }) {
    // var numBuildings = 9936;
    console.log("BUILDINGS:", buildings);
    const faces = world.current.geometry.faces;
    const vertices = world.current.geometry.vertices;
    for (let i = 0; i < faces.length; i++) {
        // const face = faces[i];
        world.current.add(generateFace(faces[i], vertices, buildings));
        // const tri = new THREE.Triangle(vertices[face.a], vertices[face.b], vertices[face.c]);
        // const area = tri.getArea();
        // let numStructures = 2
        // if (area < .5) numStructures = 2;
        // else if (area >= .5 && area < 1.) numStructures = 4;
        // else if (area >= .1 && area < 2.) numStructures = 6;
        // else numStructures = 8;
        // face.color.setRGB(0, numStructures / 20, 0);
        // for (let i = -Math.floor(numStructures / 2); i < Math.floor(numStructures / 2); i++) {
        // world.current.add(generateBuilding(tri, centroid, face.normal, buildings, i));
        // }
    }
}

export function loadBuildings(gltf) {
    const geometries = {
        mid: [],
        wide: [],
        narrow: []
    }
    gltf.scene.traverse(child => {
        if (child.isMesh) {
            child.geometry.center();
            const material = new THREE.MeshStandardMaterial({ color: 0x886633, flatShading: THREE.FlatShading });
            const geometry = child.geometry.clone();
            // this makes the 'lookAt(normal)' easier to use later on
            geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI));
            const mesh = new THREE.Mesh(geometry, material);
            mesh.name = child.name;
            mesh.castShadow = true;
            mesh.receiveShadow = false;
            if (child.name.startsWith("MID")) {
                geometries.mid.push(mesh);
            } else if (child.name.startsWith("WIDE")) {
                geometries.wide.push(mesh);
            } else if (child.name.startsWith("NARROW")) {
                geometries.narrow.push(mesh);
            }
        }
    })
    return geometries;
}


// function doBuildingLogic({ buildingsInPath, camera }) {
//     var oneBuilding;
//     var buildingPos = new THREE.Vector3();
//     var buildingsToRemove = [];
//     buildingsInPath.forEach(function (element, index) {
//         oneBuilding = buildingsInPath[index];
//         buildingPos.setFromMatrixPosition(oneBuilding.matrixWorld);
//         if (buildingPos.z > 6 && oneBuilding.visible) {//gone out of our view zone
//             buildingsToRemove.push(oneBuilding);
//         }
//     });
//     var fromWhere;
//     buildingsToRemove.forEach(function (element, index) {
//         oneBuilding = buildingsToRemove[index];
//         fromWhere = buildingsInPath.indexOf(oneBuilding);
//         buildingsInPath.splice(fromWhere, 1);
//         buildingsPool.push(oneBuilding);
//         oneBuilding.visible = false;
//         console.log("remove building");
//     });
// }