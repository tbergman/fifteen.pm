import * as THREE from 'three';
import { assetPath } from "../../Utils/assets";

export const assetPath9 = (p) => {
    return assetPath("9/" + p);
}






    // const triangles = [];
    // switch (formation) {
    //     case "small":
    //         triangles.push(tri);
    //         break;
    //     case "large":
    //         // all same size
    //         break;
    //     case "bigLeft1":
    //         // big on left, medium on top, small on bottom right
    //         triangles.push({ size: "large", centroid: triangleCentroid(new THREE.Triangle(i1, i2, c)) });
    //         triangles.push({ size: "medium", centroid: triangleCentroid(new THREE.Triangle(i2, i3, centroid)) }); // medium building
    //         triangles.push({ size: "small", centroid: triangleCentroid(new THREE.Triangle(i3, c, centroid)) }); // narrow building
    //         break;
    //     case "extraSmall":
    //         const equalTriangles = subdivideTriangle(tri, centroid, "medium");
    //         for (let i = 0; i < equalTriangles.length; i++) {
    //             const halvedTriangles = subdivideTriangle(equalTriangles[i], triangleCentroid(equalTriangles[i]), "medium");
    //             for (let j = 0; j < halvedTriangles.length; j++) {
    //                 triangles.push(halvedTriangles[j]);
    //             }
    //         }
    //         break;
    //     case "small":
    // }
    // return triangles;
// }

