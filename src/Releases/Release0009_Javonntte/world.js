import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, useResource, useRender } from 'react-three-fiber';
import { MemoizedTile } from '../../Utils/TileGenerator';
import { Buildings, Building } from "./buildings";
import { Face, faceId } from "./face";
import { faceCentroid } from "../../Utils/geometry"

function variateSphereFaceHeights({ sides, tiers, maxHeight, worldRadius, sphereGeometry }) {
    var vertexIndex;
    var vertexVector = new THREE.Vector3();
    var nextVertexVector = new THREE.Vector3();
    var firstVertexVector = new THREE.Vector3();
    var offset = new THREE.Vector3();
    var currentTier = 1;
    var lerpValue = 0.5;
    var heightValue;
    for (var j = 1; j < tiers - 2; j++) {
        currentTier = j;
        for (var i = 0; i < sides; i++) {
            vertexIndex = (currentTier * sides) + 1;
            vertexVector = sphereGeometry.vertices[i + vertexIndex].clone();
            if (j % 2 !== 0) {
                if (i == 0) {
                    firstVertexVector = vertexVector.clone();
                }
                nextVertexVector = sphereGeometry.vertices[i + vertexIndex + 1].clone();
                if (i == sides - 1) {
                    nextVertexVector = firstVertexVector;
                }
                lerpValue = (Math.random() * (0.75 - 0.25)) + 0.25;
                vertexVector.lerp(nextVertexVector, lerpValue);
            }
            heightValue = (Math.random() * maxHeight) - (maxHeight / 2);
            offset = vertexVector.clone().normalize().multiplyScalar(heightValue);
            sphereGeometry.vertices[i + vertexIndex] = (vertexVector.add(offset));
        }
    }
    return sphereGeometry;
}

function vertexId(v) {
    return [v.x, v.y, v.z].join("_");
}

function generateNeighborLookup(g) {
    const vertexToFace = {};
    const faceIdLookup = {}
    for (let fx = 0; fx < g.vertices.length; fx++) {
        const vertId = vertexId(g.vertices[fx]);
        vertexToFace[vertId] = [];
    }
    for (let fx = 0; fx < g.faces.length; fx++) {
        const f = g.faces[fx];
        const vertAId = vertexId(g.vertices[f.a]);
        const vertBId = vertexId(g.vertices[f.b]);
        const vertCId = vertexId(g.vertices[f.c]);
        const fId = faceId(f)
        faceIdLookup[fId] = f;
        vertexToFace[vertAId].push(fId);
        vertexToFace[vertBId].push(fId);
        vertexToFace[vertCId].push(fId);
    }
    // const faceToNeighbors = {};
    // for (const vertId in vertexToFace){
    //     console.log(faceNeighbors)        
    // }
    console.log(vertexToFace)
    return [vertexToFace, faceIdLookup];
}

