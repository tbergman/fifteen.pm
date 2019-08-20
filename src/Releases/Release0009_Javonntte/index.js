import React, { Suspense, useRef, useMemo, useEffect, useReducer, useState } from 'react';
import { extend, useThree, useResource, useRender, Canvas } from 'react-three-fiber';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
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

function Street(props) {
    return <></>;
}

function TileElement(props) {
    console.log('render1');
    const [building, setBuilding] = useState(false);
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
    useEffect(() => void loadGLTF(url, onSuccess).then(b => setBuilding(b)), [setBuilding])
    if (props.pos.z % 5 === 0 || props.pos.x % 5 === 0) {
        return RedCube(props);
    } else {
        return <>
            {building ? (
                <mesh
                    geometry={building["disco1"]} {...props}
                    position={props.pos}
                    rotation={new THREE.Euler(Math.PI / 2, 0, 0)}
                >
                    <meshPhysicalMaterial
                        attach="material"
                        roughness={0.8}
                        metalness={0.6}
                        emissive="#a4f20d"
                        // emissiveIntensity={active ? 0.1 : 0}
                        color="#001000"
                        fog={true}
                        shininess={0.5}
                    />
                </mesh>
            ) : null}
        </>;
    }
}

function RedCube(props) {
    // TODO why/how do i just pass props.pos?
    return <mesh position={[props.pos.x, props.pos.y, props.pos.z]} scale={[.1, .1, .1]}>
        <boxGeometry attach="geometry" />
        <meshBasicMaterial
            attach="material"
            color="red"
        />
    </mesh>;
}


function CityTile(props) {
    console.log("render CityTile");
    // TODO - constant re-rendering must be fixed!
    props.elements = TileElement(props);
    return Tile(props);
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
    return (
        <>
            <Controls />
            <TileGenerator component={CityTile} size={1} grid={10} />
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