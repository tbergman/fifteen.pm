import React, { useEffect } from 'react';
import { Canvas, extend, useRender, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { BloomEffect } from "../../Utils/Effects";
import { useGLTF } from "../../Utils/hooks";
import { loadBuildings } from "./buildings";
import { BUILDINGS_URL } from "./constants";
import { TileGenerator } from './face';
import "./index.css";
import { CityTile2 } from "./tiles";
import { Controls } from "./controls";
extend({ OrbitControls });

function Scene() {
    /* Note: Known behavior that useThree re-renders childrens thrice:
       issue: https://github.com/drcmda/react-three-fiber/issues/66
       example: https://codesandbox.io/s/use-three-renders-thrice-i4k6c
       tldr: Developer says that changing this behavior requires a major version bump and will be breaking.
       Their general recommendation/philosophy is that if you are "declaring calculations" they should implement useMemo
       (For instance: a complicated geometry.)
     */
    const { camera, scene } = useThree();
    // TODO: this value should be a factor of the size of the user's screen...?
    const [loadingBuildings, buildings] = useGLTF(BUILDINGS_URL, loadBuildings);
    const worldRadius = 24;
    const startPos = new THREE.Vector3(0, worldRadius * .25, -worldRadius * 1.01);
    const lookAt = new THREE.Vector3(0, -worldRadius * 1.5, 1); // TODO not sure why there's an inversion in placement of tiles in TileGenerator
    useEffect(() => {
        const fogColor = new THREE.Color(0xffffff);
        scene.background = fogColor;
        scene.fog = new THREE.FogExp2(0xf0fff0, 0.24);
        camera.position.copy(startPos);
        camera.lookAt(lookAt);
        camera.up.set(0, -1, 0); // TODO not sure why there's an inversion in placement of tiles in TileGenerator
    }, [buildings])
    return (
        <>
            <Controls
                dampingFactor={.5}
                rotateSpeed={.01}
                enableZoom={false}
                autoRotate={true}
                enableKeys={false}
                target={lookAt}
                maxDistance={96}
                maxPolarAngle={Math.PI / 5}
                minPolarAngle={Math.PI / 6}
            />
            {/* <BloomEffect
                camera={camera}
                radius={1}
                threshold={.9}
                strength={0.2}
            /> */}
            {/* <mesh position={new THREE.Vector3().copy(startPos)}>
                <boxGeometry attach="geometry" args={[1]} />
                <meshBasicMaterial attach="material" color="red" />
            </mesh> */}
            {buildings && <TileGenerator
                geometries={buildings}
                // sphereGeometry={sphereGeometry}
                offset={new THREE.Vector3} // TODO i dont get how to do this
                radius={worldRadius}
                sides={40}
                tiers={40}
                startPos={startPos}
                maxHeight={0.1}
                // TODO
                tileComponent={CityTile2}
            />}
            {/* <Advanced2Effect camera={camera} />
                 <TileGenerator
            //     tileSize={1}
            //     grid={tileGridSize}
            //     tileComponent={CityTile}
            //     tileResources={buildings}
            // /> */}
            <ambientLight />
            <directionalLight intensity={1.5} position={camera.position} />
            <spotLight
                castShadow
                intensity={2}
                position={startPos}
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
                    gl.shadowMap.type = THREE.PCFSoftShadowMap
                }}>
                <Scene />
            </Canvas>
        </>
    );
}