// https://sites.google.com/site/threejstuts/home/slerp
// https://stackoverflow.com/questions/11030101/three-js-camera-flying-around-sphere ***
// https://gamedev.stackexchange.com/questions/59298/walking-on-a-sphere ***
// https://stackoverflow.com/questions/42087478/create-a-planet-orbit
// https://github.com/mrdoob/three.js/blob/34dc2478c684066257e4e39351731a93c6107ef5/src/math/interpolants/QuaternionLinearInterpolant.js
// https://threejs.org/examples/?q=webgl_math_orientation_transform#webgl_math_orientation_transform
// https://stackoverflow.com/questions/18401213/how-to-animate-the-camera-in-three-js-to-look-at-an-object/24151942
// https://math.oregonstate.edu/home/programs/undergrad/CalculusQuestStudyGuides/vcalc/coord/coord.html
// https://stackoverflow.com/questions/13039589/rotate-the-camera-around-an-object-using-the-arrow-keys-in-three-js
// https://stackoverflow.com/questions/36700452/how-to-rotate-camera-so-it-faces-above-point-on-sphere-three-js
// https://codesandbox.io/s/react-three-fiber-suspense-gltf-loader-l900i
// endless roller: https://jsfiddle.net/juwalbose/bk4u5wcn/embedded/
// TODO generalize parameters
export function World({ worldRadius, sides, tiers, buildingGeometries, worldPos, maxHeight }) {
    // const [geometryRef, geometry] = useResource();
    const { camera, scene } = useThree();
    let sphereGeometry = new THREE.SphereGeometry(worldRadius, sides, tiers);
    let sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xfffafa, flatShading: THREE.FlatShading, vertexColors: THREE.FaceColors })
    const neighbors = useRef();
    const faceIdLookup = useRef();
    const sphericalHelper = new THREE.Spherical();
    // sphereGeometry = variateSphereFaceHeights({sphereGeometry, worldRadius, sides, tiers, maxHeight});
    console.log("RENDER WORLD");
    let direction = new THREE.Vector3(0, -1, 0);

    /*TODO
    var halfWidth = window.innerWidth / 2, halfHeight = window.innerHeight / 2;
    app.mouseX = event.pageX - halfWidth;
    app.mouseY = event.pageY - halfHeight;
    app.mouseXPercent = Math.ceil( (app.mouseX / halfWidth) * 100 );
    app.mouseYPercent = Math.ceil( (app.mouseY / halfHeight) * 100 );*/
    const camGroup = new THREE.Object3D();
    useEffect(() => {
        camera.position.set(0, 20, 0);
        camera.lookAt(new THREE.Vector3(0, 15, -1));

        // camGroup.add(camera);
        // scene.add(camGroup);

        // camera.lookAt(worldPos);
        // camera.lookAt( new THREE.Vector3(0, 190, -50) );
        // [neighbors.current, faceIdLookup.current] = generateNeighborLookup(sphereGeometry);
        // const vertices = sphereGeometry.vertices;
        // const middleFaceIdx = Math.floor(sphereGeometry.faces.length / 2);
        // const startingFace = sphereGeometry.faces[middleFaceIdx];
        // const startingCentroid = faceCentroid(startingFace, vertices);
        // // const startingPos = startingCentroid.addVectors(startingCentroid, startingFace.normal);
        // const startingPos = startingCentroid;
        // camera.position.copy(startingPos);

        // const startingFaceId = faceId(startingFace);
        // const sharedVertexId = vertexId(vertices[startingFace.a]);
        // const allFaces = neighbors.current[sharedVertexId] // Just picking random from neighbors for now..
        // let lookAtFaceId;
        // for (const idx in allFaces){
        //     const faceId = allFaces[idx];
        //     if (faceId !== startingFaceId){
        //         lookAtFaceId = faceId;
        //         break;
        //     }
        // }
        // const lookAtFace =  faceIdLookup.current[lookAtFaceId]
        // const lookAtFaceNormal = lookAtFace.normal.clone();
        // const lookAtFaceCentroid = faceCentroid(lookAtFace, vertices);
        // const lookAt = lookAtFaceNormal.cross(lookAtFaceCentroid);
        // // console.log("start pos", startingPos, "lookAt", lookAt);
        // camera.quaternion.setFromUnitVectors( lookAtFaceNormal, direction );
        // // camera.lookAt(lookAtFaceNormal);



        // const binormal = new THREE.Vector3();
        // binormal.subVectors(lookAtFace.normal, startingFace.normal);
        // binormal.multiplyScalar() // some offset 


    }, [])

    let phi = 2
    let theta = Math.PI / 2;
    const rollingSpeed = 0.008;
    let temp = -.01;
    useRender(() => {
        // camGroup.matrix.rotateY(-app.mouseXPercent * .00025);
        // camGroup.matrix.makeRotationY(temp);
        // camGroup.matrix.makeRotationX(-.0025);
        // camGroup.matrix.makeRotationAxis(camGroup.matrix);
        // temp-=1;
        // requestAnimationFrame(animate);
        // renderer.render(scene, camera);
        // Face setFromVector3
        // sphericalHelper.set( worldRadius, phi, theta);
        // camera.position.setFromSpherical(sphericalHelper);
        // theta+=.001;
    })
    return <group>
        <mesh
            geometry={sphereGeometry}
            material={sphereMaterial}
            castShadow
            receiveShadow
            rotation-z={-Math.PI / 2}
            position={worldPos}
        />
        {/* {buildingGeometries && sphereGeometry.faces.map(face => {
            const vertices = sphereGeometry.vertices;
            const centroid = faceCentroid(face, vertices)
            return <group key={faceId(face)}>
                <Face
                    buildingGeometries={buildingGeometries}
                    centroid={centroid}
                    normal={face.normal}
                    triangle={new THREE.Triangle(
                        vertices[face.a],
                        vertices[face.b],
                        vertices[face.c])}
                />
            </group>
        })
        } */}
    </group>
}


/*        // TODO remove (what do the faces look like)
        const a = vertices[faces[i].a];
        const b = vertices[faces[i].b];
        const c = vertices[faces[i].c];
        const tmpVertices = new Float32Array(
            [a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z]
        );
        const line = lineSegmentFromVertices(tmpVertices);
 */