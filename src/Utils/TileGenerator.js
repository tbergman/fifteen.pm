import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useThree, useResource, useRender } from 'react-three-fiber';

function Tile({ name, pos }) {
    const [tileMaterialRef, tileMaterial] = useResource()
    const [tileGeometryRef, tileGeometry] = useResource()
    return (
        <group key={name}>
            <meshBasicMaterial ref={tileMaterialRef} color="white" />
            <planeGeometry ref={tileGeometryRef} />
            {tileMaterial && tileGeometry && (
                <mesh material={tileMaterial} geometry={tileGeometry} position={pos} />
            )}
        </group>
    );
}

function shouldTriggerTileGeneration(prevPos, curPos, tileSize) {
    const xMove = curPos.x - prevPos.x;
    const zMove = curPos.z - prevPos.z;
    return Math.abs(xMove) >= tileSize || Math.abs(zMove) >= tileSize;
}

function nameTile(pos) {
    return "Tile_" + pos.x + "_" + pos.z;
}

export default function TileGenerator({ tileSize }) {
    const { camera, scene } = useThree();
    const boundary = useRef({ x: 0, z: 0 });
    const [updatedTiles, setUpdatedTiles] = useState(false);
    const tiles = useRef({});
    // TODO how to include this in a hook/in the cycle
    addTiles(0);


    useEffect(()=>{
        
        console.log("use effect");
        setUpdatedTiles(false);
    }, [updatedTiles]);

    useRender((state, time) => {
        if (shouldTriggerTileGeneration(boundary.current, camera.position, tileSize)) {
            console.log("add tiles")
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
        if (!tiles.current.hasOwnProperty(tilename)) {
            tiles.current[tilename] = {
                pos: pos,
                updated: time,
                name: tilename,
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

    return Object.values(tiles.current).map((tile) => Tile(tile));
}
