import React, { Suspense, useRef, useMemo, useEffect, useReducer, useState } from 'react';
import { extend, useThree, useResource, useRender, Canvas } from 'react-three-fiber';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useSpring, a } from "react-spring/three";
import TileGenerator, { Tile } from "../../Utils/TileGenerator";
import "./index.css";
import { assetPath9 } from "./utils";


extend({ OrbitControls });

// TODO: Replace the current loadGLTF in ../../Utils/Loaders with this one...
function loadGLTF(url, onSuccess) {
    return Promise.resolve(
        new Promise((resolve, reject) => {
            new GLTFLoader().load(url, resolve, null, reject)
        }).then(gltf => onSuccess(gltf)));
}

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

function WeirdBuilding(props) {
    const [buildings, setBuildings] = useState(false)
    const url = assetPath9("objects/structures/weirdos1.glb");
    const onSuccess = (gltf) => {
        const geometries = {}
        gltf.scene.traverse(child => {
            if (child.isMesh) {
                geometries[child.name] = child.geometry.clone();
            }
        })
        return geometries
    }
    useEffect(() => void loadGLTF(url, onSuccess).then(m => setBuildings(m)), [setBuildings])
    if (buildings) {
        console.log('buildings?', buildings)
    }
    return buildings ? (
        <mesh geometry={buildings["disco1"]} {...props} >
            <meshPhysicalMaterial
                attach="material"
                roughness={0.8}
                metalness={0.6}
                emissive="#a4f20d"
                // emissiveIntensity={active ? 0.1 : 0}
                color="#01000"
                fog={true}
                shininess={0.5}
            />
        </mesh>
    ) : null;
}

function WeirdBuildings(props) {
    // return <Suspense fallback={<RedCube {...props} />}><WeirdBuilding {...props} />}</Suspense>
    return <WeirdBuilding
        key={props.name}
        position={props.pos}
        // position={[stones[0].x, 0, stones[0].z]}
        // scale={[1.3, 1.3, 1.3]}
        // rotation={stones[0].r}
        // meshName={stones[0].n}
        // active={stones[0].active}
        // castShadow
        // receiveShadow
        // onClick={stones[0].active ? onActiveClick : null} />
        {...props}
    />
}


function CityTile(props) {
    props.children = WeirdBuildings(props);
    return Tile(props)
}


function Scene() {
    const { camera } = useThree();
    useRender(() => {
        camera.position.y = .1;
    })
    return (
        <>
            <Controls />
            <TileGenerator Tile={CityTile} tileSize={10} />
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
}

export default function Release0009_Javonntte({ }) {
    // TODO: the id for Canvas should be "canvas" and its css should live alongside a generic release canvas
    return (
        <Canvas id="root"
            onCreated={({ gl }) => {
                gl.shadowMap.enabled = true
                gl.shadowMap.type = THREE.PCFSoftShadowMap
            }}>
            <Scene />
        </Canvas>
    );
}