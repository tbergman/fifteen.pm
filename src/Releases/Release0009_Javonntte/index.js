import React, { useEffect, useRef, useState, useMemo } from 'react';
import { apply as applyThree, Canvas, extend, useRender, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import TileGenerator from "../../Utils/TileGenerator";
import { CityTile } from "./tiles";
import { assetPath9 } from "./utils";
import { useGLTF } from "../../Utils/hooks";
import { Effects } from "../../Utils/Effects";
import { BUILDINGS_URL } from "./constants";
import "./index.css";

import {apply as applySpring, useSpring, a, interpolate } from 'react-spring/three'

extend({ OrbitControls });


function Controls() {
    const controls = useRef();
    const { camera, canvas } = useThree();
    useRender(() => { controls.current && controls.current.update() });
    return (
        <orbitControls
            ref={controls}
            args={[camera, canvas]}
            enableDamping
            dampingFactor={0.1}
            rotateSpeed={0.1}
        />
    );
}

function Scene() {
    /* Note: Known behavior that useThree re-renders childrens thrice:
       issue: https://github.com/drcmda/react-three-fiber/issues/66
       example: https://codesandbox.io/s/use-three-renders-thrice-i4k6c
       tldr: Developer says that changing this behavior requires a major version bump and will be breaking.
       Their general recommendation/philosophy is that if you are "declaring calculations" they should implement useMemo
       (For instance: a complicated geometry.)
     */
    const { camera, size } = useThree();
    // TODO: this value should be a factor of the size of the user's screen...?
    const [{ top, mouse }, set] = useSpring(() => ({ top: 0, mouse: [0, 0] }))
    const [tileGridSize, setTileGrideSize] = useState(12);
    const [loadingBuildings, buildings] = useGLTF(BUILDINGS_URL, (gltf) => {
        const geometries = {}
        gltf.scene.traverse(child => {
            if (child.isMesh) {
                child.geometry.center();
                geometries[child.name] = child.geometry.clone();
            }
        })
        return geometries;
    }
    );
    useEffect(() => {
        camera.fov = 40;
    }, [])
    useRender(() => {
        // let lookAtPos = camera.position.copy(); // TODO this is erroring on 'Cannot read property 'x' of undefined'
        // let lookAtPos = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
        // lookAtPos.y = 0;
        // camera.position.y = 3.;
        // camera.lookAt(lookAtPos);
    })
    const url = assetPath9("objects/structures/weirdos1.glb");
    return (
        <>
            <Controls />
            <Effects factor={top.interpolate([0, 10], [1, 0])} />
            <TileGenerator
                tileSize={1}
                grid={tileGridSize}
                tileComponent={CityTile}
                tileResources={buildings}
            />
            <directionalLight intensity={3.5} position={[-25, 25, -25]} />
            <spotLight
                castShadow
                intensity={2}
                position={
                    [camera.position.x,
                    camera.position.y + 1,
                    camera.position.z]
                }
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />
        </>
    );
}

export default function Release0009_Javonntte({ }) {
    return (
        <>
            <Canvas id="canvas"
                onCreated={({ gl }) => {
                    gl.shadowMap.enabled = true
                    gl.shadowMap.type = THREE.PCFSoftShadowMap
                }}>
                <Scene />
            </Canvas>
        </>
    );
}