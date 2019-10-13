import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRender, useResource, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { CloudMaterial, Ground29Material, TronMaterial } from '../../Utils/materials';
import { SphereTiles } from '../../Utils/SphereTiles';
import * as C from './constants';
import "./index.css";
import { Stars } from './stars';
import { generateInstanceGeometriesTileSet, generateInstancedTilesOnGrid } from "./instances";
import InfiniteTiles from '../../Utils/InfiniteTiles';
import { SkyCityTile } from './tiles';
import { cloneDeep } from 'lodash';
import Road from './Road';

// TODO tilt and rotationSpeed
export function generateSphereWorldGeometry(radius, sides, tiers, maxHeight) {
    const geometry = new THREE.SphereGeometry(radius, sides, tiers);
    // variate sphere heights
    var vertexIndex;
    var vertexVector = new THREE.Vector3();
    var nextVertexVector = new THREE.Vector3();
    var firstVertexVector = new THREE.Vector3();
    var offset = new THREE.Vector3();
    var currentTier = 1;
    var lerpValue = 0.5;
    var heightValue;
    for (var j = 1; j < tiers - 2; j++) {
        currentTier = j;
        for (var i = 0; i < sides; i++) {
            vertexIndex = (currentTier * sides) + 1;
            vertexVector = geometry.vertices[i + vertexIndex].clone();
            if (j % 2 !== 0) {
                if (i == 0) {
                    firstVertexVector = vertexVector.clone();
                }
                nextVertexVector = geometry.vertices[i + vertexIndex + 1].clone();
                if (i == sides - 1) {
                    nextVertexVector = firstVertexVector;
                }
                lerpValue = (Math.random() * (0.75 - 0.25)) + 0.25;
                vertexVector.lerp(nextVertexVector, lerpValue);
            }
            heightValue = (Math.random() * maxHeight) - (maxHeight / 2);
            offset = vertexVector.clone().normalize().multiplyScalar(heightValue);
            geometry.vertices[i + vertexIndex] = (vertexVector.add(offset));
        }
    }
    geometry.verticesNeedUpdate = true;
    geometry.computeBoundingSphere();
    return geometry;
}

function AtmosphereGlow({ radius }) {
    const geometry = useMemo(() => new THREE.SphereGeometry(radius, radius / 3, radius / 3))
    const [materialRef, material] = useResource();
    return <>
        <CloudMaterial materialRef={materialRef} />
        {material && <mesh
            geometry={geometry}
            material={material}
        />}
    </>
}

export function WorldSurface({ geometry, bpm }) {
    const [tronMaterialRef, tronMaterial] = useResource();
    const [ground29MaterialRef, ground29Material] = useResource();
    return <>
        <TronMaterial
            materialRef={tronMaterialRef}
            bpm={bpm}
            side={THREE.BackSide}
        />
        <Ground29Material
            materialRef={ground29MaterialRef}
            side={THREE.FrontSide}
            color={0x0000af}
        />
        {tronMaterial && ground29Material &&
            <group>
                {/* <mesh
                    geometry={geometry}
                    material={tronMaterial}
                /> */}
                <mesh
                    geometry={geometry}
                    material={ground29Material}
                    receiveShadow
                />
            </group>
        }
    </>
}

