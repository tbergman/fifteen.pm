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
import {GeometryUtils} from "three-full";
import { CityTile } from "./tiles";
import { assetPath9 } from "./utils";
import {generateWorld} from './world';
import {generateBuildings} from "./buildings";
import {Controls} from "./controls";
extend({ OrbitControls });

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
                const mesh = new THREE.Mesh(child.geometry.clone(), material);
                // mesh.rotation.x = Math.PI / 2;
                mesh.name = child.name;
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