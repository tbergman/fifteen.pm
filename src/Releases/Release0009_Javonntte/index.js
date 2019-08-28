import React, { useEffect, useRef, useState } from 'react';
import { useSpring } from 'react-spring/three';
import { Canvas, extend, useRender, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { BloomEffect, Advanced2Effect } from "../../Utils/Effects";
import { useGLTF } from "../../Utils/hooks";
import TileGenerator from "../../Utils/TileGenerator";
import { BUILDINGS_URL } from "./constants";
import "./index.css";
import { CityTile } from "./tiles";
import { assetPath9 } from "./utils";

extend({ OrbitControls });

function Controls() {
    const controls = useRef();
    const { camera, canvas } = useThree();
    useRender(() => { controls.current && controls.current.update() });
    return (
        <orbitControls
            ref={controls}
            args={[camera, canvas]}
            enableDamping
            dampingFactor={0.5}
            rotateSpeed={0.2}
        />
    );
}


// https://jsfiddle.net/juwalbose/bk4u5wcn/embedded/
function generateWorld({ sides, tiers, worldRadius }) {
    var sphereGeometry = new THREE.SphereGeometry(worldRadius, sides, tiers);
    var sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xfffafa, flatShading: THREE.FlatShading })
    var vertexIndex;
    var vertexVector = new THREE.Vector3();
    var nextVertexVector = new THREE.Vector3();
    var firstVertexVector = new THREE.Vector3();
    var offset = new THREE.Vector3();
    var currentTier = 1;
    var lerpValue = 0.5;
    var heightValue;
    var maxHeight = 0.07;
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
    const rollingGroundSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    rollingGroundSphere.receiveShadow = true;
    rollingGroundSphere.castShadow = false;
    rollingGroundSphere.rotation.z = -Math.PI / 2;
    rollingGroundSphere.position.y = -24;
    rollingGroundSphere.position.z = 2;
    // addWorldBuildings();
    return rollingGroundSphere;
}

function faceCentroid(face, vertices) {
    const v1 = vertices[face.a];
    const v2 = vertices[face.b];
    const v3 = vertices[face.c];
    return new THREE.Vector3(
        (v1.x + v2.x + v3.x) / 3,
        (v1.y + v2.y + v3.y) / 3,
        (v1.z + v2.z + v3.z) / 3,

    );
}



function generateBuildings({ world, buildings, buildingsInPath, sphericalHelper, worldRadius }) {
    // var numBuildings = 9936;
    const faces = world.current.geometry.faces;
    const vertices = world.current.geometry.vertices;
    for (let i = 0; i < faces.length; i++) {
        const face = faces[i];
        const centroid = faceCentroid(face, vertices);
        const newBuilding = buildings[THREE.Math.randInt(0, buildings.length - 1)].clone();
        newBuilding.position.x = centroid.x;
        newBuilding.position.y = centroid.y;
        newBuilding.position.z = centroid.z;
        console.log('add ', newBuilding, 'at centroid', centroid, 'position:', newBuilding.position)
        world.current.add(newBuilding);
    }

    // var numBuildings = 26;
    // var gap = 6.28 / 36; // PI / ?
    // for (var i = 0; i < numBuildings; i++) {
    //     const row = i * gap;
    //     // const row = 0;
    //     generateBuilding(false, row, true, world.current, buildings, buildingsInPath, sphericalHelper, worldRadius);
    //     generateBuilding(false, row, false, world.current, buildings, buildingsInPath, sphericalHelper, worldRadius);
    // }
}


function generateBuilding(inPath, row, isLeft, world, buildings, buildingsInPath, sphericalHelper, worldRadius) {
    const pathAngleValues = [1.52, 1.57, 1.62];
    let newBuilding;
    if (inPath) {
        if (buildings.length == 0) return;
        newBuilding = buildings[THREE.Math.randInt(0, buildings.length - 1)];
        buildingsInPath.push(newBuilding);
        sphericalHelper.set(worldRadius - 0.3, pathAngleValues[row], -world.rotation.x + 4);
    } else {
        newBuilding = buildings[THREE.Math.randInt(0, buildings.length - 1)];
        // newBuilding = createBuilding();
        var areaAngle = 0;//[1.52,1.57,1.62];
        if (isLeft) {
            areaAngle = 1.68 + Math.random() * 0.1;
        } else {
            areaAngle = 1.46 - Math.random() * 0.1;
        }
        sphericalHelper.set(worldRadius - 0.3, areaAngle, row);
        // sphericalHelper.set(100, 1.52, -world.rotation.x+4);
    }
    newBuilding.visible = true;
    console.log("--")
    console.log("NEWBUILDING POS BEFORE", newBuilding.position);
    newBuilding.position.setFromSpherical(sphericalHelper);
    console.log("NEWBUILDING POS AFTER", newBuilding.position);
    var worldVector = world.position.clone().normalize();
    var buildingVector = newBuilding.position.clone().normalize();
    newBuilding.quaternion.setFromUnitVectors(buildingVector, worldVector);
    newBuilding.rotation.x += (Math.random() * (2 * Math.PI / 10)) + -Math.PI / 10;
    world.add(newBuilding);
}


