import React from 'react';
import * as THREE from 'three';
import { Building, buildingName } from './buildings';
import { randomClone } from './utils';
import { getMiddle, triangleCentroid } from '../../Utils/geometry';
import { faceCentroid } from "../../Utils/geometry"

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

function subdivideTriangle(tri, centroid, formation) {
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
        case "medium":
            // all same size
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
        case "extraSubdivisions":
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

export function faceId(face) {
    return [face.a, face.b, face.c].join("_");
}


let areaTotal = 0;
let areaCount = 0;
function pickFacePattern(area){
   if (area<1.6){
    return "small"; // TODO make these randomly picked from lists
   } else {
    return "medium"; // TODO make these randomly picked from lists
    
   }
    
}


// TODO use a face to position camera, and store a map of neighbors for rendering of buildings: https://stackoverflow.com/questions/33073136/given-a-mesh-face-find-its-neighboring-faces
function Face({ buildingGeometries, centroid, normal, triangle }) {
    
    const area = triangle.getArea();
    // areaTotal += area;
    // areaCount += 1;
    // console.log("Avg:", areaTotal/areaCount);
    const formation = pickFacePattern(area);
    const subdivisions = subdivideTriangle(triangle, centroid, formation);
    const color = getRandomColor(centroid); // TODO temporary color to help debug
    return <>{subdivisions.map(triangleSubdivision => {
        // TODO might want to just store centroids during calculation
        const subdivisionCentroid = triangleCentroid(triangleSubdivision);
        const geometry = randomClone(buildingGeometries.narrow); // TODO
        return <group key={buildingName(geometry, subdivisionCentroid)}>
            <Building geometry={geometry} centroid={subdivisionCentroid} normal={normal} color={color} />
        </group>
    })}</>;

}



export function Faces({ offset, radius, geometries, sphereGeometry }) {

    return <>{sphereGeometry.faces.map(face => {
        const vertices = sphereGeometry.vertices;
        const centroid = faceCentroid(face, vertices)
        return <group key={faceId(face)}>
            {centroid.x < 3.5 && centroid.x > -3.5 &&
                Math.abs(centroid.y) < radius * .99 && (//radius * 1.1 &&  (
                <Face
                    buildingGeometries={geometries}
                    centroid={centroid}
                    normal={face.normal}
                    triangle={new THREE.Triangle(
                        vertices[face.a],
                        vertices[face.b],
                        vertices[face.c])}
                />)}
        </group>
    })
    }</>
}