import React, { Suspense, useEffect, useState } from 'react';
import { useResource, useThree, useFrame } from 'react-three-fiber';
import { Asteroids } from './detroitBelt/Asteroids';
import Car from './car/Car';
import * as THREE from 'three';
import * as C from "./constants";
import { FixedLights } from './lights';
import Road from './Road';
import { World } from './detroitBelt/World';
import { BloomFilmEffect } from '../../Utils/Effects';
import Stars from './Stars';
import DetroitLogo from './DetroitLogo';
import { Controls } from './controls';
import { BuildingsProvider } from './detroitBelt/BuildingsContext';
import { MaterialsProvider } from './MaterialsContext';
import DetroitBelt from './detroitBelt/DetroitBelt';
import Sky from './Sky';

export function Scene({ setContentReady, theme, onThemeSelect }) {
    const { scene, camera } = useThree();

    useEffect(() => {
        // scene.background = colorTheme.background;
        scene.fog = theme.fog;
    }, [theme])

    return (
        <>
            {/* <Controls
                // curCamera={camera}
                movementSpeed={5000}
                rollSpeed={Math.PI * .5}
            // autoForward={false}
            // dragToLook={false}
            /> */}
            <FixedLights />
            <MaterialsProvider>
                <Stars radius={2} colors={theme.starColors} />
                <Sky theme={theme.name} scale={1500} />
                <Suspense fallback={null}>
                    <Road
                        closed={true}
                        extrusionSegments={10}
                        radius={2}
                        radiusSegments={4}
                    >
                        <Car
                            onThemeSelect={onThemeSelect} headlightsColor={theme.headlights} />
                    </Road>
                    <BuildingsProvider>
                        <DetroitBelt
                            setContentReady={setContentReady}
                            theme={theme}
                        />
                    </BuildingsProvider>
                </Suspense>
                <BloomFilmEffect />
            </MaterialsProvider >
        </>
    );
}
