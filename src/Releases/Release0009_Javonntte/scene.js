import React, { Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useResource, useThree } from 'react-three-fiber';
import { useGLTF } from "../../Utils/hooks";
import { CloudMaterial, Facade04Material, Facade10Material, Facade12Material, FoamGripMaterial, Metal03Material, Windows1Material } from '../../Utils/materials';
import { Asteroids } from './Asteroids';
import { onBuildingsLoaded } from "./Buildings";
import Car from './car/Car';
import * as C from "./constants";
import { FixedLights } from './lights';
import { asteroidNeighborhoods, worldNeighborhoods } from './neighborhoods';
import Road from './Road';
import { World } from './World';
import { BloomFilmEffect } from '../../Utils/Effects';
import Stars from './Stars';
import DetroitLogo from './DetroitLogo';
import { Controls } from './controls';

export function Scene({ colorTheme, onTrackSelect }) { 
    const { scene } = useThree();
    const [loadingBuildings, buildingGeometries] = useGLTF(C.BUILDINGS_URL, onBuildingsLoaded);
    const [cloudMaterialRef, cloudMaterial] = useResource();
    const [foamGripMaterialRef, foamGripMaterial] = useResource();
    const [windows1MaterialRef, windows1Material] = useResource();
    const [facade04MaterialRef, facade04Material] = useResource();
    const [facade10MaterialRef, facade10Material] = useResource();
    const [facade12MaterialRef, facade12Material] = useResource();
    const [metal03MaterialRef, metal03Material] = useResource();
   
    useEffect(() => {
        scene.background = colorTheme.background;
        scene.fog = colorTheme.fog;
    }, [colorTheme])

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
                        speed={20}
                        roadOffset={1}
                        onTrackSelect={onTrackSelect}
                    />
                </Road>
                <DetroitLogo />
            </Suspense>
            {!loadingBuildings && buildingGeometries && foamGripMaterialRef &&
                <>
                    <World
                        surfaceColor={colorTheme.worldSurface}
                        neighborhoods={worldNeighborhoods}
                        buildings={{
                            geometries: buildingGeometries,
                            materials: [metal03Material, foamGripMaterial, facade10Material],
                            loaded: !loadingBuildings,
                        }}
                    />
                    <Asteroids
                        neighborhoods={asteroidNeighborhoods}
                        buildings={{
                            geometries: buildingGeometries,
                            materials: [foamGripMaterial],
                            loaded: !loadingBuildings,
                        }}
                    />
                </>
            }
            <Stars radius={C.ASTEROID_BELT_RADIUS / 40} colors={colorTheme.starColors} />
            <BloomFilmEffect />
        </>
    );
}
