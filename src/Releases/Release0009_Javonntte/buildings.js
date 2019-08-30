import React from 'react';
import * as THREE from 'three';

export function buildingName(building, position) {
    return [building.name,
    position.x,
    position.y,
    position.z,
    ].join("_")
}

export function Building({ geometry, centroid, normal, color }) {
    // TODO getting the buildings to sit on the curve properly will work with use of 'Spherical'
    return <>
        <mesh
            onUpdate={self => self.lookAt(normal)}
            geometry={geometry}
            position={centroid}
        // lookAt={normal} // TODO dunno if this is working
        >
            <meshBasicMaterial attach="material" color={color} />
        </mesh>
    </>
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
            const geometry = child.geometry.clone();
            // this makes the 'lookAt(normal)' easier to use later on by flipping the default blender output for expected placement on the sphere
            geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI));
            if (child.name.startsWith("MID")) {
                geometries.mid.push(geometry);
            } else if (child.name.startsWith("WIDE")) {
                geometries.wide.push(geometry);
            } else if (child.name.startsWith("NARROW")) {
                geometries.narrow.push(geometry);
            }
        }
    })
    return geometries;
}

// function generateBuildingsOnFace(face, vertices, buildings) {
//     const triangle = new THREE.Triangle(vertices[face.a], vertices[face.b], vertices[face.c]);
//     const centroid = faceCentroid(face, vertices);
//     const area = triangle.getArea();
//     let formation = "equal"
//     const newBuildings = [];
//     // if (area > 2.) return newBuildings;
//     // if (area < 1.) {
//     //     formation = "micro";
//     // } else if (area >= 1. && area < 3.) {
//     //     formation = "equal"; // TODO naming lol
//     // } else {
//     //     formation = "bigLeft1";
//     // }
//     // formation = "equal";
//     const subdivisions = subdivideTriangle(triangle, centroid, formation);
//     const color = getRandomColor(centroid); // TODO temporary color to help debug
//     // if (formation == "equal") {
//     //     for (let i = 0; i < 3; i++){//subdivisions.length; i++) {
//     //         // TODO might want to just store centroids during calculation
//     //         const centroid = triangleCentroid(subdivisions[i]);
//     //         newBuildings.push(generateBuilding(buildings.mid, centroid, face.normal, color));
//     //     }
//     // }
//     // } else 
//     // if (formation === "bigLeft1") {
//     //     const bigBuildingCentroid = triangleCentroid(subdivisions[0]);
//     //     newBuildings.push(generateBuilding(buildings.wide, bigBuildingCentroid, face.normal, color))
//     //     const midBuildingCentroid = triangleCentroid(subdivisions[1]);
//     //     newBuildings.push(generateBuilding(buildings.mid, midBuildingCentroid, face.normal, color))
//     //     const narrowBuildingCentroid = triangleCentroid(subdivisions[2]);
//     //     newBuildings.push(generateBuilding(buildings.narrow, narrowBuildingCentroid, face.normal, color))
//     // }
//     // } else 
//     if (Math.random() * 1000 < 700) return newBuildings;

//     // if (formation == "micro") {
//     const buildingN = randomClone(buildings.narrow);
//     const buildingW = randomClone(buildings.wide);
//     const buildingM = randomClone(buildings.mid);
//     for (let i = 0; i < subdivisions.length; i++) {
//         // TODO might want to just store centroids during calculation
//         // const centroid = new THREE.Vector3;
//         // subdivisions[i].getMidpoint(centroid);
//         const centroid = triangleCentroid(subdivisions[i]);
//         let building = buildingN;
//         // if (i === 3 || i===4) building = buildingM.clone();
//         // if (i === 5) building = buildingW.clone();
//         newBuildings.push(setupBuilding(building, centroid, face.normal, color));
//     }
//     // }
//     return newBuildings;
// }








// export function Buildings({ vertices, faces, buildingModels, buildingsInPath, sphericalHelper, worldRadius }) {
//     console.log("RENDER Buildings");
//     console.log("num faces: ", faces.length);
//     const buildings = [];
//     for (let i = 0; i < faces.length; i++) {
//         const newBuildings = generateBuildingsOnFace(faces[i], vertices, buildingModels);
//         for (let j = 0; j < newBuildings.length; j++) {
//             buildings.push(newBuildings[j]);
//         }
//     }
//     return <>
//         {buildings.map(building => {
//             return <group key={buildingName(building)}>
//                 <mesh
//                     geometry={building.geometry}
//                     material={building.material}
//                 />
//             </group>
//         })}
//     </>
// }




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