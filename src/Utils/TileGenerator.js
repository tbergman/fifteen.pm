import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useThree, useResource, useRender } from 'react-three-fiber';




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
