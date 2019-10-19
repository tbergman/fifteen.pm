import React, { useState, useEffect, useRef } from 'react';
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
import { Camera } from './camera';
import * as C from "./constants";
import { Controls } from "./controls";
import "./index.css";
import { FixedLights } from './lights';
import { AsteroidBelt } from './AsteroidBelt';
import { World, FlatWorld } from './world';
import { generateAsteroids } from './asteroids';
import { Stars } from './stars';
import { onCarElementLoaded, onDashLoaded, Cadillac } from './Car';
import Car from './Car';
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
    const { camera, canvas, scene } = useThree();
    const [loadingBuildings, buildingGeometries] = useGLTF(C.BUILDINGS_URL, onBuildingsLoaded);
    const [loadingCadillacHood, cadillacHoodGeoms] = useGLTF(C.CADILLAC_HOOD_URL, onCarElementLoaded)
    const [loadingSteeringWheel, steeringWheelGeoms] = useGLTF(C.STEERING_WHEEL_URL, onCarElementLoaded)
    const [loadingDash, dashGeoms] = useGLTF(C.DASH_URL, onCarElementLoaded)
    const [lightsOn, setLightsOn] = useState(true);
    const [cloudMaterialRef, cloudMaterial] = useResource();
    const [foamGripMaterialRef, foamGripMaterial] = useResource();
    const [windows1MaterialRef, windows1Material] = useResource();
    const [facade04MaterialRef, facade04Material] = useResource();
    const [facade10MaterialRef, facade10Material] = useResource();
    const [facade12MaterialRef, facade12Material] = useResource();
    const [metal03MaterialRef, metal03Material] = useResource();

    const cameraRef = useRef();

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
            {/* 
            {!loadingSteeringWheel && !loadingDash && steeringWheelGeoms.length && dashGeoms &&


                // <Camera
                //     cameraRef={cameraRef}
                //     fov={75}
                //     near={1}
                //     far={10000}
                //     carProps={{
                //         steeringWheelGeoms: steeringWheelGeoms,
                //         // road: road,
                //         cadillacHoodGeoms: cadillacHoodGeoms,
                //         dashGeoms: dashGeoms,
                //         onLightsButtonClicked: () => {
                //             console.log("CLICKED!")   
                //             setLightsOn(lightsOn ? false : true)
                //         }
                //     }}
                //     lightProps={{
                //         intensity: 1.1,
                //         // penumbra: 0.1,
                //         distance: 10000,
                //         shadowCameraNear: .0001,
                //         shadowCameraFar: 200,
                //         shadowMapSizeWidth: 512,
                //         shadowMapSizeHeight: 512,
                //     }}
                // />
            } */}
            <Controls
                radius={C.ASTEROID_MAX_RADIUS} // in use?
                movementSpeed={500}
                rollSpeed={Math.PI * .5}
                autoForward={false}
                dragToLook={false}
            />
            <FixedLights />
            {!loadingBuildings && buildingGeometries && foamGripMaterialRef &&
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
            }
            <Road
                closed={true}
                extrusionSegments={100}
                radius={2}
                radiusSegments={3}
            >
                {(!loadingSteeringWheel && !loadingDash && steeringWheelGeoms.length && dashGeoms) ?
                    <Car
                        position={new THREE.Vector3(0, -14.5, -3)}
                        drivingProps={{
                            offset: 2,
                            scale: 1,
                            numSteps: 20, // determines the speed of the car
                        }}
                        lightProps={{
                            intensity: 1.1,
                            // penumbra: 0.1,
                            distance: 10000,
                            shadowCameraNear: .0001,
                            shadowCameraFar: 200,
                            shadowMapSizeWidth: 512,
                            shadowMapSizeHeight: 512,
                        }}
                        steeringWheelGeoms={steeringWheelGeoms}
                        cadillacHoodGeoms={cadillacHoodGeoms}
                        dashGeoms={dashGeoms}
                        onLightsButtonClicked={() => {
                            setLightsOn(lightsOn ? false : true)
                        }}
                    /> : null
                }
            </Road>
            <Stars
                radius={C.ASTEROID_BELT_RADIUS / 40}
            />
            {/* <BloomFilmEffect /> */}
        </>
    );
}