function doBuildingLogic({ buildingsInPath, camera }) {
    var oneBuilding;
    var buildingPos = new THREE.Vector3();
    var buildingsToRemove = [];
    buildingsInPath.forEach(function (element, index) {
        oneBuilding = buildingsInPath[index];
        buildingPos.setFromMatrixPosition(oneBuilding.matrixWorld);
        if (buildingPos.z > 6 && oneBuilding.visible) {//gone out of our view zone
            buildingsToRemove.push(oneBuilding);
        } else {//check collision
            if (buildingPos.distanceTo(camera.position) <= 0.6) {
                console.log("hit");
                hasCollided = true;
                explode();
            }
        }
    });
    var fromWhere;
    buildingsToRemove.forEach(function (element, index) {
        oneBuilding = buildingsToRemove[index];
        fromWhere = buildingsInPath.indexOf(oneBuilding);
        buildingsInPath.splice(fromWhere, 1);
        buildingsPool.push(oneBuilding);
        oneBuilding.visible = false;
        console.log("remove building");
    });
}

function Scene() {
    /* Note: Known behavior that useThree re-renders childrens thrice:
       issue: https://github.com/drcmda/react-three-fiber/issues/66
       example: https://codesandbox.io/s/use-three-renders-thrice-i4k6c
       tldr: Developer says that changing this behavior requires a major version bump and will be breaking.
       Their general recommendation/philosophy is that if you are "declaring calculations" they should implement useMemo
       (For instance: a complicated geometry.)
     */
    const { camera, scene, gl } = useThree();
    const rollingSpeed = 0.0001;
    const [{ top, mouse }, set] = useSpring(() => ({ top: 0, mouse: [0, 0] }))
    // TODO: this value should be a factor of the size of the user's screen...?
    const [tileGridSize, setTileGrideSize] = useState(12);
    const [loadingBuildings, buildings] = useGLTF(BUILDINGS_URL, (gltf) => {
        // const geometries = {}
        const geometries = []
        gltf.scene.traverse(child => {
            if (child.isMesh) {
                child.geometry.center();
                // geometries[child.name] = child.geometry.clone();
                const material = new THREE.MeshStandardMaterial({ color: 0x886633, flatShading: THREE.FlatShading });
                const mesh = new THREE.Mesh(child.geometry.clone(), material)
                mesh.castShadow = true;
                mesh.receiveShadow = false;
                geometries.push(mesh);
            }
        })
        return geometries;
    });
    let buildingsInPath = []
    const world = useRef(0);
    const sphericalHelper = new THREE.Spherical();
    useEffect(() => {
        const sides = 40;
        const tiers = 40;
        const worldRadius = 26;
        world.current = generateWorld({ sides, tiers, worldRadius });
        console.log("IN USE EFFECT:", buildings);
        if (buildings) generateBuildings({ world, buildings, buildingsInPath, sphericalHelper, worldRadius });
        scene.add(world.current);
        camera.fov = 50;
        // camera.far = 30000; // TODO change me
        // camera.position.y = 0.2; // TODO remove
        camera.position.z = 6.5;
        camera.position.y = 1.8;
        // let lookAtPos = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z); // TODO remove
        // lookAtPos.y = 0; // TODO remove
        // camera.lookAt(lookAtPos); // TODO remove
        const fogColor = new THREE.Color(0xffffff);
        scene.background = fogColor;
        scene.fog = new THREE.Fog(fogColor, 0.0025, 20);
        console.log(camera.position);
    }, [buildings])
    // let world;
    // if (!worldCreated){
    // setWorldCreated(true);
    // }
    useRender(() => {
        if (world.current) world.current.rotation.x += rollingSpeed;
        // doBuildingLogic({buildingsInPath, camera});
        // camera.rotation.x -= cameraRollingSpeed;
        // if (cameraSphere.position.y <= cameraBaseY) {
        //     // 	jumping=false;
        //     bounceValue = (Math.random() * 0.04) + 0.005;
        // }
        // cameraSphere.position.y += bounceValue;
        // cameraSphere.position.x = THREE.Math.lerp(cameraSphere.position.x, currentLane, 2 * clock.getDelta());//clock.getElapsedTime());
        // bounceValue -= gravity;
        // camera.position.y = .1;
        // let lookAtPos = camera.position.copy(); // TODO this is erroring on 'Cannot read property 'x' of undefined'
        // let lookAtPos = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
        // lookAtPos.y = 0;
        // camera.lookAt(lookAtPos);
    })
    return (
        <>
            <Controls />
            {/* <BloomEffect camera={camera} /> */}
            {/* <Advanced2Effect camera={camera} /> */}
            {/* <TileGenerator
                tileSize={1}
                grid={tileGridSize}
                tileComponent={CityTile}
                tileResources={buildings}
            /> */}

            {/* <directionalLight intensity={3.5} position={camera.position} /> */}
            <spotLight
                castShadow
                intensity={2}
                position={
                    [camera.position.x,
                    camera.position.y + 1,
                    camera.position.z]
                }
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />
        </>
    );
}

export default function Release0009_Javonntte({ }) {
    return (
        <>
            <Canvas id="canvas"
                onCreated={({ gl }) => {
                    gl.shadowMap.enabled = true
                    //     gl.shadowMap.type = THREE.PCFSoftShadowMap
                }}>
                <Scene />
            </Canvas>
        </>
    );
}