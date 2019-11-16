import React, { useRef, useMemo, useContext, useEffect, useState } from 'react';
import * as THREE from 'three';

import { randomPointsOnSphere, selectNRandomFromArray } from '../../../Utils/random';

import * as C from '../constants';
import { AsteroidsSurface, generateAsteroidSurfaces, AsteroidBelt, generateAsteroidNeighborhoods } from './Asteroids';
// import { BuildingsContext } from './BuildingsContext';
// import { generateTilesets } from './tiles';
import { WorldNeighborhoods, WorldSurface } from './World';
// import Buildings from './Buildings';
import BuildingInstances from './Buildings';

// TODO having issue getting these values to align with those passed into generateAsteroidNeighborhoods when placing this in its own useMemo, or even the same one.
const asteroidSurfaces = generateAsteroidSurfaces({
    beltRadius: C.ASTEROID_BELT_RADIUS,
    beltCenter: C.ASTEROID_BELT_CENTER,
    numAsteroids: C.NUM_ASTEROIDS,
    maxAsteroidRadius: C.ASTEROID_MAX_RADIUS,
})

export default function DetroitBelt({ setContentReady, theme }) {

    const worldNeighborhoods = useMemo(() => new WorldNeighborhoods())

    const asteroidNeighborhoods = useMemo(() => {
        if (asteroidSurfaces) return generateAsteroidNeighborhoods(asteroidSurfaces);
    }, [asteroidSurfaces]);



    return <>
        <WorldSurface geometry={worldNeighborhoods.surface} materialName={theme.surfaces} />
        <AsteroidsSurface geometry={asteroidSurfaces.geometry} materialName={theme.surfaces} />
        <BuildingInstances
            theme={theme.buildings}
            neighborhoods={[worldNeighborhoods, ...asteroidNeighborhoods]}
            setContentReady={setContentReady}
        />
    </>
}
