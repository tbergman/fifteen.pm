import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useResource, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { CONTENT } from '../../Content';
// TODO refactor this to Menu/index?
import Menu from '../../UI/Menu/Menu';
import { useGLTF } from "../../Utils/hooks";
import { CloudMaterial } from '../../Utils/materials';
import { onBuildingsLoaded } from "./buildings";
import { Camera } from './camera';
import * as C from "./constants";
import { Controls } from "./controls";
import "./index.css";
import { FixedLights } from './lights';
import { Stars } from './stars';
import { SkyCityTile } from "./tiles";
import { World, generateWorldGeometry, generateWorldTilePatterns } from './world';
import { soundcloudTrackIdFromSrc } from '../../Utils/Audio/SoundcloudUtils';

// TODO think about how to encapsulate these initial declarations
export function Scene({ mediaRef }) {
    /* Note: Known behavior that useThree re-renders childrens thrice:
       issue: https://github.com/drcmda/react-three-fiber/issues/66
       example: https://codesandbox.io/s/use-three-renders-thrice-i4k6c
       tldr: Developer says that changing this behavior requires a major version bump and will be breaking.
       Their general recommendation/philosophy is that if you are "declaring calculations" they should implement useMemo
       (For instance: a complicated geometry.)
     */
    const { camera, canvas } = useThree();
    const [loadingBuildings, buildings] = useGLTF(C.BUILDINGS_URL, onBuildingsLoaded);
    const [cloudMaterialRef, cloudMaterial] = useResource();
    const worldTilePatterns = useRef();
    
    // TODO having trouble figuring out mediaRef state handling
    const [trackId, setTrackId] = useState();
    const [curTrackId, setCurTrackId] = useState(mediaRef.current.currentSrc); // 
    const [bpm, setBPM] = useState(120);
    // const [bpm, setBPM] = useState(C.BPM_LOOKUP[curTrackId]); <-- maybe something like ...

    const worldSphereGeometry = useMemo(() => {
        return generateWorldGeometry(C.WORLD_RADIUS, C.SIDES, C.TIERS, C.MAX_FACE_HEIGHT);
    }, [C.WORLD_RADIUS, C.SIDES, C.TIERS, C.MAX_FACE_HEIGHT]);

    const startPos = new THREE.Vector3(0, 0, C.WORLD_RADIUS * 1.13);
    const lookAt = new THREE.Vector3(0, C.WORLD_RADIUS - C.WORLD_RADIUS * .5, C.WORLD_RADIUS - C.WORLD_RADIUS * .1);
   
    useEffect(() => {
        // These actions must occur after buildings load.
        camera.position.copy(startPos);
        camera.lookAt(lookAt);
        if (buildings) worldTilePatterns.current = generateWorldTilePatterns(worldSphereGeometry, buildings);
    }, [buildings])

    // TODO having trouble figuring out mediaRef state handling
    useEffect(() => {
        const curTrackId = soundcloudTrackIdFromSrc(mediaRef.current.currentSrc);
        setTrackId(curTrackId);
        setBPM(C.BPM_LOOKUP[trackId]);
        // console.log("BPM", bpm)
    }, [curTrackId]);

    return (
        <>
            {/* use one material for all buildings  */}
            <CloudMaterial materialRef={cloudMaterialRef} />
            <Camera
                fov={25}
                near={.1}
                far={1e7}
                lightProps={{
                    intensity: 1,
                    penumbra: 0.01,
                    distance: 60,
                    shadowCameraNear: 10,
                    shadowCameraFar: 200,
                    shadowMapSizeWidth: 2048,
                    shadowMapSizeHeight: 2048,
                }}
            />
            <Controls
                radius={C.WORLD_RADIUS}
                movementSpeed={30}
                domElement={canvas}
                rollSpeed={Math.PI}// / 2}
                autoForward={false}
                dragToLook={false}
            />
            {/* <Advanced2Effect camera={camera} /> */}
            {/* <BloomEffect
                camera={camera}
                strength={.5}
                radius={1.}
                threshold={.75}
            /> */}
            <FixedLights />
            <Stars
                radius={C.WORLD_RADIUS}
            />
            {cloudMaterial && buildings &&
                <World
                    bpm={bpm}
                    sphereGeometry={worldSphereGeometry}
                    startPos={startPos}
                    tileComponent={SkyCityTile}
                    tileElements={{
                        buildings: {
                            geometries: buildings,
                            material: cloudMaterial
                        },
                        lookup: worldTilePatterns.current,
                    }}
                />
            }
        </>
    );
}
