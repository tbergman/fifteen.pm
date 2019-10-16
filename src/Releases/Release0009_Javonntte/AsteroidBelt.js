import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRender, useResource, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { CloudMaterial, Ground29Material, TronMaterial } from '../../Utils/materials';
import { SphereTiles } from '../../Utils/SphereTiles';
import * as C from './constants';
import "./index.css";
import { Stars } from './stars';
import { generateInstanceGeometriesFromFaces } from "./instances";
import NoiseSphereGeometry from '../../Utils/NoiseSphere';




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

export function AsteroidsSurface({ geometry, bpm }) {
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
        // color={0x0000af}
        />
        {tronMaterial && ground29Material &&
            <group>
                <mesh
                    geometry={geometry}
                    material={tronMaterial}
                />
                <mesh
                    geometry={geometry}
                    material={ground29Material}
                    receiveShadow
                />
            </group>
        }
    </>
}

export function AsteroidBelt({ track, asteroids, buildings, ...props }) {
    const { camera, scene } = useThree();
    const [astroidBeltRef, astroidBelt] = useResource();
    const [curTrackName, setCurTrackName] = useState();
    const [surfaceRendered, setSurfaceRendered] = useState(false);
    const tileFormations = useRef();
    const innerTileFormations = useRef();
    const [renderTiles, setRenderTiles] = useState(true);

    useEffect(() => {
        if (buildings.loaded && asteroids) {
            tileFormations.current = generateInstanceGeometriesFromFaces(
                asteroids.faceGroups,
                asteroids.vertexGroups,
                buildings,
                C.ASTEROID_NEIGHBORHOOD_PROPS
            );
        }
    })

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
        if (astroidBeltRef.current) {
            // astroidBeltRef.current.rotation.x += .001;
        }
    })

    return <group ref={astroidBeltRef}>
        {astroidBelt && <>
            {asteroids &&
                <AsteroidsSurface
                    geometry={asteroids.geometry}
                    bpm={track && track.bpm}
                />
            })
        }

            {tileFormations.current &&
                Object.keys(tileFormations.current).map(tId => {
                    return <primitive key={tId}
                        object={tileFormations.current[tId]}
                    />
                })
            }

        </>
        }
    </group>
}