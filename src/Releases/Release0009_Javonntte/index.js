import React, { useRef, useEffect, useReducer, useState } from 'react';
import { extend, useThree, useResource, useRender, Canvas } from 'react-three-fiber';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import TileGenerator from "../../Utils/TileGenerator";
import "./index.css";


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
    return (
        <>
            <Controls />
            <TileGenerator tileSize={10} />
        </>
    );
}

export default function Release0009_Javonntte({ }) {
    // TODO: the id for Canvas should be "canvas" and its css should live alongside a generic release canvas
    return (
        <Canvas id="root">
            <Scene />
        </Canvas>
    );
}