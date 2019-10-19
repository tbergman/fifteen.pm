import React, { useRef, useState } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import {tileIdFrom2d} from './tiles';



function tileNeighbors(pos, tileSize) {
    // each tile has four neighbors
    // TODO
}

function addTiles({ tiles, time, gridSize, camera, tileSize }) {
    // force integer position rounded to nearest tilesize (integers for navigation)
    const cameraX = Math.floor(camera.position.x / tileSize) * tileSize;
    const cameraZ = Math.floor(camera.position.z / tileSize) * tileSize;
    const halfTiles = Math.floor(gridSize / 2);
    const halfTilesX = halfTiles;
    const halfTilesY = halfTiles;
    
    // TODO want to get something like this working: https://discourse.threejs.org/t/functions-to-calculate-the-visible-width-height-at-a-given-z-depth-from-a-perspective-camera/269/19
    // so that the tiles intelligently fill the visible screen with a buffer
    for (let x = -halfTilesX; x <= halfTilesX; x++) {
        for (let z = -halfTilesY; z <= halfTilesY; z++) {
            const pos = new THREE.Vector3((x * tileSize + cameraX), 0, (z * tileSize + cameraZ));
            addTile({ tiles, pos, time, tileSize });
        }
    }
}

function addTile({ tiles, pos, time, tileSize }) {
    const tileId = tileIdFrom2d({...pos});
    if (!tiles.current.hasOwnProperty(tileId)) {
        tiles.current[tileId] = {
            pos: pos,
            updated: time,
            id: tileId,
            normal: new THREE.Vector3(0, 1, 0), // TODO
            size: tileSize,
            _isInitialRender: true,
            neighbors: tileNeighbors(pos),
        };
    } else {
        tiles.current[tileId].updated = time;
        tiles.current[tileId]._isInitialRender = false;
    }
}

function refreshTiles({ scene, tiles, time }) {
    const newTiles = {}
    for (const tile of Object.values(tiles.current)) {
        if (tile.updated != time) {
            destroyTile({ tiles, tile, scene });
        } else {
            newTiles[tile.id] = tile;
        }
    }
    tiles.current = newTiles;
}

function destroyTile({ tiles, tile, scene }) {
    scene.remove(tile);
    delete tiles.current[tile.id];
}

export default function InfiniteTiles({ tileSize, gridSize, tileComponent, tileResources, ...props }) {
    const { camera, scene } = useThree();
    const tiles = useRef({});
    const [lastUpdateTime, setLastUpdateTime] = useState(0);
    const boundary = useRef({ x: tileSize * 2, z: 0 }); // trigger tile generation on load

    useFrame((state, time) => {
        if (shouldTriggerTileGeneration()) {
            boundary.current = { x: camera.position.x, z: camera.position.z };
            addTiles({ tiles, gridSize, time, camera, tileSize });
            refreshTiles({ scene, tiles, time });
            setLastUpdateTime(time);
        }
    });

    function shouldTriggerTileGeneration() {
        const prevPos = boundary.current;
        const curPos = camera.position;
        const xMove = Math.abs(curPos.x - prevPos.x);
        const zMove = Math.abs(curPos.z - prevPos.z);
        return xMove >= tileSize || zMove >= tileSize;
    }

    const curTiles = Object.values(tiles.current);
    return <>
        {curTiles.map(tileProps =>
            <group key={tileProps.id}>
                <MemoizedTile
                    tileComponent={tileComponent}
                    tileResources={tileResources}
                    tileSize={tileSize}
                    tileGrid={gridSize}
                    {...props}
                    {...tileProps}
                />
            </group>
        )}
    </>;
}


// We don't want to constantly refresh tiles - 
// that could potentially change what a tile looks like
// while the user is still viewing it!
export const MemoizedTile = React.memo(props => {
    return <>{props.tileComponent(props)}</>;
}, props => !props._isInitialRender);
