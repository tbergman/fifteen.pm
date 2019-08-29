import * as THREE from 'three';
import { faceCentroid } from "../../Utils/geometry";

// TODO ensure randomness is unique-ish within triangle face sets
function randomClone(arr) {
    return arr[THREE.Math.randInt(0, arr.length - 1)].clone();
}

const buildingGroupings = [

    // structures:[{}, {} {}]
    // small: [
    //     { numWide: 0, numMid: 5, numSmall: 0 },
    // ],
    // medium: [
    //     { numWide: 2, numMid: 0, numSmall: 0 }
    // ],
    // large: [
    //     { numWide: 4, numMid: 0, numSmall: 0 }
    // ]
]

// https://gist.github.com/kamend/2f825621825466e0d2bdaac72afd498e
function getMiddle(pointA, pointB) {
    let middle = new THREE.Vector3()
    middle.subVectors(pointB.clone(), pointA.clone())
    middle.multiplyScalar(0.5)
    middle.subVectors(pointB.clone(), middle)
    return middle.clone()
}

function subdivideTriangle(tri, centroid, formation) {
    const i1 = tri.a;
    const i2 = tri.b;
    const i3 = tri.c;
    const a = (tri.a, tri.b);
    const b = (tri.b, tri.c);
    const c = (tri.a, tri.c);
    const triangles = [];
    // all same size

    switch (formation) {
        case "equal":
            triangles.push(new THREE.Triangle(i1, a, centroid));
            triangles.push(new THREE.Triangle(a, i2, centroid));
            triangles.push(new THREE.Triangle(i2, b, centroid));
            triangles.push(new THREE.Triangle(b, i3, centroid));
            triangles.push(new THREE.Triangle(i3, c, centroid));
            triangles.push(new THREE.Triangle(c, i1, centroid));
            break;
        case "bigLeft1":
            // big on left, medium on top, small on bottom right
            triangles.push(new THREE.Triangle(i1, i2, c)); // big building // TODO probably can store all of this in maps
            triangles.push(new THREE.Triangle(i2, i3, centroid)); // medium building
            triangles.push(new THREE.Triangle(i3, c, centroid)); // narrow building
        case "micro":
            const equalTriangles = subdivideTriangle(tri, centroid, "equal");
            for (let i = 0; i < equalTriangles.length; i++) {
                const halvedTriangles = subdivideTriangle(equalTriangles[i], triangleCentroid(equalTriangles[i]), "equal");
                for (let j = 0; j < halvedTriangles.length; j++) {
                    triangles.push(halvedTriangles[j]);
                }
            }
    }

    return triangles;
}

function generateBuilding(buildingSubset, centroid, normal) {
    const newBuilding = randomClone(buildingSubset);
    newBuilding.position.x = centroid.x;
    newBuilding.position.y = centroid.y;
    newBuilding.position.z = centroid.z;
    newBuilding.lookAt(normal); // will share normals with the face (TODO will this work?)
    return newBuilding;
}

function triangleCentroid(triangle) {
    const middle = getMiddle(triangle.a, triangle.b);
    const opposite = triangle.c;
    const centroid = getMiddle(middle, opposite);
    return centroid;
}

function generatePrimaryFace(face, vertices, buildings) {
    // const newBuilding = buildings[THREE.Math.randInt(0, buildings.length - 1)].clone();
    // const newBuilding = buildings[9].clone();//THREE.Math.randInt(0, buildings.length - 1)].clone();
    const triangle = new THREE.Triangle(vertices[face.a], vertices[face.b], vertices[face.c]);
    const centroid = faceCentroid(face, vertices);
    const area = triangle.getArea();
    let formation;
    if (area < 1.) {
        formation = "micro";
    } else if (area >= 1. && area < 3.) {
        formation = "equal"; // TODO naming lol
    } else {
        formation = "bigLeft1";
    }
    // formation = "equal";
    const subdivisions = subdivideTriangle(triangle, centroid, formation);
    const newBuildings = [];
    if (formation == "equal") {
        for (let i = 0; i < subdivisions.length; i++) {
            // TODO might want to just store centroids during calculation
            const centroid = triangleCentroid(subdivisions[i]);
            newBuildings.push(generateBuilding(buildings.mid, centroid, face.normal));
        }
    } else if (formation === "bigLeft1") {
        const bigBuildingCentroid = triangleCentroid(subdivisions[0]);
        newBuildings.push(generateBuilding(buildings.wide, bigBuildingCentroid, face.normal))
        const midBuildingCentroid = triangleCentroid(subdivisions[1]);
        newBuildings.push(generateBuilding(buildings.mid, midBuildingCentroid, face.normal))
        const narrowBuildingCentroid = triangleCentroid(subdivisions[2]);
        newBuildings.push(generateBuilding(buildings.narrow, narrowBuildingCentroid, face.normal))
    } else if (formation == "micro") {
        for (let i = 0; i < subdivisions.length; i++) {
            // TODO might want to just store centroids during calculation
            const centroid = triangleCentroid(subdivisions[i]);
            newBuildings.push(generateBuilding(buildings.narrow, centroid, face.normal));
        }
    }
    return newBuildings;
}

export function generateBuildings({ world, buildings, buildingsInPath, sphericalHelper, worldRadius }) {
    const faces = world.current.geometry.faces;
    const vertices = world.current.geometry.vertices;
    for (let i = 0; i < faces.length; i++) {
        const newBuildings = generatePrimaryFace(faces[i], vertices, buildings);
        for (let j = 0; j < newBuildings.length; j++) {
            world.current.add(newBuildings[j]);
        }
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