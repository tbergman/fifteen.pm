import React, { useEffect, useRef, useState } from 'react';
import { useSpring } from 'react-spring/three';
import { Canvas, extend, useRender, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { BloomEffect, Advanced2Effect } from "../../Utils/Effects";
import { useGLTF } from "../../Utils/hooks";
import TileGenerator from "../../Utils/TileGenerator";
import { BUILDINGS_URL } from "./constants";
import "./index.css";
import { CityTile } from "./tiles";
import { assetPath9 } from "./utils";

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
            dampingFactor={0.9}
            rotateSpeed={0.2}
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
    const { camera, scene, gl } = useThree();
    console.log(gl);
    const [{ top, mouse }, set] = useSpring(() => ({ top: 0, mouse: [0, 0] }))
    // TODO: this value should be a factor of the size of the user's screen...?
    const [tileGridSize, setTileGrideSize] = useState(25);
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
        const fogColor = new THREE.Color(0xffffff); 
        scene.background = fogColor;
        scene.fog = new THREE.Fog(fogColor, 0.0025, 20);
    }, [])
    useRender(() => {
        camera.position.y = 3.;
        // let lookAtPos = camera.position.copy(); // TODO this is erroring on 'Cannot read property 'x' of undefined'
        let lookAtPos = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
        lookAtPos.y = 0;
        camera.lookAt(lookAtPos);
    })
    return (
        <>
            <Controls />
            {/* <BloomEffect camera={camera} /> */}
            {/* <Advanced2Effect camera={camera} /> */}
            <TileGenerator
                tileSize={1}
                grid={tileGridSize}
                tileComponent={CityTile}
                tileResources={buildings}
            />
            {/* <directionalLight intensity={3.5} position={camera.position} /> */}
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
                //     gl.shadowMap.type = THREE.PCFSoftShadowMap
                }}>
                <Scene />
            </Canvas>
        </>
    );
}