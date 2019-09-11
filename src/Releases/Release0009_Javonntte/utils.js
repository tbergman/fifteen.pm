import * as THREE from 'three';
import { assetPath } from "../../Utils/assets";
import { getMiddle, triangleCentroid } from '../../Utils/geometry';

export const assetPath9 = (p) => {
  return assetPath("9/" + p);
}

export const randVal = (obj) => {
  const keys = Object.keys(obj);
  const numKeys = keys.length;
  const randIdx = THREE.Math.randInt(0, numKeys - 1);
  return obj[keys[randIdx]];
}

export function randomClone(arr) {
  return arr[THREE.Math.randInt(0, arr.length - 1)].clone();
}


// TODO refactor
export function subdivideTriangle(tri, centroid, formation) {
    const i1 = tri.a;
    const i2 = tri.b;
    const i3 = tri.c;
    const a = getMiddle(tri.a, tri.b);
    const b = getMiddle(tri.b, tri.c);
    const c = getMiddle(tri.a, tri.c);
    const triangles = [];
    switch (formation) {
        case "small":
            triangles.push(tri);
            break;
        case "large":
            // all same size
            triangles.push({ size: "small", centroid: triangleCentroid(new THREE.Triangle(i1, a, centroid)) });
            triangles.push({ size: "medium", centroid: triangleCentroid(new THREE.Triangle(a, i2, centroid)) });
            triangles.push({ size: "small", centroid: triangleCentroid(new THREE.Triangle(i2, b, centroid)) });
            triangles.push({ size: "small", centroid: triangleCentroid(new THREE.Triangle(b, i3, centroid)) });
            triangles.push({ size: "small", centroid: triangleCentroid(new THREE.Triangle(i3, c, centroid)) });
            triangles.push({ size: "small", centroid: triangleCentroid(new THREE.Triangle(c, i1, centroid)) });
            break;
        case "bigLeft1":
            // big on left, medium on top, small on bottom right
            triangles.push({ size: "large", centroid: triangleCentroid(new THREE.Triangle(i1, i2, c)) });
            triangles.push({ size: "medium", centroid: triangleCentroid(new THREE.Triangle(i2, i3, centroid)) }); // medium building
            triangles.push({ size: "small", centroid: triangleCentroid(new THREE.Triangle(i3, c, centroid)) }); // narrow building
            break;
        case "extraSmall":
            const equalTriangles = subdivideTriangle(tri, centroid, "medium");
            for (let i = 0; i < equalTriangles.length; i++) {
                const halvedTriangles = subdivideTriangle(equalTriangles[i], triangleCentroid(equalTriangles[i]), "medium");
                for (let j = 0; j < halvedTriangles.length; j++) {
                    triangles.push(halvedTriangles[j]);
                }
            }
            break;
        case "small":
    }
    return triangles;
}

