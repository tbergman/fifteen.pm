import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, extend, useRender, useResource, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { BloomEffect, Advanced2Effect } from "../../Utils/Effects";
import { useGLTF } from "../../Utils/hooks";
import { onBuildingsLoaded } from "./buildings";
import { BUILDINGS_URL } from "./constants";
import { SphereFileGenerator as SphereTileGenerator } from './face';
import "./index.css";
import { CityTile } from "./tiles";
import { Controls } from "./controls";
import { generateWorldGeometry } from './world';
import { Stars } from './stars';
import { Lights } from './lights';
import { TronShader } from '../../Shaders/TronShader';
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
    const sides = 80;
    const tiers = 40;
    const maxHeight = 0.1;
    const worldSphereGeometry = useMemo(() => generateWorldGeometry(worldRadius, sides, tiers, maxHeight), [worldRadius, sides, tiers, maxHeight]);
    const startPos = new THREE.Vector3(0, 0, worldRadius * 1.05);
    const tmpBoxRefPos = new THREE.Vector3(0, 2.5, worldRadius * 1.05 - .2);
    const tmpBoxRefPos2 = new THREE.Vector3(-.2, 1.1, worldRadius * 1.05 - 1.);
    const lookAt = new THREE.Vector3(0, worldRadius - worldRadius * .5, worldRadius - worldRadius * .1);
    // TODO TMP
    const [tronMaterialRef, tronMaterial] = useResource();
    const [redMaterialRef, redMaterial] = useResource();
    useEffect(() => {
        // scene.fog = new THREE.FogExp2( 0x000000, 0.00000025 );
        camera.fov = 25;
        camera.near = 1;
        camera.far = 1e7;
        camera.position.copy(startPos);
        camera.lookAt(lookAt);
        // TODO rm me
        if (redMaterial) {
            redMaterial.onBeforeCompile = shader => {
                console.log('shader on before compile', shader);
                shader.fragmentShader = shader.fragmentShader.replace(
                    `gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,
                    `gl_FragColor = vec4( 0., 0., 1., diffuseColor.a );`
                )
            }
            redMaterial.needsUpdate = true;
        }

    }, [buildings, redMaterial])

    return (
        <>
            <meshPhongMaterial
                ref={redMaterialRef}
                receiveShadow
                color="red"
            />

            <Controls
                radius={worldRadius}
                movementSpeed={30}
                domElement={canvas}
                rollSpeed={Math.PI / 2}
                autoForward={false}
                dragToLook={false}
            />
            {/* <Advanced2Effect camera={camera} /> */}
            {/* <BloomEffect
                camera={camera}
                radius={.4}
                // exposure 
                threshold={.85}
                strength={1.5}
            /> */}
            <Lights />
            <Stars
                radius={worldRadius}
            />
            {redMaterial && <mesh
                position={tmpBoxRefPos}
                castShadow
                receiveShadow
                material={redMaterial}
            >
                <boxGeometry attach="geometry" args={[.5]} />
            </mesh>}
            <mesh
                position={tmpBoxRefPos2}
                castShadow
                receiveShadow
            >
                <boxGeometry attach="geometry" args={[.75]} />
                <meshPhongMaterial
                    color={0x808080}
                    // dithering
                    attach="material"
                />
            </mesh>
            {buildings && <SphereTileGenerator
                surfaceGeometries={buildings}
                sphereGeometry={worldSphereGeometry}
                startPos={startPos}
                // TODO
                tileComponent={CityTile}
            />}
            {/* 
                 <TileGenerator
            //     tileSize={1}
            //     grid={tileGridSize}
            //     tileComponent={CityTile}
            //     tileResources={buildings}
            // /> */}
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