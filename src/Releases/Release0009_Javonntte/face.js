import React, { useEffect, useRef, useState } from 'react';
import { useRender, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { faceCentroid, getMiddle, triangleCentroid, triangleFromFace } from '../../Utils/geometry';
import { Building, buildingName } from './buildings';
import { randomClone } from './utils';

// TODO rm me
function random(seed) {
    var x = Math.sin(seed) * 10000;
    var r = x - Math.floor(x);
    return r;
}

// TODO rm me
function getRandomColor(centroid) {
    var letters = '0123456789ABCDEF';
    var color = '#';
    var seed = random(centroid.x * centroid.y * centroid.z) * 10000;
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(random(seed++) * 16)];
    }
    return color;
}

// TODO refactor
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

function pickFacePattern(area) {
    // TODO calculate area buckets given data
    if (area < 1.6) {
        return "small"; // TODO make these randomly picked from lists
    } else {
        return "medium"; // TODO make these randomly picked from lists
    }
}

let areaTotal = 0;
let areaCount = 0;
function SphereFace({ tileComponent, buildingGeometries, visible, centroid, normal, triangle, faceId }) {
    console.log("Rendering:", faceId)
    const ref = useRef();
    const area = triangle.getArea();
    const formation = pickFacePattern(area);
    const subdivisions = subdivideTriangle(triangle, centroid, formation);
    const color = getRandomColor(centroid); // TODO temporary color to help debug
    const [hasRendered, setHasRendered] = useState(0)
    return <>{visible && subdivisions.map(triangleSubdivision => {
        // TODO might want to just store centroids during calculation
        const subdivisionCentroid = triangleCentroid(triangleSubdivision);
        const geometry = randomClone(buildingGeometries.narrow); // TODO
        return <group ref={ref} key={buildingName(geometry, subdivisionCentroid)}>
            <Building visible={visible} geometry={geometry} centroid={subdivisionCentroid} normal={normal} color={color} />
        </group>
    })}</>;
}

export const MemoizedSphereFace = React.memo(props => {
    // TODO
    // return <>{props.tileComponent(props)}</>;
    return <SphereFace {...props} />;
}, props => !props.hasRendered);

// TODO add back in
function hardLimitYFaces(centroid, radius) {
    // don't populate the tiny triangles on top of the sphere
    return Math.abs(centroid.y) < radius * .98 + Math.random() * .1;
}

function withinInitialBoundary(boundary, centroid) {
    return Math.abs(boundary.distanceTo(centroid) < 5);
}

function updateFaceTiles(faces, face, mesh, vertices) {
    const id = faceId(face);
    if (!faces.hasOwnProperty(id)) {
        faces[id] = {
            centroid: faceCentroid(face, vertices),
            normal: face.normal,
            triangle: triangleFromFace(face, vertices),
            isInitialRender: true,
            visible: true,
            mesh: mesh,
        }
    } else {
        faces[id].visible = true;
        faces[id].isInitialRender = false;
    }
    return faces;
}

function generateRaycastFaces(sphereGeometry, triangleGroup, boundary, faces) {
    const vertices = sphereGeometry.vertices;
    const normal = new THREE.Vector3();
    const geom0 = new THREE.Geometry();
    return sphereGeometry.faces.map((face, index) => {
        const triangle = triangleFromFace(face, vertices);
        const geom = geom0.clone();
        geom.vertices.push(triangle.a);
        geom.vertices.push(triangle.b);
        geom.vertices.push(triangle.c);
        triangle.getNormal(normal);
        geom.faces.push(new THREE.Face3(0, 1, 2, normal));
        const material = new THREE.MeshStandardMaterial({ color: 0x0000ff, transparent: true, opacity: 0.9, flatShading: THREE.FlatShading });
        // const material = new THREE.MeshStandardMaterial({ color: 0xfffafa, flatShading: THREE.FlatShading })
        const mesh = new THREE.Mesh(geom, material);
        mesh.name = faceId(face);
        mesh.userData = { face: face }
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.matrixWorldNeedsUpdate = true;
        const centroid = faceCentroid(face, vertices);
        triangleGroup.current.add(mesh); // TODO optimiziation/instancing here?
        if (withinInitialBoundary(boundary.current, centroid)) {
            faces.current = updateFaceTiles(faces.current, face, mesh, vertices);
        }
        return mesh;
    })
}

function setupRaycasters(faces, camera) {
    const direction = new THREE.Vector3();
    const far = new THREE.Vector3();
    return Object.keys(faces.current).map((faceId, index) => {
        const raycaster = new THREE.Raycaster();
        const face = faces.current[faceId];
        raycaster.set(camera.position, direction.subVectors(face.mesh.position, camera.position).normalize());
        raycaster.far = far.subVectors(face.mesh.position, camera.position).multiplyScalar(2).length();
        return raycaster
    });

}

function checkIntersections(raycasters, triangles, faces) {
}

// TODO first thing tm refactor :P
// https://discourse.threejs.org/t/raycast-objects-that-arent-in-scene/6704/4 
// view-source:https://rawgit.com/pailhead/three.js/instancing-part2-200k-instanced/examples/webgl_interactive_cubes.html
// https://medium.com/@pailhead011/instancing-with-three-js-part-2-3be34ae83c57
export function SphereFaces({ tileComponent, geometries, sphereGeometry, startPos }) {
    const { camera, scene, raycaster } = useThree();
    const [needsUpdate, setNeedsUpdate] = useState(false);
    const faces = useRef({});
    const boundary = useRef(new THREE.Vector3);
    const raycasters = useRef([]);
    const triangles = useRef([]);
    const vertices = sphereGeometry.vertices;
    const triangleGroup = useRef(new THREE.Group());
    useEffect(() => {
        boundary.current = startPos;
        triangles.current = generateRaycastFaces(sphereGeometry, triangleGroup, boundary, faces);
        scene.add(triangleGroup.current); // TODO point of optimization
        raycasters.current = setupRaycasters(faces, camera);
    }, [])
    const seenIds = []; // TODO optimize or rethink 
    useRender((state, time) => {
        triangleGroup.current.rotation.x -= .001; // TODO these are just mimicking rotation in world, no bueno
        triangleGroup.current.rotation.z = raycaster.ray.direction.x * 1.2; // TODO these are just mimicking rotation in world, no bueno
        // TODO is there a better way to bucket? Event detection?
        if ((time % .0001).toFixed(3) == 0) {
            for (let i = 0; i < raycasters.current.length; i++) {
                const intersects = raycasters.current[i].intersectObjects(triangles.current); // TODO should we be looking at other things to interesect? Using layers?
                for (let i = 0; i < intersects.length; i++) {
                    const intersectedObj = intersects[i].object;
                    if (seenIds.indexOf(intersectedObj.name) < 0) {
                        console.log("NEW: ", intersectedObj.name);
                        seenIds.push(intersectedObj.name);
                        // TODO state control for this component
                        setNeedsUpdate(true);
                        faces.current = updateFaceTiles(faces.current, intersectedObj.userData.face, intersectedObj, vertices)
                        setNeedsUpdate(false);
                        console.log(Object.keys(faces.current).length);
                    }
                }
            }
        }
    });

    return <>{faces.current && Object.keys(faces.current).map((faceId, index) => {
        const props = faces.current[faceId];
        return <group key={faceId}>
            <MemoizedSphereFace
                buildingGeometries={geometries}
                tileComponent={tileComponent}
                faceId={faceId}
                {...props}
            />
        </group>
    })}</>
}