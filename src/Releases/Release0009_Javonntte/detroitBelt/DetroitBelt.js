import { default as React, useContext, useEffect, useMemo, useState } from 'react';
import * as C from '../constants';
import { neighborhoods as asteroidNeighborhoods, AsteroidsSurface, surfaces as asteroidSurfaces } from './Asteroids';
import { BuildingsContext } from './BuildingsContext';
import { generateTilesets } from './tiles';
import { surface as worldSurface, neighborhoods as worldNeighborhoods, WorldSurface } from './World';
import BuildingInstances from './BuildingInstances';

const neighborhoods = {
    future: [worldNeighborhoods.future, ...asteroidNeighborhoods.future],
    squiggles: [worldNeighborhoods.squiggles, ...asteroidNeighborhoods.squiggles],
    industrial: [worldNeighborhoods.industrial, ...asteroidNeighborhoods.industrial],
    sunset: [worldNeighborhoods.sunset, ...asteroidNeighborhoods.sunset],
}

export default function DetroitBelt({ setContentReady, theme }) {
    const { buildings, loaded: buildingsLoaded } = useContext(BuildingsContext);

    const [worldTheme, setWorldTheme] = useState();

    const meshes = useMemo(() => {
        if (!buildingsLoaded) return;
        const _meshes = {
            future: generateTilesets({ buildings, neighborhoods: neighborhoods.future }),
            squiggles: generateTilesets({ buildings, neighborhoods: neighborhoods.squiggles }),
            industrial: generateTilesets({ buildings, neighborhoods: neighborhoods.industrial }),
            sunset: generateTilesets({ buildings, neighborhoods: neighborhoods.sunset })
        }
        setContentReady(true);
        return _meshes;
    }, [buildingsLoaded])

    useEffect(() => setWorldTheme(theme.world), [theme])

    return <>
        <AsteroidsSurface geometry={asteroidSurfaces.geometry} materialName={theme.surfaces} />
        <WorldSurface geometry={worldSurface} materialName={theme.surfaces} />
        {meshes && <BuildingInstances themeName={worldTheme} meshes={meshes} />}
    </>
}
