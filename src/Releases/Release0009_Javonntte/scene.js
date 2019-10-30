import React, { Suspense, useEffect } from 'react';
import * as THREE from 'three';
import { useResource, useThree } from 'react-three-fiber';
import { useGLTF } from "../../Utils/hooks";
import { CloudMaterial, Facade04Material, Facade10Material, Facade12Material, FoamGripMaterial, Metal03Material, Windows1Material } from '../../Utils/materials';
import { Asteroids } from './Asteroids';
import { onBuildingsLoaded } from "./Buildings";
import Car from './car/Car';
import * as C from "./constants";
import "./index.css";
import { FixedLights } from './lights';
import { asteroidNeighborhoods, worldNeighborhoods } from './neighborhoods';
import Road from './Road';
import { World } from './World';
import {BloomFilmEffect} from '../../Utils/Effects';
import Stars from './Stars';
import {Controls} from './controls';
import useMusicPlayer from '../../UI/Player/hooks';

export function Scene({ }) {
    /* Note: Known behavior that useThree re-renders childrens thrice:
       issue: https://github.com/drcmda/react-three-fiber/issues/66
       example: https://codesandbox.io/s/use-three-renders-thrice-i4k6c
       tldr: Developer says that changing this behavior requires a major version bump and will be breaking.
       Their general recommendation/philosophy is that if you are "declaring calculations" they should implement useMemo
       (For instance: a complicated geometry.)
     */
    const { scene } = useThree();
    const [loadingBuildings, buildingGeometries] = useGLTF(C.BUILDINGS_URL, onBuildingsLoaded);
    const [cloudMaterialRef, cloudMaterial] = useResource();
    const [foamGripMaterialRef, foamGripMaterial] = useResource();
    const [windows1MaterialRef, windows1Material] = useResource();
    const [facade04MaterialRef, facade04Material] = useResource();
    const [facade10MaterialRef, facade10Material] = useResource();
    const [facade12MaterialRef, facade12Material] = useResource();
    const [metal03MaterialRef, metal03Material] = useResource();
    const {playTrack} = useMusicPlayer();

    useEffect(() => {
        setColorTheme(C.TRACK_METADATA["679771262"]);
    }, [])

    function setColorTheme(metadata){
        scene.background = metadata.theme.background;
        scene.fog = metadata.theme.fog;
        // tmp
        // scene.background = new THREE.Color('white');
    }

    function onTrackSelect(trackId){
        const metadata = C.TRACK_METADATA[trackId]
        setColorTheme(metadata);
       // playTrack(metadata.index)
    }

    return (
        <>
            {/* use one material for all buildings  */}
            <FoamGripMaterial materialRef={foamGripMaterialRef} color={0x0000af} />
            <CloudMaterial materialRef={cloudMaterialRef} emissive={0xd4af37} />
            <Windows1Material materialRef={windows1MaterialRef} />
            <Facade10Material
                materialRef={facade10MaterialRef}
                // textureRepeat={{x: 2, y: 2}}
               />
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
                        speed={20}
                        roadOffset={1}
                        onTrackSelect={onTrackSelect}
                    />
                </Road>
            </Suspense>
            {!loadingBuildings && buildingGeometries && foamGripMaterialRef &&
                <>
                    <World
                        neighborhoods={worldNeighborhoods}
                        buildings={{
                            geometries: buildingGeometries,
                            materials: [metal03Material, foamGripMaterial, facade10Material], //cloudMaterial], //facade12Material],//foamGripMaterial],
                            loaded: !loadingBuildings,
                        }}
                    />
                    <Asteroids
                        neighborhoods={asteroidNeighborhoods}
                        buildings={{
                            geometries: buildingGeometries,
                            materials: [facade10Material],//[foamGripMaterial],
                            loaded: !loadingBuildings,
                        }}
                    />
                </>
            }
            <Stars
                radius={C.ASTEROID_BELT_RADIUS / 40}
            />
            <BloomFilmEffect />
        </>
    );
}
