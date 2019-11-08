import React, { useRef, useMemo, useContext, useEffect, useState } from 'react';
import * as THREE from 'three';

import { randomPointsOnSphere, selectNRandomFromArray } from '../../../Utils/random';

import * as C from '../constants';
import { AsteroidsSurface, generateAsteroidSurfaces, AsteroidBelt, generateAsteroidNeighborhoods } from './Asteroids';
import { BuildingsContext } from './BuildingsContext';
import { generateTilesets } from './tiles';
import { worldNeighborhoods, WorldSurface } from './World';

// TODO having issue getting these values to align with those passed into generateAsteroidNeighborhoods when placing this in its own useMemo, or even the same one.
const asteroidSurfaces = generateAsteroidSurfaces({
    beltRadius: C.ASTEROID_BELT_RADIUS,
    beltCenter: C.ASTEROID_BELT_CENTER,
    numAsteroids: C.NUM_ASTEROIDS,
    maxAsteroidRadius: C.ASTEROID_MAX_RADIUS,
})

export default function DetroitBelt({ colors }) {
    const { buildings, loaded: buildingsLoaded } = useContext(BuildingsContext);
    const [meshes, setMeshes] = useState();

    const asteroidNeighborhoods = useMemo(() => {
        if (asteroidSurfaces) return generateAsteroidNeighborhoods(asteroidSurfaces);
    }, [asteroidSurfaces]);
    useEffect(() => {
        if (buildingsLoaded) {
            setMeshes(generateTilesets({
                buildings,
                groups: [worldNeighborhoods, ...asteroidNeighborhoods],
            }));
        }
    }, [buildingsLoaded]);

    return <>
        <WorldSurface geometry={worldNeighborhoods.surface} color={colors.world} />
        <AsteroidsSurface geometry={asteroidSurfaces.geometry} {...colors.asteroid} />
        {meshes && Object.keys(meshes).map(meshName => {
            return <primitive key={meshName}
                object={meshes[meshName]}
            />
        })
        }
    </>
}
