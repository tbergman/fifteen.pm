import React, { useMemo } from 'react';
import * as C from '../constants';
import { AsteroidNeighborhoods, AsteroidsSurface, generateAsteroidSurfaces } from './Asteroids';
import BuildingInstances from './BuildingInstances';
import { generateSphereWorldGeometry, WorldNeighborhoods, WorldSurface } from './World';


const worldSurface = generateSphereWorldGeometry(
    C.WORLD_RADIUS,
    C.WORLD_SIDES,
    C.WORLD_TIERS,
    C.MAX_WORLD_FACE_HEIGHT,
)

// TODO having issue getting these values to align with those passed into
// generateAsteroidNeighborhoods when placing this in its own useMemo,
// or even the same one.
const asteroidSurfaces = generateAsteroidSurfaces({
    beltRadius: C.ASTEROID_BELT_RADIUS,
    beltCenter: C.ASTEROID_BELT_CENTER,
    numAsteroids: C.NUM_ASTEROIDS,
    maxAsteroidRadius: C.ASTEROID_MAX_RADIUS,
})

export default function DetroitBelt({ setContentReady, theme }) {

    const worldNeighborhoods = useMemo(() => new WorldNeighborhoods(worldSurface))

    const asteroidNeighborhoods = useMemo(() => {
        return asteroidSurfaces.instances.map(surface => new AsteroidNeighborhoods(surface));
    })

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
