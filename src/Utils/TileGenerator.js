import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useThree, useResource, useRender } from 'react-three-fiber';

function DefaultTileFloor(props) {
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

export function Tile(props) {
    return (
        <group key={props.name}>
            {props.floor ? props.floor : DefaultTileFloor(props)}
            {props.elements}
        </group>
    );
}

export default function TileGenerator({ size, grid, component }) {
    // const size = props.size;
    // const grid = props.grid;
    // const component = props.component;

    const { camera, scene } = useThree();
    const boundary = useRef({ x: 0, z: 0 });
    const [updatedTiles, setUpdatedTiles] = useState(false);
    // const [tiles, setTiles] = useState({})
    const [time, setTime] = useState(0);
    let tiles = {};
    // TODO how to include this initialization in a hook/in the cycle
    addTiles();

    useEffect(() => {
        if (shouldTriggerTileGeneration(boundary.current, camera.position, size)) {
            boundary.current = { x: camera.position.x, z: camera.position.z };
            addTiles(time);
            refreshTiles(time);
            setUpdatedTiles(true);
        } else {
            setUpdatedTiles(false);
        }
    }, [updatedTiles]);

    useRender((state, time) => {
        setTime(time);
    });

    
    function addTiles() {
        // force integer position rounded to nearest tilesize (integers for navigation)
        const cameraX = Math.floor(camera.position.x / size) * size;
        const cameraZ = Math.floor(camera.position.z / size) * size;
        const halfTiles = Math.floor(grid / 2);
        for (let x = -halfTiles; x < halfTiles; x++) {
            for (let z = -halfTiles; z < halfTiles; z++) {
                const pos = new THREE.Vector3((x * size + cameraX), 0, (z * size + cameraZ));
                addTile(pos);
            }
        }
    }

    function addTile(pos) {
        const tilename = nameTile(pos);
        if (!tiles.hasOwnProperty(tilename)) {
            tiles[tilename] = {
                pos: pos,
                updated: time,
                name: tilename,
                size: size
            };
        } else {
            tiles[tilename].updated = time;
        }
    }

    function destroyTile(tile) {
        scene.remove(tile);
        delete tiles[tile.name];
    }

    function refreshTiles(time) {
        const newTiles = {}
        for (const tile of Object.values(tiles)) {
            if (tile.updated != time) {
                destroyTile(tile);
            } else {
                newTiles[tile.name] = tile;
            }
        }
        tiles = newTiles;
    }

    function shouldTriggerTileGeneration(prevPos, curPos, size) {
        const xMove = curPos.x - prevPos.x;
        const zMove = curPos.z - prevPos.z;
        return Math.abs(xMove) >= size || Math.abs(zMove) >= size;
    }

    function nameTile(pos) {
        return "tile_" + pos.x + "_" + pos.z;
    }

    return Object.values(tiles).map((props) => component(props));
}
