import * as THREE from 'three';
import { faceCentroid } from "../../Utils/geometry";


function generateBuilding(tri, centroid, normal, buildings, offset) {
    const newBuilding = buildings[THREE.Math.randInt(0, buildings.length - 1)].clone();
    let newPos = new THREE.Vector3();
    tri.closestPointToPoint(centroid.addScalar(offset), newPos)
    newBuilding.position.x = newPos.x;
    newBuilding.position.y = newPos.y;
    newBuilding.position.z = newPos.z;
    newBuilding.lookAt(normal);
    return newBuilding;

}

export function generateBuildings({ world, buildings, buildingsInPath, sphericalHelper, worldRadius }) {
    // var numBuildings = 9936;
    const faces = world.current.geometry.faces;
    const vertices = world.current.geometry.vertices;
    for (let i = 0; i < faces.length; i++) {
        const face = faces[i];
        const tri = new THREE.Triangle(vertices[face.a], vertices[face.b], vertices[face.c]);
        const centroid = faceCentroid(face, vertices);
        const area = tri.getArea();
        let numStructures = 1;
        if (area < .5) numStructures = 2;
        else if (area >= .5 && area < 1.) numStructures = 4;
        else if (area >= .1 && area < 2.) numStructures = 6;
        else numStructures = 8;
        // face.color.setRGB(0, numStructures / 20, 0);
        for (let i = -Math.floor(numStructures / 2); i < Math.floor(numStructures / 2); i++) {
            world.current.add(generateBuilding(tri, centroid, face.normal, buildings, i));
        }
    }
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