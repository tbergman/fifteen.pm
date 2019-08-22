import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useThree, useResource, useRender } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

// TODO: Replace the current loadGLTF in ../../Utils/Loaders with this one...
function loadGLTF(url, onSuccess) {
    return Promise.resolve(
        new Promise((resolve, reject) => {
            new GLTFLoader().load(url, resolve, null, reject)
        }).then(gltf => onSuccess(gltf)));
}

function TileElement(props) {
    console.log('render TileElement');
    const [building, setBuilding] = useState(false);

    const onSuccess = (gltf) => {
        const geometries = {}
        gltf.scene.traverse(child => {
            if (child.isMesh) {
                geometries[child.name] = child.geometry.clone();
            }
        })
        return geometries
    }
    useEffect(() => void loadGLTF(props.url, onSuccess).then(b => setBuilding(b)), [setBuilding])
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
    return
}


function TileFloor(props) {
    const [tileMaterialRef, tileMaterial] = useResource()
    const [tileGeometryRef, tileGeometry] = useResource()
    return (
        <>
            <meshBasicMaterial ref={tileMaterialRef} color="white" />
            <planeGeometry args={[props.size - 1, props.size - 1]} ref={tileGeometryRef} />
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

// export function Tile(props) {
//     return (
//    );
// }

export default function TileGenerator({ size, grid, url, generateTile }) {
    const { camera, scene } = useThree();
    const [updatedTiles, setUpdatedTiles] = useState(false);
    const tiles = useRef({});
    const [lastUpdateTime, setLastUpdateTime] = useState(0);
    const boundary = useRef({ x: 0, z: 0 });


    useRender((state, time) => {
        if (shouldTriggerTileGeneration()) {
            setLastUpdateTime(time);
            boundary.current = { x: camera.position.x, z: camera.position.z };
            addTiles(time);
            refreshTiles(time);
        }
    });


    function addTiles(time) {
        // force integer position rounded to nearest tilesize (integers for navigation)
        const cameraX = Math.floor(camera.position.x / size) * size;
        const cameraZ = Math.floor(camera.position.z / size) * size;
        const halfTiles = Math.floor(grid / 2);
        for (let x = -halfTiles; x < halfTiles; x++) {
            for (let z = -halfTiles; z < halfTiles; z++) {
                const pos = new THREE.Vector3((x * size + cameraX), 0, (z * size + cameraZ));
                addTile(pos, time);
            }
        }
    }

    function addTile(pos, time) {
        const tilename = nameTile(pos);
        if (!tiles.current.hasOwnProperty(tilename)) {
            tiles.current[tilename] = {
                pos: pos,
                updated: time,
                url: url,
                name: tilename,
                size: size
            };
        } else {
            tiles.current[tilename].updated = time;
        }
    }

    function destroyTile(tile) {
        scene.remove(tile);
        delete tiles.current[tile.name];
    }

    function refreshTiles(time) {
        const newTiles = {}
        for (const tile of Object.values(tiles.current)) {
            if (tile.updated != time) {
                destroyTile(tile);
            } else {
                newTiles[tile.name] = tile;
            }
        }
        tiles.current = newTiles;
    }

    function shouldTriggerTileGeneration() {
        const prevPos = boundary.current;
        const curPos = camera.position;
        const xMove = Math.abs(curPos.x - prevPos.x);
        const zMove = Math.abs(curPos.z - prevPos.z);
        return xMove >= size || zMove >= size;
    }

    function nameTile(pos) {
        return "tile_" + pos.x + "_" + pos.z;
    }

    const latestTiles = Object.values(tiles.current);
    const generateTiles = function (props) {
        return <>
            <TileFloor {...props} />
            <TileElement {...props} />
        </>;
    }
    console.log("LATESTTILES: ", latestTiles, latestTiles.length);
    return <>{latestTiles.map((props) => {
        return <group key={props.name}>
            {generateTile(props)}
        </group>;
    })}</>;
}
