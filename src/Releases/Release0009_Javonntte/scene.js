import React, { Suspense, useEffect, useState } from 'react';
import { useResource, useThree } from 'react-three-fiber';
import { Asteroids } from './detroitBelt/Asteroids';
import Car from './car/Car';
import * as C from "./constants";
import { FixedLights } from './lights';
import Road from './Road';
import { World } from './detroitBelt/World';
import { BloomFilmEffect } from '../../Utils/Effects';
import Stars from './Stars';
import DetroitLogo from './DetroitLogo';
import { Controls } from './controls';
import { BuildingsProvider } from './detroitBelt/BuildingsContext';
import {MaterialsProvider} from './MaterialsContext';
import DetroitBelt from './detroitBelt/DetroitBelt';

export function Scene({ colorTheme, onTrackSelect }) {
    const { scene } = useThree();

    useEffect(() => {
        scene.background = colorTheme.background;
        scene.fog = colorTheme.fog;
    }, [colorTheme])

    return (
        <>
            {/* <Controls
                // curCamera={camera}
                movementSpeed={500}
                rollSpeed={Math.PI * .5}
                autoForward={false}
                dragToLook={false}
            /> */}
            {/* <FixedLights /> */}
            <MaterialsProvider>
            <Suspense fallback={null}>
                <Road
                    closed={true}
                    extrusionSegments={10}
                    radius={2}
                    radiusSegments={4}
                >
                    <Car onTrackSelect={onTrackSelect} />
                </Road>
                {/* <DetroitLogo /> */}
                <BuildingsProvider>
                    <DetroitBelt colors={colorTheme} />
                </BuildingsProvider>

            </Suspense>

            <Stars radius={C.ASTEROID_BELT_RADIUS / 40} colors={colorTheme.starColors} />
            <BloomFilmEffect />
            </MaterialsProvider>
        </>
    );
}
