import React, { useRef, useMemo, useContext, useEffect, useState } from 'react';
import * as THREE from 'three';

import { randomPointsOnSphere, selectNRandomFromArray } from '../../../Utils/random';

import * as C from '../constants';
import { AsteroidsSurface, generateAsteroidAssets, AsteroidBelt, generateAsteroidNeighborhoods } from './Asteroids';
import { BuildingsContext } from './BuildingsContext';
import { generateTilesets } from './tiles';
import { worldNeighborhoods, WorldSurface } from './World';

// TODO can we clean this up...
export default function DetroitBelt({ colors }) {
    const { buildings, loaded: buildingsLoaded } = useContext(BuildingsContext);
    const [meshes, setMeshes] = useState();
    const [asteroidSurfaces, asteroidNeighborhoods] = useMemo(() => generateAsteroidAssets());
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
