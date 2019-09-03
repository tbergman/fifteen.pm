import React, { useEffect, useRef, useState } from 'react';
import { useSpring } from 'react-spring/three';
import { Canvas, extend, useRender, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useGLTF } from "../../Utils/hooks";
import { BloomEffect } from "../../Utils/Effects";
import { generateBuildings, loadBuildings } from "./buildings";
import { BUILDINGS_URL } from "./constants";
import { Controls } from "./controls";
import "./index.css";
import { World } from './world';
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
    const [loadingBuildings, buildings] = useGLTF(BUILDINGS_URL, loadBuildings);
    let buildingsInPath = []
    const world = useRef(0);
    const sphericalHelper = new THREE.Spherical();
    useEffect(() => {
        // const fogColor = new THREE.Color(0xffffff);
        // scene.background = fogColor;
        // scene.fog = new THREE.Fog(fogColor, 0.0025, 20);
    }, [buildings])

    useRender(() => {

    })
    return (
        <>
            {/* <Controls /> */}
            <BloomEffect
                camera={camera}
                radius={.1}
                threshold={.1}
                strength={0.5}
                />
            <World
                sides={40}
                tiers={40}
                worldRadius={26}
                
                worldPos={new THREE.Vector3(0, 0, 0)}
                maxHeight={0.07}
                buildingGeometries={buildings}
                />
            
            
            {/* <Advanced2Effect camera={camera} /> */}
            {/* <TileGenerator
                tileSize={1}
                grid={tileGridSize}
                tileComponent={CityTile}
                tileResources={buildings}
            /> */}
            <ambientLight />
             <directionalLight intensity={1.5} position={camera.position} />
            {/*<spotLight
                castShadow
                intensity={2}
                position={
                    [camera.position.x,
                    camera.position.y + 1,
                    camera.position.z]
                }
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            /> */}
        </>
    );
}

export default function Release0009_Javonntte({ }) {
    return (
        <>
            <Canvas id="canvas"
                onCreated={({ gl }) => {
                    gl.shadowMap.enabled = true
                    gl.shadowMap.type = THREE.PCFSoftShadowMap
                }}>
                <Scene />
            </Canvas>
        </>
    );
}