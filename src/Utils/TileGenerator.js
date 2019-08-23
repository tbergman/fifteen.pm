import React, { useRef, useState } from 'react';
import { useRender, useThree } from 'react-three-fiber';
import * as THREE from 'three';

export default function TileGenerator({ tileSize, grid, tileComponent, tileResources }) {
    const { camera, scene, size  } = useThree();
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
        const cameraX = Math.floor(camera.position.x / tileSize) * tileSize;
        const cameraZ = Math.floor(camera.position.z / tileSize) * tileSize;
        const halfTiles = Math.floor(grid / 2);
        const halfTilesX = halfTiles;
        const halfTilesY = halfTiles;
        const halfTilesX_ = Math.floor((size.width + tileSize)/tileSize);
        const halfTilesY_ = Math.floor((size.height + tileSize)/tileSize);
        console.log(halfTilesX_, size.width, tileSize);

        for (let x = -halfTilesX; x < halfTilesX; x++) {
            for (let z = -halfTilesY; z < halfTilesY; z++) {
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
                size: tileSize,
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
        return xMove >= tileSize || zMove >= tileSize;
    }

    function nameTile(pos) {
        return "tile_" + pos.x + "_" + pos.z;
    }

    return <>{Object.values(tiles.current).map((props) => {
        return <group key={props.name}>
            {tileComponent({ tileResources, ...props })}
        </group>;
    })}</>;
}
