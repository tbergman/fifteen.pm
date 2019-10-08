import React, { useEffect, useRef } from 'react';
import { useResource, useThree, useRender } from 'react-three-fiber';
import * as THREE from 'three';
import { useGLTF } from "../../Utils/hooks";
import {
    Facade04Material,
    Facade10Material,
    Facade12Material,
    CloudMaterial, FoamGripMaterial, Windows1Material, Metal03Material
} from '../../Utils/materials';
import { onBuildingsLoaded } from "./buildings";
import { Camera } from './camera';
import * as C from "./constants";
import { Controls } from "./controls";
import "./index.css";
import { FixedLights } from './lights';
import { AsteroidBelt } from './AsteroidBelt';
import { generateAsteroids } from './asteroids';
import { Stars } from './stars';

export function Scene({ track }) {
    /* Note: Known behavior that useThree re-renders childrens thrice:
       issue: https://github.com/drcmda/react-three-fiber/issues/66
       example: https://codesandbox.io/s/use-three-renders-thrice-i4k6c
       tldr: Developer says that changing this behavior requires a major version bump and will be breaking.
       Their general recommendation/philosophy is that if you are "declaring calculations" they should implement useMemo
       (For instance: a complicated geometry.)
     */
    const { camera, canvas, scene } = useThree();
    const [loadingBuildings, buildingGeometries] = useGLTF(C.BUILDINGS_URL, onBuildingsLoaded);
    const [cloudMaterialRef, cloudMaterial] = useResource();
    const [foamGripMaterialRef, foamGripMaterial] = useResource();
    const [windows1MaterialRef, windows1Material] = useResource();
    const [facade04MaterialRef, facade04Material] = useResource();
    const [facade10MaterialRef, facade10Material] = useResource();
    const [facade12MaterialRef, facade12Material] = useResource();
    const [metal03MaterialRef, metal03Material] = useResource();
    const lookAt = new THREE.Vector3(0, C.ASTEROID_MAX_RADIUS - C.ASTEROID_MAX_RADIUS * .5, C.ASTEROID_MAX_RADIUS - C.ASTEROID_MAX_RADIUS * .1);
    const asteroidFaceGroups = useRef();
    const asteroidsGeom = useRef();
    const asteroidVertexGroups = useRef();
    useEffect(() => {
        [asteroidsGeom.current, asteroidFaceGroups.current, asteroidVertexGroups.current] = generateAsteroids(
            C.ASTEROID_BELT_RADIUS,
            C.ASTEROID_BELT_CENTER,
            C.NUM_ASTEROIDS,
            C.ASTEROID_MAX_RADIUS,
            C.ASTEROID_MAX_SIDES,
            C.ASTEROID_MAX_TIERS,
            C.ASTEROID_MAX_FACE_HEIGHT,
        )
    }, [])
    useEffect(() => { scene.background = new THREE.Color("black") });
    useEffect(() => {
        // These actions must occur after buildings load.
        camera.position.copy(C.START_POS);
        camera.lookAt(lookAt);

        // scene.fog = new THREE.FogExp2(0x0000ff, 0.1);

    }, [buildingGeometries])

    return (
        <>
            {/* use one material for all buildings  */}
            <FoamGripMaterial materialRef={foamGripMaterialRef} color={0x0000af} />
            <CloudMaterial materialRef={cloudMaterialRef} emissive={0xd4af37} />
            <Windows1Material materialRef={windows1MaterialRef} />
            <Facade10Material materialRef={facade10MaterialRef} />
            <Facade04Material materialRef={facade04MaterialRef} />
            <Facade12Material materialRef={facade12MaterialRef} />
            <Metal03Material materialRef={metal03MaterialRef} />
            {/* <FoamGripMaterial materialRef={cloudMaterialRef} /> */}
            <Camera
                maxDist={C.MAX_CAMERA_DIST}
                minDist={C.MIN_CAMERA_DIST}
                fov={70}
                near={1}
                far={10000}
                center={C.WORLD_CENTER}
                lightProps={{
                    intensity: 1.1,
                    // penumbra: 0.1,
                    distance: 10000,
                    shadowCameraNear: 1,
                    shadowCameraFar: 200,
                    shadowMapSizeWidth: 512,
                    shadowMapSizeHeight: 512,
                }}
            />
            <Controls
                radius={C.ASTEROID_MAX_RADIUS}
                movementSpeed={5000}
                domElement={canvas}
                rollSpeed={Math.PI * 2}
                autoForward={false}
                dragToLook={false}
            />
            <FixedLights />
            <Stars
                radius={C.ASTEROID_BELT_RADIUS/4}
            />
            {asteroidsGeom.current && foamGripMaterialRef && facade04Material && facade12Material && facade10Material && !loadingBuildings ?
                <>
                    <AsteroidBelt
                        track={track}
                        // TODO can combine this all into a n object or refernece directly the buffergeom
                        asteroidsGeometry={asteroidsGeom.current}
                        asteroidFaceGroups={asteroidFaceGroups.current}
                        asteroidVertexGroups={asteroidVertexGroups.current}
                        // startPos={startPos}
                        buildings={{
                            geometries: buildingGeometries,
                            materials: [foamGripMaterial],//acade12Material],//[metal03Material, facade12Material, foamGripMaterial],
                            loaded: !loadingBuildings,
                        }}
                    />
                    {/* <FlatWorld
                        buildings={{
                            geometries: buildingGeometries,
                            materials: [foamGripMaterial],//acade12Material],//[metal03Material, facade12Material, foamGripMaterial],
                            loaded: !loadingBuildings,
                        }}
                    /> */}
                </> : null

            }
        </>
    );
}
