import React, { useEffect } from 'react';
import { Canvas, extend, useRender, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { BloomEffect, Advanced2Effect } from "../../Utils/Effects";
import { useGLTF } from "../../Utils/hooks";
import { onBuildingsLoaded } from "./buildings";
import { BUILDINGS_URL } from "./constants";
import { SphereFileGenerator as SphereTileGenerator } from './face';
import "./index.css";
import { CityTile2 } from "./tiles";
import { Controls } from "./controls";
import { makeWorld, makeStars } from './world';

function Scene() {
    /* Note: Known behavior that useThree re-renders childrens thrice:
       issue: https://github.com/drcmda/react-three-fiber/issues/66
       example: https://codesandbox.io/s/use-three-renders-thrice-i4k6c
       tldr: Developer says that changing this behavior requires a major version bump and will be breaking.
       Their general recommendation/philosophy is that if you are "declaring calculations" they should implement useMemo
       (For instance: a complicated geometry.)
     */
    const { camera, scene, canvas } = useThree();
    // TODO: this value should be a factor of the size of the user's screen...?
    const [loadingBuildings, buildings] = useGLTF(BUILDINGS_URL, onBuildingsLoaded);
    const worldRadius = 48;
    var rotationSpeed = 0.02;
    // TODO tilt ?
    const worldSphereGeometry = makeWorld({
        radius:worldRadius,
        rotationSpeed,
        sides: 80,
        tiers: 40,
        maxHeight:0.1,
        
    });
    /* TODO TEMP !!! */
    // TODO different materials for 'under'/'over' world? http://jsfiddle.net/j8k7yhLp/1/
    const meshPlanet = new THREE.Mesh( worldSphereGeometry,  new THREE.MeshStandardMaterial( { color: 0xe5f2f2 ,flatShading:THREE.FlatShading} ) );
    meshPlanet.material.side = THREE.DoubleSide;
    meshPlanet.rotation.y = 0;
    meshPlanet.rotation.z = 0.41; //tilt
    scene.add( meshPlanet ); 
    /* END TEMP!! */
    
    // TODO make this a jsx component!
    makeStars({radius: worldRadius, scene}) 

    const startPos = new THREE.Vector3(0, 0, worldRadius*1.05);    
    const lookAt = new THREE.Vector3(0, worldRadius - worldRadius * .5, worldRadius - worldRadius * .1);
    useRender(() => {
        // console.log(camera.position);
    })
    useEffect(() => {
        // const fogColor = new THREE.Color(0xffffff);
        // scene.background = fogColor;
        // scene.fog = new THREE.FogExp2(0xf0fff0, 0.24);
        scene.fog = new THREE.FogExp2( 0x000000, 0.00000025 );
        camera.fov = 25;
        camera.near = 1;
        camera.far = 1e7;
        camera.position.copy(startPos);
        camera.lookAt(lookAt);
    }, [buildings])
    return (
        <>
            <Controls
                radius={worldRadius}
                // target={lookAt}
                // flyer settings
                movementSpeed={30}
                domElement={canvas}
                rollSpeed={Math.PI/2}
                autoForward={false}
                dragToLook={false}
            // fpc settings
            // lookSpeed={.5}
            // movementSpeed={100}
            />
            {/* <Advanced2Effect camera={camera} /> */}
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
            {buildings && <SphereTileGenerator
                surfaceGeometries={buildings}
                sphereGeometry={worldSphereGeometry}
                startPos={startPos}
                // TODO
                tileComponent={CityTile2}
            />}
            {/* 
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
                position={camera.position}
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
                    gl.shadowMap.enabled = true;
                    gl.shadowMap.type = THREE.PCFSoftShadowMap;
                    gl.gammaInput = true;
                    gl.gammaOutput = true;
                }}>
                <Scene />
            </Canvas>
        </>
    );
}