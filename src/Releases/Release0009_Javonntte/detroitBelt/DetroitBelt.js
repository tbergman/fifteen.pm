import React, { useRef, useMemo, useContext, useEffect, useState } from 'react';
import * as THREE from 'three';

import { randomPointsOnSphere, selectNRandomFromArray } from '../../../Utils/random';

import * as C from '../constants';
import { AsteroidsSurface, generateAsteroidSurfaces, AsteroidBelt, generateAsteroidNeighborhoods } from './Asteroids';
import { BuildingsContext } from './BuildingsContext';
import { generateTilesets } from './tiles';
import { worldNeighborhoods, WorldSurface } from './World';

// TODO can we clean this up...
export default function DetroitBelt({ colors }) {
    const { buildings, loaded: buildingsLoaded } = useContext(BuildingsContext);
    const [meshes, setMeshes] = useState();
    const [asteroidSurfaces, asteroidNeighborhoods] = useMemo(() => {
        const surfaces = generateAsteroidSurfaces({
            beltRadius: C.ASTEROID_BELT_RADIUS,
            beltCenter: C.ASTEROID_BELT_CENTER,
            numAsteroids: C.NUM_ASTEROIDS,
            maxAsteroidRadius: C.ASTEROID_MAX_RADIUS,
            maxAsteroidNoise: C.ASTEROID_MAX_FACE_NOISE,
        })
        console.log('surfaces', surfaces);
        const neighborhoods = generateAsteroidNeighborhoods(surfaces.instances);
        return [surfaces, neighborhoods]
    });
    useEffect(() => {
        if (buildingsLoaded) {
            setMeshes(generateTilesets({
                buildings,
                groups: [worldNeighborhoods, ...asteroidNeighborhoods],
            }));
        }
    }, [buildingsLoaded]);

    return <>
        {/* <WorldSurface geometry={worldNeighborhoods.surface} color={colors.world} /> */}
        <AsteroidsSurface geometry={asteroidSurfaces.geometry} {...colors.asteroid} />
        {meshes && Object.keys(meshes).map(meshName => {
            return <primitive key={meshName}
                object={meshes[meshName]}
            />
        })
        }
    </>
}
