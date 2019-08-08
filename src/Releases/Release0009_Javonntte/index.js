import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { extend, useThree, useRender, Canvas } from 'react-three-fiber';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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

function Tile({ pos, time, name }) {
    return (
        <group userData={{ time: time, name: name }}>
            <mesh
                rotation={new THREE.Euler(-90, 0, 0)}
                position={pos}
            >
                <planeGeometry attach="geometry" />
                <meshBasicMaterial attach="material" color="white" />
            </mesh>
        </group>
    )
}


function TileGenerator({ halfTilesX, halfTilesZ, tileSize }) {
    // let tiles = {};
    const [tiles, setTiles] = useState({});
    const [updateTime, setUpdateTime] = useState(0);
    const [startPos, setStartPos] = useState(new THREE.Vector3);
    const { camera, scene } = useThree();

    useEffect(() => {
        addTiles();
        // refreshTileMap();
        setStartPos(camera.position);
    }, [updateTime]);

    function nameTile(pos) {
        return "Tile_" + pos.x + "_" + pos.z;
    }

    function destroyTile(tile) {
        scene.remove(tile);
        delete tiles[tile.name];
    }

    function addTiles() {
        // force integer position rounded to nearest tilesize (integers for navigation)
        const cameraX = Math.floor(camera.position.x / tileSize) * tileSize;
        const cameraZ = Math.floor(camera.position.z / tileSize) * tileSize;
        for (let x = -halfTilesX; x < halfTilesX; x++) {
            for (let z = -halfTilesZ; z < halfTilesZ; z++) {
                const pos = new THREE.Vector3((x * tileSize + cameraX), 0, (z * tileSize + cameraZ));
                addTile(pos);
            }
        }
        setTiles(tiles);
    }

    function addTile(pos) {
        const tilename = nameTile(pos);
        if (!tiles.hasOwnProperty(tilename)) {
            // const tile = Tile({ pos: pos, time: updateTime, name: tilename })
            tiles[tilename] = { pos: pos, time: updateTime, name: tilename };//tile;
        } else {
            tiles[tilename].time = updateTime;

        }
    }

    function refreshTileMap() {
        const newTiles = {}
        const tileObjs = Object.values(tiles);
        for (const tile of tileObjs) {
            if (tile.time != updateTime) {
                destroyTile(tile);
            } else {
                newTiles[tile.name] = tile;
            }
        }
        setTiles(newTiles);
    }

    useRender((state, time) => {
        // how far has player moved in x and z
        const xMove = camera.position.x - startPos.x;
        const zMove = camera.position.z - startPos.z;
        if (Math.abs(xMove) >= tileSize || Math.abs(zMove) >= tileSize) {
            setUpdateTime(time);
            // addTiles();
            // // refreshTileMap();
            // setStartPos(camera.position);
        }
    })
    // TODO why does this get logged three times on mount?
    // const tileObjs = Object.values(tiles);
    // const generatedTiles = <>{tileObjs.map((tile) => tile)}</>;
    const generatedTiles = Object.values(tiles).map(function (tile) {
        return (
            <group
                key={tile.name}
                userData={{ time: tile.time, name: tile.name }}>
                <mesh
                    rotation={new THREE.Euler(-90, 0, 0)}
                    position={tile.pos}
                >
                    <planeGeometry attach="geometry" />
                    <meshBasicMaterial attach="material" color="white" />
                </mesh>
            </group>
        );
    });

    return generatedTiles
}


function Scene() {
    return (
        <>
            <Controls />
            <TileGenerator
                halfTilesX={5}
                halfTilesZ={5}
                tileSize={10} />
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