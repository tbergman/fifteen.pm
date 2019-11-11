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

export function Scene({ colorTheme, onThemeSelect }) {
    const { scene, camera } = useThree();

    // useEffect(() => {
    //     scene.background = colorTheme.background;
    //     scene.fog = colorTheme.fog;
    // }, [colorTheme])

    useEffect(() => {      
        // console.log("Set background");
        scene.background = new THREE.Color("black");  
        // camera.lookAt(new THREE.Vector3(0,0,-10))
        // camera.position.set([0, 0, 0]);     
    })

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
                <Stars radius={2} colors={colorTheme.starColors} />
                <Sky scale={1500} />
              
                <Suspense fallback={null}>
                <Road
                    closed={true}
                    extrusionSegments={10}
                    radius={2}
                    radiusSegments={4}
                >
                    <Car onThemeSelect={onThemeSelect} />
                </Road>
                <BuildingsProvider>
                    <DetroitBelt colors={colorTheme} />
                </BuildingsProvider>

            </Suspense>

                <BloomFilmEffect />
            </MaterialsProvider>
        </>
    );
}
