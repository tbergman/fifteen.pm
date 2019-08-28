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
function generateWorld() {
    const worldRadius = 26;
    var sides = 40;
    var tiers = 40;
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
    // addWorldTrees();
    return rollingGroundSphere;
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
        const geometries = {}
        gltf.scene.traverse(child => {
            if (child.isMesh) {
                child.geometry.center();
                geometries[child.name] = child.geometry.clone();
            }
        })
        return geometries;
    });
    const world = useRef(0);
    useEffect(() => {
        world.current = generateWorld();
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
    }, [])
    // let world;
    // if (!worldCreated){
    // setWorldCreated(true);
    // }
    useRender(() => {
        if (world.current) world.current.rotation.x += rollingSpeed;
        console.log(camera.position);
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