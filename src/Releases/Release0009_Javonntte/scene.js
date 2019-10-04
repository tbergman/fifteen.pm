import React, { useEffect } from 'react';
import { useResource, useThree, useRender } from 'react-three-fiber';
import * as THREE from 'three';
import { useGLTF } from "../../Utils/hooks";
import {
    Facade12Material,
    CloudMaterial, FoamGripMaterial, Windows1Material, Metal03Material
} from '../../Utils/materials';
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
    const [foamGripMaterialRef, foamGripMaterial] = useResource();
    const [windows1MaterialRef, windows1Material] = useResource();
    const [facade12MaterialRef, facade12Material] = useResource();
    const [metal03MaterialRef, metal03Material] = useResource();
    const lookAt = new THREE.Vector3(0, C.WORLD_RADIUS - C.WORLD_RADIUS * .5, C.WORLD_RADIUS - C.WORLD_RADIUS * .1);

    useEffect(() => {
        // These actions must occur after buildings load.
        camera.position.copy(C.START_POS);
        camera.lookAt(lookAt);
    }, [buildingGeometries])


    return (
        <>
            {/* use one material for all buildings  */}
            <FoamGripMaterial materialRef={foamGripMaterialRef} />
            <CloudMaterial materialRef={cloudMaterialRef} emissive={0xd4af37} />
            <Windows1Material materialRef={windows1MaterialRef} />
            <Facade12Material materialRef={facade12MaterialRef} />
            <Metal03Material materialRef={metal03MaterialRef} />
            {/* <FoamGripMaterial materialRef={cloudMaterialRef} /> */}
            <Camera
                fov={70}
                near={1}
                far={5000}
                lightProps={{
                    intensity: 1.1,
                    // penumbra: 0.1,
                    distance: 100,
                    shadowCameraNear: 1,
                    shadowCameraFar: 200,
                    shadowMapSizeWidth: 512,
                    shadowMapSizeHeight: 512,
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
            {facade12Material && windows1Material && foamGripMaterial && metal03Material && !loadingBuildings ?
                <World
                    track={track}
                    // startPos={startPos}
                    buildings={{
                        geometries: buildingGeometries,
                        materials: [metal03Material, facade12Material, foamGripMaterial],
                        loaded: !loadingBuildings,
                    }}
                /> : null
            }
        </>
    );
}