export function SphereWorld({ track, buildings, ...props }) {
    const { camera, scene } = useThree();
    const [worldRef, world] = useResource();
    const [curTrackName, setCurTrackName] = useState();
    const outerTileInstances = useRef();
    const innerTileInstances = useRef();
    const [renderTiles, setRenderTiles] = useState(true);
    const outerSphereGeometry = useMemo(() => {
        return generateSphereWorldGeometry(
            C.WORLD_RADIUS,
            C.SIDES,
            C.TIERS,
            C.MAX_WORLD_FACE_HEIGHT,
        );
    });

    const innerSphereGeometry = useMemo(() => {
        return generateSphereWorldGeometry(
            Math.floor(C.WORLD_RADIUS / 2),
            Math.floor(C.SIDES / 2),
            Math.floor(C.TIERS / 2),
            C.MAX_WORLD_FACE_HEIGHT / 2,
        );
    })

    useEffect(() => {
        if (buildings.loaded) {
            // TODO this is the naive approach but we need to combine alike geometries from both spheres at the time of instancing to reduce draw calls.
            outerTileInstances.current = generateInstanceGeometriesTileSet({ surfaceGeometry: outerSphereGeometry, buildings, ...C.NEIGHBORHOOD_PROPS });
            innerTileInstances.current = generateInstanceGeometriesTileSet({ surfaceGeometry: innerSphereGeometry, buildings, ...C.NEIGHBORHOOD_PROPS })
        }
    }, [])

    useEffect(() => {
        if (track.current) {
            track.current && setCurTrackName(track.current.name)
        }
    })

    // TODO use state for cur track here
    useEffect(() => {
        // if (track.current) {
        // scene.fog = track.theme.fogColor ? new THREE.FogExp2(track.theme.fogColor, 0.1) : null;
        // }
    }, [curTrackName])


    useRender(() => {
        if (worldRef.current) {
            // worldRef.current.rotation.x += .001;
        }
    })

    return <group ref={worldRef}>
        {world && <>
            {/* <WorldSurface
                geometry={innerSphereGeometry}
                bpm={track && track.bpm}
            /> */}
            <WorldSurface
                geometry={outerSphereGeometry}
                bpm={track && track.bpm}
            />
            {outerTileInstances.current &&
                Object.keys(outerTileInstances.current).map(instanceName => {
                    return <primitive key={instanceName}
                        object={outerTileInstances.current[instanceName]}
                    />
                })
            }
            {/* {innerTileFormations.current &&
                Object.keys(innerTileFormations.current).map(instanceName => {
                    return <primitive key={instanceName}
                        object={innerTileFormations.current[instanceName]}
                    />
                })
            } */}
            {/* <AtmosphereGlow
                    // radius={distThreshold - .2}
                /> */}
        </>
        }
    </group>
}


function InfiniteTilesTemp({ ...props }) {
    const [inNextGrid, setInNextGrid] = useState();

    return <group>
        {React.cloneElement(props.children, { ...props })}
    </group>
}

export function FlatWorld({ track, buildings, numTileSets, tileGridSize, ...props }) {
    const { camera, scene } = useThree();
    const [worldRef, world] = useResource(); // TODO is this doing anything?
    const [curTrackName, setCurTrackName] = useState();
    const instancedTileFormations = useRef();
    const innerTileFormations = useRef();
    const [renderTiles, setRenderTiles] = useState(true);

    // useEffect(() => {
    //     if (buildings.loaded) {
    //         instancedTileFormations.current = generateInstanceGeometriesTileSet({ buildings });
    //         instancedTileFormations.current = {}
    //         instancedTileFormations['a'] = generateInstanceGeometriesTileSet({ buildings }) // TODO hackign to figure out weird bug... this should be  keystied to tile ids
    //         instancedTileFormations['b'] = generateInstanceGeometriesTileSet({ buildings }) // TODO hackign to figure out weird bug... this should be  keystied to tile ids
    //         // instancedTileFormations.current = [];
    //         // for (let i = 0; i < numTileSets; i++) {
    //         //     instancedTileFormations.current.push(
    //         //         generateInstanceGeometriesTileSet({ buildings: cloneDeep(buildings) })
    //         //     );
    //         // }
    //     }
    // }, [])
    const gridSize = 10;
    const tileSize = 2;
    return <>
        <Road
            tubeProps={{
                closed: false,
                scale: 4,
                extrusionSegments: 100,
                radius: 2,
                radiusSegments: 3,
                offset: 15,
            }}
            {...props}
        />
        {/* <InfiniteTiles
            tileSize={tileSize}
            gridSize={gridSize}
            tileComponent={SkyCityTile}
        // tileResources={instancedTileFormations.current}
        /> */}
    </>
    // return <group ref={worldRef}>
    //     {/* {world && instancedTileFormations.current && */}

    //         // <InfiniteTiles
    //         //     tileSize={2}
    //         //     grid={tileGridSize}
    //         //     tileComponent={SkyCityTile}
    //         //     tileResources={instancedTileFormations.current}
    //         //>
    //         <Road
    //             close={false}
    //             scale={0.6}
    //             extrusionSegments={500}
    //             radius={8}
    //             radiusSegments={3}
    //             loopTime={50000}
    //             offset={6}
    //         />
    //         // </InfiniteTiles>
    //     // }
    // </group>
}