import React, { useEffect, useMemo, useRef } from 'react';
import { useResource } from 'react-three-fiber';
import * as THREE from 'three';
import { Ground29Material, TronMaterial } from '../../Utils/materials';
import NoiseSphereGeometry from '../../Utils/NoiseSphere';
import * as C from './constants';
import { generateTileset } from "./tiles";
import Buildings from './Buildings';

function generateAsteroid(radius, sides, tiers, noiseHeight, noiseWidth, center) {
    const seed = Math.random() * 1000;
    const noiseSphere = new NoiseSphereGeometry(radius, sides, tiers, { seed, noiseWidth: noiseWidth, noiseHeight: noiseHeight, center })
    noiseSphere.verticesNeedUpdate = true;
    noiseSphere.computeBoundingSphere();
    noiseSphere.computeBoundingBox();
    noiseSphere.computeFaceNormals();
    return noiseSphere;
}

function generateAsteroids(asteroidBeltRadius, asteroidBeltCenter, numAsteroids, maxAsteroidRadius, maxFaceNoise) {
    const asteroidsGeom = new THREE.Geometry()
    const asteroids = {
        geometry: undefined,
        instances: [],
    };
    for (let i = 0; i < numAsteroids; i++) {
        const center = new THREE.Vector3(
            asteroidBeltRadius * 1.5 * (Math.random() - .5),
            asteroidBeltRadius * 1.5 * (Math.random() - .5),
            asteroidBeltRadius * 1.5 * (Math.random() - .5),
        );
        const radius = THREE.Math.randInt(maxAsteroidRadius * .75, maxAsteroidRadius);
        const sides = Math.floor(radius / 4);
        const tiers = Math.floor(radius / 4);
        const noiseHeight = maxFaceNoise;
        const noiseWidth = maxFaceNoise;
        const asteroidGeom = generateAsteroid(
            // TODO parameterize
            radius,
            sides,
            tiers,
            noiseHeight,
            noiseWidth,
            center,
        )
        asteroidsGeom.merge(asteroidGeom)
        asteroids.instances.push({
            faces: asteroidGeom.faces,
            vertices: asteroidGeom.vertices,
            centroid: center,
            radius: radius,
        })
    }
    const asteroidBufferGeom = new THREE.BufferGeometry().fromGeometry(asteroidsGeom);
    asteroids.geometry = asteroidBufferGeom;
    return asteroids;
}

function AsteroidsSurface({ geometry, bpm }) {
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

export function Asteroids({ track, buildings, neighborhoods, ...props }) {
    const [asteroidBeltRef, asteroidBelt] = useResource();
    const instancedBuildingGroups = useRef();
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
            instancedBuildingGroups.current = asteroids.instances.map(instance => {
                return generateTileset({
                    surface: instance,
                    buildings,
                    neighborhoods: neighborhoods
                });
            })
        }
    })

    return <group ref={asteroidBeltRef}>
        {asteroidBelt &&
            <>
                {asteroids &&
                    <AsteroidsSurface
                        geometry={asteroids.geometry}
                        bpm={track && track.bpm}
                    />
                }
                {instancedBuildingGroups.current &&
                    instancedBuildingGroups.current.map((instancedBuildings, index) => {
                        return <Buildings key={index} instancedBuildings={instancedBuildings} />
                    })}
                }
            </>
        }
    </group>
}