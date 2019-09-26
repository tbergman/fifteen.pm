import React, { useEffect } from 'react';
import { useResource, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { useGLTF } from "../../Utils/hooks";
import { CloudMaterial } from '../../Utils/materials';
import { onBuildingsLoaded } from "./buildings";
import { Camera } from './camera';
import * as C from "./constants";
import { Controls } from "./controls";
import "./index.css";
import { FixedLights } from './lights';
import { World } from './world';
import { Stars } from './stars';
export function Scene({ track }) {
    /* Note: Known behavior that useThree re-renders childrens thrice:
       issue: https://github.com/drcmda/react-three-fiber/issues/66
       example: https://codesandbox.io/s/use-three-renders-thrice-i4k6c
       tldr: Developer says that changing this behavior requires a major version bump and will be breaking.
       Their general recommendation/philosophy is that if you are "declaring calculations" they should implement useMemo
       (For instance: a complicated geometry.)
     */
    const { camera, canvas, gl } = useThree();
    const [loadingBuildings, buildingGeometries] = useGLTF(C.BUILDINGS_URL, onBuildingsLoaded);
    const [cloudMaterialRef, cloudMaterial] = useResource();
    const startPos = new THREE.Vector3(0, 0, C.WORLD_RADIUS * 1.13);
    const lookAt = new THREE.Vector3(0, C.WORLD_RADIUS - C.WORLD_RADIUS * .5, C.WORLD_RADIUS - C.WORLD_RADIUS * .1);

    useEffect(() => {
        // These actions must occur after buildings load.
        camera.position.copy(startPos);
        camera.lookAt(lookAt);
        // camera.position.z = 40;
    }, [buildingGeometries])

    return (
        <>
            {/* use one material for all buildings  */}
            <CloudMaterial materialRef={cloudMaterialRef} />
            <Camera
                fov={70}
                near={1}
                far={5000}
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
                radius={C.WORLD_RADIUS}
                movementSpeed={300}
                domElement={canvas}
                rollSpeed={Math.PI * 2}
                autoForward={false}
                dragToLook={false}
            />
            <FixedLights />
            <Stars
                radius={C.WORLD_RADIUS}
            // colors={track.theme.starColors}
            />
            {cloudMaterial && !loadingBuildings && track &&
                <World
                    track={track}
                    // startPos={startPos}
                    buildings={{
                        geometries: buildingGeometries,
                        material: cloudMaterial,
                        loaded: !loadingBuildings,
                    }}
                />
            }
        </>
    );
}
