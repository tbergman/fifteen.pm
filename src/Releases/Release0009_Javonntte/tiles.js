import React, { useEffect, useState } from 'react';
import { useResource } from 'react-three-fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { BUILDINGS_URL } from "./constants";
// TODO - in constants


function loadGLTF(url) {
    const load = url => new Promise((resolve, reject) => new GLTFLoader().load(url, resolve, null, reject))
    const extract = url =>
        load(url).then(gltf => {
            const geometries = {}
            gltf.scene.traverse(child => child.isMesh && (geometries[child.name] = child.geometry.clone()))
            return geometries
        })
    return Promise.all([extract(url)]);
}

const buildingsLoader = new GLTFLoader();

let buildings = {}
buildingsLoader.load(BUILDINGS_URL, gltf => {
    gltf.scene.traverse(child => child.isMesh && (buildings[child.name] = child.geometry.clone()))
})

// TODO: Replace the current loadGLTF in ../../Utils/Loaders with this one...
function loadGLTF2(url, onSuccess) {
    return Promise.resolve(
        new Promise((resolve, reject) => {
            new GLTFLoader().load(url, resolve, null, reject)
        }).then(gltf => onSuccess(gltf)));
}

function TileElement(props) {
    
    /* TODO
    Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
    in TileElement (created by TileGenerator)
    in group (created by TileGenerator)
    */
    // const [building, setBuilding] = useState(false);

    // const onSuccess = (gltf) => {
    //     const geometries = {}
    //     gltf.scene.traverse(child => {
    //         if (child.isMesh) {
    //             geometries[child.name] = child.geometry.clone();
    //         }
    //     })
    //     return geometries
    // }
    // useEffect(() => void loadGLTF2(props.url, onSuccess).then(b => setBuilding(b)), [setBuilding])
    // useEffect(() => void loadGLTF(BUILDINGS_URL).then(b => setBuilding(b)), [setBuilding])
    if (props.pos.z % 5 === 0 || props.pos.x % 5 === 0) {
        return null;//TileStreet(props);
    } else {
        return <>
            {buildings ? (
                <mesh
                    geometry={buildings["disco1"]} {...props}
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

function TileStreet(props) {
    return <mesh position={[props.pos.x, props.pos.y, props.pos.z]} scale={[.1, .1, .1]}>
        <boxGeometry attach="geometry" />
        <meshBasicMaterial
            attach="material"
            color="red"
        />
    </mesh>;
}



function TileFloor(props) {
    console.log("render TileFloor");
    const [tileMaterialRef, tileMaterial] = useResource()
    const [tileGeometryRef, tileGeometry] = useResource()
    return (
        <>
            <meshBasicMaterial ref={tileMaterialRef} color="white" />
            <planeGeometry args={[props.size, props.size]} ref={tileGeometryRef} />
            {tileMaterial && tileGeometry && (
                <mesh
                    material={tileMaterial}
                    geometry={tileGeometry}
                    position={props.pos}
                    rotation={new THREE.Euler(-Math.PI / 2, 0, 0)}
                />
            )}
        </>
    );
}

export const CityTile = function (props) {
    // TODO TileFloor can probably be removed
    return <>
        <TileFloor {...props} />
        <TileElement {...props} />
    </>;
}