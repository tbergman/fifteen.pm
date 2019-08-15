import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useThree, useResource, useRender } from 'react-three-fiber';

function DefaultTileFloor(props) {
    const [tileMaterialRef, tileMaterial] = useResource()
    const [tileGeometryRef, tileGeometry] = useResource()
    return (
        <>
            <meshBasicMaterial ref={tileMaterialRef} color="white" />
            <planeGeometry args={[props.tileSize - 1, props.tileSize - 1]} ref={tileGeometryRef} />
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
            {props.children}
        </group>
    );
}

export default function TileGenerator(props) {
    const { tileSize } = props;
    const { camera, scene } = useThree();
    const boundary = useRef({ x: 0, z: 0 });
    const [updatedTiles, setUpdatedTiles] = useState(false);
    let tiles = {};
    // TODO how to include this initialization in a hook/in the cycle
    addTiles(0);

    useEffect(() => {
        setUpdatedTiles(false);
    });

    useRender((state, time) => {
        if (shouldTriggerTileGeneration(boundary.current, camera.position, tileSize)) {
            boundary.current = { x: camera.position.x, z: camera.position.z };
            addTiles(time);
            refreshTiles(time);
            setUpdatedTiles(true);
        }
    });

    function addTiles(time) {
        // force integer position rounded to nearest tilesize (integers for navigation)
        const cameraX = Math.floor(camera.position.x / tileSize) * tileSize;
        const cameraZ = Math.floor(camera.position.z / tileSize) * tileSize;
        const halfTiles = Math.floor(tileSize / 2);
        for (let x = -halfTiles; x < halfTiles; x++) {
            for (let z = -halfTiles; z < halfTiles; z++) {
                const pos = new THREE.Vector3((x * tileSize + cameraX), 0, (z * tileSize + cameraZ));
                addTile(pos, time);
            }
        }
    }

    function addTile(pos, time) {
        const tilename = nameTile(pos);
        if (!tiles.hasOwnProperty(tilename)) {
            tiles[tilename] = {
                pos: pos,
                updated: time,
                name: tilename,
                tileSize: tileSize
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

    function shouldTriggerTileGeneration(prevPos, curPos, tileSize) {
        const xMove = curPos.x - prevPos.x;
        const zMove = curPos.z - prevPos.z;
        return Math.abs(xMove) >= tileSize || Math.abs(zMove) >= tileSize;
    }

    function nameTile(pos) {
        return "Tile_" + pos.x + "_" + pos.z;
    }

    return Object.values(tiles).map((tile) => props.Tile(tile));
}
