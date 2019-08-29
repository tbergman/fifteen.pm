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

function triangleCentroid(triangle) {
    const middle = getMiddle(triangle.a, triangle.b);
    const opposite = triangle.c;
    const centroid = getMiddle(middle, opposite);
    return centroid.clone();
}
function subdivideTriangle(tri, centroid, formation) {
    const i1 = tri.a;
    const i2 = tri.b;
    const i3 = tri.c;
    const a = getMiddle(tri.a, tri.b);
    const b = getMiddle(tri.b, tri.c);
    const c = getMiddle(tri.a, tri.c);
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
            break;
        case "micro":
            const equalTriangles = subdivideTriangle(tri, centroid, "equal");
            for (let i = 0; i < equalTriangles.length; i++) {
                const halvedTriangles = subdivideTriangle(equalTriangles[i], triangleCentroid(equalTriangles[i]), "equal");
                for (let j = 0; j < halvedTriangles.length; j++) {
                    triangles.push(halvedTriangles[j]);
                }
            }
            break;
    }

    return triangles;
}


function random(seed) {
    var x = Math.sin(seed) * 10000;
    var r = x - Math.floor(x);
    return r;
}

function getRandomColor(centroid) {
    var letters = '0123456789ABCDEF';
    var color = '#';
    var seed = random(centroid.x * centroid.y * centroid.z) * 10000;
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(random(seed++) * 16)];
    }
    return color;
}

function setupBuilding(newBuilding, centroid, normal, color) {
    // TODO getting the buildings to sit on the curve properly will work with use of 'Spherical'
    newBuilding.position.x = centroid.x;
    newBuilding.position.y = centroid.y;
    newBuilding.position.z = centroid.z;
    newBuilding.material.color.set(color);
    // newBuilding.applyMatrix(new THREE.Matrix4().makeTranslation(x,y,z)
    // newBuilding.position.addVectors(centroid, new THREE.Vector3(0, 0, 0).multiplyScalar(-1));
    newBuilding.lookAt(normal); // will share normals with the face (TODO will this work?)
    return newBuilding;
}

function generateBuildingsOnFace(face, vertices, buildings) {
    const triangle = new THREE.Triangle(vertices[face.a], vertices[face.b], vertices[face.c]);
    const centroid = faceCentroid(face, vertices);
    const area = triangle.getArea();
    let formation = "equal"
    const newBuildings = [];
    // if (area > 2.) return newBuildings;
    // if (area < 1.) {
    //     formation = "micro";
    // } else if (area >= 1. && area < 3.) {
    //     formation = "equal"; // TODO naming lol
    // } else {
    //     formation = "bigLeft1";
    // }
    // formation = "equal";
    const subdivisions = subdivideTriangle(triangle, centroid, formation);
    const color = getRandomColor(centroid); // TODO temporary color to help debug
    // if (formation == "equal") {
    //     for (let i = 0; i < 3; i++){//subdivisions.length; i++) {
    //         // TODO might want to just store centroids during calculation
    //         const centroid = triangleCentroid(subdivisions[i]);
    //         newBuildings.push(generateBuilding(buildings.mid, centroid, face.normal, color));
    //     }
    // }
    // } else 
    // if (formation === "bigLeft1") {
    //     const bigBuildingCentroid = triangleCentroid(subdivisions[0]);
    //     newBuildings.push(generateBuilding(buildings.wide, bigBuildingCentroid, face.normal, color))
    //     const midBuildingCentroid = triangleCentroid(subdivisions[1]);
    //     newBuildings.push(generateBuilding(buildings.mid, midBuildingCentroid, face.normal, color))
    //     const narrowBuildingCentroid = triangleCentroid(subdivisions[2]);
    //     newBuildings.push(generateBuilding(buildings.narrow, narrowBuildingCentroid, face.normal, color))
    // }
    // } else 
    if (Math.random() * 1000 < 700) return newBuildings;

    // if (formation == "micro") {
    const buildingN = randomClone(buildings.narrow);
    const buildingW = randomClone(buildings.wide);
    const buildingM = randomClone(buildings.mid);
    for (let i = 0; i < subdivisions.length; i++) {
        // TODO might want to just store centroids during calculation
        // const centroid = new THREE.Vector3;
        // subdivisions[i].getMidpoint(centroid);
        const centroid = triangleCentroid(subdivisions[i]);
        let building = buildingN.clone();
        // if (i === 3 || i===4) building = buildingM.clone();
        // if (i === 5) building = buildingW.clone();
        newBuildings.push(setupBuilding(building, centroid, face.normal, color));
    }
    // }
    return newBuildings;
}

function lineSegmentFromVertices(vertices) {
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    var edges = new THREE.EdgesGeometry(geometry);
    return new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xff0000 }))
}

export function generateBuildings({ world, buildings, buildingsInPath, sphericalHelper, worldRadius }) {
    const faces = world.current.geometry.faces;
    const vertices = world.current.geometry.vertices;
    for (let i = 0; i < faces.length; i++) {
        // TODO remove (what do the faces look like)
        const a = vertices[faces[i].a];
        const b = vertices[faces[i].b];
        const c = vertices[faces[i].c];
        const tmpVertices = new Float32Array(
            [a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z]
        );
        const line = lineSegmentFromVertices(tmpVertices);
        world.current.add(line);
        const newBuildings = generateBuildingsOnFace(faces[i], vertices, buildings);
        for (let j = 0; j < newBuildings.length; j++) {
            world.current.add(newBuildings[j]);
        }
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
            // child.position.set(0, 0, 0);//new THREE.Vector3(0, 0, 0);
            const material = new THREE.MeshStandardMaterial({ color: 0x886633, flatShading: THREE.FlatShading });
            const geometry = child.geometry.clone();
            // this makes the 'lookAt(normal)' easier to use later on by flipping the default blender output for expected placement on the sphere

            geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI));
            const mesh = new THREE.Mesh(geometry, material);
            mesh.name = child.name;
            mesh.castShadow = true;
            mesh.receiveShadow = false;
            // mesh.position.y += 20;// child.geometry.boundingBox.max.y;
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