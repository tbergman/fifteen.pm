import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, useResource, useRender } from 'react-three-fiber';
import { MemoizedTile } from '../../Utils/TileGenerator';
import { Buildings, Building } from "./buildings";
import { Faces, faceId } from "./face";



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
    // const [sphereGeometryRef, sphereGeometry] = useResource();
    const [sphereGeometryMeshRef, sphereGeometryMesh] = useResource();
    const group = useRef();
    const { camera, raycaster } = useThree();
    let sphereGeometry = new THREE.SphereGeometry(worldRadius, sides, tiers);
    let sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xfaec82, flatShading: THREE.FlatShading, vertexColors: THREE.FaceColors })
    // window.addEventListener("mousemove", onMouseMove, false);
    // function onMouseMove(event) {
    //     camera.position.setFromSphericalCoords(30, Math.PI * -event.clientY / window.innerHeight, 0);
    //     camera.lookAt(worldPos);
    // }
    sphereGeometry = variateSphereFaceHeights({sphereGeometry, worldRadius, sides, tiers, maxHeight});
    
    console.log("RENDER WORLD");
    const mouse = new THREE.Vector2();
    const target = new THREE.Vector2();
    const windowHalf = new THREE.Vector2( window.innerWidth / 2, window.innerHeight / 2 );
    document.addEventListener( 'mousemove', onMouseMove, false );
  
function onMouseMove( event ) {

	mouse.x = ( event.clientX - windowHalf.x );
	mouse.y = ( event.clientY - windowHalf.x );

}
    useEffect(() => {
        camera.position.set(0, worldRadius * .05, -worldRadius * 1.01);
        camera.lookAt(new THREE.Vector3(0, worldRadius * 1.5, 1));// 15, -1));

    }, [])
    useRender(() => {
        // TODO this rotation sucks haha will need to fix weird jumps
        target.x = ( 1 - mouse.x ) * 0.002;
        target.y = (1 - mouse.y) * 0.002;
        group.current.rotation.x -= .0001;
        camera.rotation.x -= (raycaster.ray.direction.y-.75) * .01 ;
        group.current.rotation.z = raycaster.ray.direction.x * .6;
    })

    return <>
        <group ref={group}>
            {group.current && (
                <>
                    <mesh


                        geometry={sphereGeometry}
                        material={sphereMaterial}
                        castShadow
                        receiveShadow
                        // rotation-z={-Math.PI / 2}
                        position={worldPos}
                    />
                    {buildingGeometries && <Faces
                        geometries={buildingGeometries}
                        sphereGeometry={sphereGeometry}
                        offset={worldPos}
                        radius={worldRadius}
                    />}
                </>
            )}
        </group>) : null}

    </>;


    return <>
        <sphereGeometry ref={sphereGeometryRef} args={[worldRadius, sides, tiers]} />
        {sphereGeometry ? (
            <group>
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
            </group>) : null}
    </>
}


