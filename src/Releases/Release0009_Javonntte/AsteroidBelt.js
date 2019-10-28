import React, { useEffect, useMemo, useRef } from 'react';
import { useResource } from 'react-three-fiber';
import * as THREE from 'three';
import { CloudMaterial, Ground29Material, TronMaterial } from '../../Utils/materials';
import { generateAsteroids } from './asteroids';
import * as C from './constants';
import "./index.css";
import { generateInstanceGeometriesByName } from "./instances";


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

export function AsteroidBelt({ track, buildings, neighborhoods, ...props }) {
    const [asteroidBeltRef, asteroidBelt] = useResource();
    const tileInstances = useRef();
   const asteroids = useMemo(() => {
       return generateAsteroids(
            C.ASTEROID_BELT_RADIUS,
            C.ASTEROID_BELT_CENTER,
            C.NUM_ASTEROIDS,
            C.ASTEROID_MAX_RADIUS,
            C.ASTEROID_MAX_SIDES,
            C.ASTEROID_MAX_TIERS,
            C.ASTEROID_MAX_FACE_NOISE,
        )
    }, [])

    useEffect(() => {
        if (buildings.loaded) {
            // TODO this is the naive approach but we need to combine alike geometries from both spheres at the time of instancing to reduce draw calls.
            tileInstances.current = generateInstanceGeometriesByName({
                surface: asteroids,
                buildings,
                neighborhoods: neighborhoods
                
            });
        }
    })

    // useFrame(() => {
    //     if (asteroidBeltRef.current) {
    //         // astroidBeltRef.current.rotation.x += .01;
    //     }
    // })

    return <group ref={asteroidBeltRef}>
            {asteroidBelt &&
                <>
                    {asteroids &&
                        <AsteroidsSurface
                            geometry={asteroids.geometry}
                            bpm={track && track.bpm}
                        />
                    }
                    {tileInstances.current &&
                        Object.keys(tileInstances.current).map(tId => {
                            return <primitive key={tId}
                                object={tileInstances.current[tId]}
                            />
                        })
                    }
                </>
            }
        </group>
}