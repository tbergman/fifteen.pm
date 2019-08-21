import React, { Suspense, useRef, useMemo, useEffect, useReducer, useState } from 'react';
import { extend, useThree, useResource, useRender, Canvas } from 'react-three-fiber';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import TileGenerator, { Tile } from "../../Utils/TileGenerator";
import "./index.css";
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
            dampingFactor={0.1}
            rotateSpeed={0.1}
        />
    );
}

function Street(props) {
    return <></>;
}


// TODO maybe find equivalent of shouldComponentUpdate
function Scene() {
    console.log('render2');
    /* Note: Known behavior that useThree re-renders childrens thrice:
       issue: https://github.com/drcmda/react-three-fiber/issues/66
       example: https://codesandbox.io/s/use-three-renders-thrice-i4k6c
       tldr: Developer says that changing this behavior requires a major version bump and will be breaking.
       Their general recommendation/philosophy is that if you are "declaring calculations" they should implement useMemo
       (For instance: a complicated geometry.)
     */
    const { camera } = useThree();
    useEffect(() => {
        // console.log(camera);        
        /* camera defaults:
            aspect: 4.087591240875913 (width/height)
            far: 1000
            filmGauge: 35
            filmOffset: 0
            focus: 10
            fov: 75
            frustumCulled: true
        */
       camera.fov = 40;
    }, [])
    useRender(() => {
        camera.position.y = 3.;
        // let lookAtPos = camera.position.copy(); // TODO this is erroring on 'Cannot read property 'x' of undefined'
        let lookAtPos = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
        lookAtPos.y = 0;
        camera.lookAt(lookAtPos);
    })
    const url = assetPath9("objects/structures/weirdos1.glb");
    return (
        <>
            <Controls />
            <TileGenerator url={url} size={1} grid={10} />
            <directionalLight intensity={3.5} position={[-25, 25, -25]} />
            <spotLight
                castShadow
                intensity={2}
                position={[camera.position.x, camera.position.y + 1, camera.position.z]}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />
        </>
    );
    return <></>;
}

export default function Release0009_Javonntte({ }) {
    // TODO: the id for Canvas should be "canvas" and its css should live alongside a generic release canvas    
    console.log('render1');
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