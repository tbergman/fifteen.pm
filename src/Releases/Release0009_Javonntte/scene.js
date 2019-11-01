import React, { Suspense, useEffect, useState } from 'react';
import { useResource, useThree } from 'react-three-fiber';
import { Asteroids } from './Asteroids';
import Car from './car/Car';
import * as C from "./constants";
import { FixedLights } from './lights';
import Road from './Road';
import { World } from './World';
import { BloomFilmEffect } from '../../Utils/Effects';
import Stars from './Stars';
import DetroitLogo from './DetroitLogo';
import { Controls } from './controls';
import { BuildingsProvider } from './BuildingsContext';

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
                <BuildingsProvider>
                    <World surfaceColor={colorTheme.world} />
                    <Asteroids colors={colorTheme.asteroid} />
                </BuildingsProvider>
            </Suspense>
            <Stars radius={C.ASTEROID_BELT_RADIUS / 40} colors={colorTheme.starColors} />
            <BloomFilmEffect />
        </>
    );
}
