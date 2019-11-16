import { default as React, useContext, useEffect, useMemo, useState } from 'react';
import * as C from '../constants';
import { AsteroidNeighborhoods, AsteroidsSurface, generateAsteroidSurfaces } from './Asteroids';
import { BuildingsContext } from './BuildingsContext';
import { generateTilesets } from './tiles';
import { generateSphereWorldGeometry, WorldNeighborhoods, WorldSurface } from './World';

// TODO having issue getting these values to align with those passed into
// generateAsteroidNeighborhoods when placing this in its own useMemo,
// or even the same one.
const asteroidSurfaces = generateAsteroidSurfaces({
    beltRadius: C.ASTEROID_BELT_RADIUS,
    beltCenter: C.ASTEROID_BELT_CENTER,
    numAsteroids: C.NUM_ASTEROIDS,
    maxAsteroidRadius: C.ASTEROID_MAX_RADIUS,
})
const asteroidNeighborhoods = asteroidSurfaces.instances.map(surface => new AsteroidNeighborhoods(surface));
// tmp
const worldNeighborhoodCategories = ["squiggles"]

const worldSurface = generateSphereWorldGeometry(
    C.WORLD_RADIUS,
    C.WORLD_SIDES,
    C.WORLD_TIERS,
    C.MAX_WORLD_FACE_HEIGHT,
)

const worldNeighborhoods = {
    future: new WorldNeighborhoods(worldSurface, "future"),
    squiggles: new WorldNeighborhoods(worldSurface, "squiggles")
}

export default function DetroitBelt({ setContentReady, theme }) {
    const { buildings, loaded: buildingsLoaded } = useContext(BuildingsContext);
    const [worldTheme, setWorldTheme] = useState();
    const [meshes, setMeshes] = useState();


    const worldMeshes = useMemo(() => {
        if (!buildingsLoaded) return;
        const futureMeshes = generateTilesets({ buildings, neighborhoods: [worldNeighborhoods.future, ...asteroidNeighborhoods] })
        const squiggleMeshes = generateTilesets({ buildings, neighborhoods: [worldNeighborhoods.squiggles, ...asteroidNeighborhoods] })
        setContentReady(true);
        return { future: futureMeshes, squiggles: squiggleMeshes }
    }, [buildingsLoaded])

  

    useEffect(() => {
        setWorldTheme(theme.world)
    }, [theme])

    // useEffect(() => {
    //     if (buildingsLoaded) {
    //         setMeshes(generateTilesets({
    //             buildings,
    //             neighborhoods: [worldNeighborhood, ...asteroidNeighborhoods],
    //         }));
    //         setContentReady(true)
    //     }
    // }, [buildingsLoaded, theme]);


    return <>

        <AsteroidsSurface geometry={asteroidSurfaces.geometry} materialName={theme.surfaces} />
        {/* <BuildingInstances
            theme={theme.buildings}
            neighborhoods={[worldNeighborhood, ...asteroidNeighborhoods]}
            setContentReady={setContentReady}
        /> */}
        {buildingsLoaded && worldSurface && worldMeshes ?
            <>
                <WorldSurface geometry={worldSurface} materialName={theme.surfaces} />
                {Object.keys(worldMeshes[worldTheme]).map(meshName => {
                    return <primitive key={meshName} object={worldMeshes[worldTheme][meshName]} />
                })}
            </> : null
        }
    </>
}
