import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, extend, useRender, useResource, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { BloomEffect, Advanced2Effect } from "../../Utils/Effects";
import { useGLTF } from "../../Utils/hooks";
import { onBuildingsLoaded } from "./buildings";
import { BUILDINGS_URL } from "./constants";
import { SphereTileGenerator } from '../../Utils/SphereTileGenerator';
import { Camera } from './camera';
import "./index.css";
import { SkyCityTile } from "./tiles";
import { Controls } from "./controls";
import { generateWorldGeometry, generateWorldTilePatterns } from './world';
import { FixedLights } from './lights';
import { Stars } from './stars';
import { TronMaterial } from '../../Utils/materials';

function Scene() {
    /* Note: Known behavior that useThree re-renders childrens thrice:
       issue: https://github.com/drcmda/react-three-fiber/issues/66
       example: https://codesandbox.io/s/use-three-renders-thrice-i4k6c
       tldr: Developer says that changing this behavior requires a major version bump and will be breaking.
       Their general recommendation/philosophy is that if you are "declaring calculations" they should implement useMemo
       (For instance: a complicated geometry.)
     */
    const { camera, canvas } = useThree();
    // TODO: this value should be a factor of the size of the user's screen...?
    const [tronMaterialRef, tronMaterial] = useResource();
    // TODO check state loadingBuildings for loading a waiting screen (also need this for sphereTileGenerator)
    const [loadingBuildings, buildings] = useGLTF(BUILDINGS_URL, onBuildingsLoaded);
    const worldRadius = 48;
    const sides = 80;
    const tiers = 40;
    const maxHeight = 0.1;
    const worldSphereGeometry = useMemo(() => {
        return generateWorldGeometry(worldRadius, sides, tiers, maxHeight);
    }, [worldRadius, sides, tiers, maxHeight]);
    const startPos = new THREE.Vector3(0, 0, worldRadius * 1.05);
    const lookAt = new THREE.Vector3(0, worldRadius - worldRadius * .5, worldRadius - worldRadius * .1);
    const worldTilePatterns = useRef();

    useEffect(() => {
        // These actions must occur after buildings load.
        camera.position.copy(startPos);
        camera.lookAt(lookAt);
        if (buildings) worldTilePatterns.current = generateWorldTilePatterns(worldSphereGeometry, buildings);
    }, [buildings])

    return (
        <>
            {/* use one material for all buildings  */}
            <TronMaterial materialRef={tronMaterialRef} />
            <Camera
                fov={25}
                near={.1}
                far={1e7}
                lightProps={{
                    intensity: 1,
                    penumbra: 0.01,
                    distance: 60,
                    shadowCameraNear: 10,
                    shadowCameraFar: 200,
                    shadowMapSizeWidth: 2048,
                    shadowMapSizeHeight: 2048,
                }}
            />
            <Controls
                radius={worldRadius}
                movementSpeed={30}
                domElement={canvas}
                rollSpeed={Math.PI}// / 2}
                autoForward={false}
                dragToLook={false}
            />
            {/* <Advanced2Effect camera={camera} /> */}
            {/* <BloomEffect
                camera={camera}
                strength={.5}
                radius={1.}
                threshold={.75}
            /> */}
            <FixedLights />
            <Stars
                radius={worldRadius}
            />
            {tronMaterial && buildings &&
                <SphereTileGenerator
                    sphereGeometry={worldSphereGeometry}
                    startPos={startPos}
                    tileElements={{
                        buildings: {
                            geometries: buildings,
                            material: tronMaterial
                        },
                        lookup: worldTilePatterns.current,
                    }}
                    tileComponent={SkyCityTile}
                />
            }
        </>
    );
}

export default function Release0009_Javonntte({ }) {
    return (
        <>
            <Canvas id="canvas"
                onCreated={({ gl }) => {
                    gl.shadowMap.enabled = true;
                    // gl.shadowMap.type = THREE.PCFSoftShadowMap;
                    // gl.antialias = true;
                    // gl.gammaInput = true;
                    // gl.gammaOutput = true;
                    console.log(gl)
                }}>
                <Scene />
            </Canvas>
        </>
    );
}