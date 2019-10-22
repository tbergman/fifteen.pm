import React, { Suspense, useState, useEffect, useRef } from 'react';
import { useResource, useThree, useFrame } from 'react-three-fiber';
import * as THREE from 'three';
import { useGLTF } from "../../Utils/hooks";
import {
    Facade04Material,
    Facade10Material,
    Facade12Material,
    CloudMaterial,
    FoamGripMaterial,
    Windows1Material,
    Metal03Material,
    TronMaterial,
} from '../../Utils/materials';
import { BloomFilmEffect } from '../../Utils/Effects';
import { onBuildingsLoaded } from "./buildings";
import * as C from "./constants";
import { Controls } from "./controls";
import "./index.css";
import { FixedLights } from './lights';
import { AsteroidBelt } from './AsteroidBelt';
import { World, FlatWorld } from './world';
import { generateAsteroids } from './asteroids';
import { Stars } from './stars';
import Car, { onCarElementLoaded } from './Car';
import Road from './Road';
import { worldNeighborhoods, asteroidNeighborhoods } from './neighborhoods';


export function Scene({ track }) {
    /* Note: Known behavior that useThree re-renders childrens thrice:
       issue: https://github.com/drcmda/react-three-fiber/issues/66
       example: https://codesandbox.io/s/use-three-renders-thrice-i4k6c
       tldr: Developer says that changing this behavior requires a major version bump and will be breaking.
       Their general recommendation/philosophy is that if you are "declaring calculations" they should implement useMemo
       (For instance: a complicated geometry.)
     */
    const { canvas, scene } = useThree();
    const [loadingBuildings, buildingGeometries] = useGLTF(C.BUILDINGS_URL, onBuildingsLoaded);
    const [lightsOn, setLightsOn] = useState(true);
    const [cloudMaterialRef, cloudMaterial] = useResource();
    const [foamGripMaterialRef, foamGripMaterial] = useResource();
    const [windows1MaterialRef, windows1Material] = useResource();
    const [facade04MaterialRef, facade04Material] = useResource();
    const [facade10MaterialRef, facade10Material] = useResource();
    const [facade12MaterialRef, facade12Material] = useResource();
    const [metal03MaterialRef, metal03Material] = useResource();

    // const [cameraRef, camera] = useResource();

    useEffect(() => {
        scene.background = new THREE.Color(lightsOn ? "white" : "black");
    }, [lightsOn])

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
            {/* <Controls
                // curCamera={camera}
                movementSpeed={500}
                rollSpeed={Math.PI * .5}
                autoForward={false}
                dragToLook={false}
            /> */}
            <FixedLights />
            <Suspense fallback={null}>
                <Road
                    closed={true}
                    extrusionSegments={100}
                    radius={2}
                    radiusSegments={3}
                >
                    <Car
                        drivingProps={{
                            offset: 7,
                            scale: 1,
                            numSteps: 20, // determines the speed of the car
                        }}
                        onLightsButtonClicked={() => {
                            setLightsOn(lightsOn ? false : true)
                        }}
                    />
                </Road>
            </Suspense>
            {/* {!loadingBuildings && buildingGeometries && foamGripMaterialRef &&
                <>
                    <World
                        neighborhoods={worldNeighborhoods}
                        buildings={{
                            geometries: buildingGeometries,
                            materials: [foamGripMaterial],
                            loaded: !loadingBuildings,
                        }}
                    />
                    <AsteroidBelt
                        neighborhoods={asteroidNeighborhoods}
                        buildings={{
                            geometries: buildingGeometries,
                            materials: [foamGripMaterial],
                            loaded: !loadingBuildings,
                        }}
                    />
                </>
            } */}
            {/* <Stars
                radius={C.ASTEROID_BELT_RADIUS / 40}
            /> */}
            {/* <BloomFilmEffect /> */}
        </>
    );
}
