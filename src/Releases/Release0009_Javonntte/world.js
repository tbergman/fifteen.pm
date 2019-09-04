import React, { useRef, useState } from 'react';
import { useRender, useResource, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { faceId, SphereFaces } from "./face";
import { CityTile } from "./tiles";

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
export function World({ startPos, worldRadius, sides, tiers, buildingGeometries, worldPos, maxHeight }) {
    console.log("RENDER WORLD");
    const group = useRef();
    const { raycaster } = useThree();
    let sphereGeometry = new THREE.SphereGeometry(worldRadius, sides, tiers);
    // let sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xfaec82, flatShading: THREE.FlatShading, vertexColors: THREE.FaceColors })
    sphereGeometry = variateSphereFaceHeights({ sphereGeometry, worldRadius, sides, tiers, maxHeight });
    useRender(() => {
        // TODO this rotation sucks haha
        group.current.rotation.x -= .0001;
        group.current.rotation.z = raycaster.ray.direction.x * .6;
    })
    return <>
        <group ref={group}>
            {group.current && (
                <>
                    {/* <mesh
                        geometry={sphereGeometry}
                        material={sphereMaterial}
                        castShadow
                        receiveShadow
                        position={worldPos}
                    /> */}
                    {buildingGeometries && <SphereFaces
                        geometries={buildingGeometries}
                        sphereGeometry={sphereGeometry}
                        offset={worldPos}
                        radius={worldRadius}
                        startPos={startPos}
                        // TODO
                        tileComponent={CityTile}
                    />}
                </>
            )}
        </group>) : null}
    </>;
}


