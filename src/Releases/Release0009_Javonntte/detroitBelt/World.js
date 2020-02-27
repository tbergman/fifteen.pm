import React, { useContext, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { randomPointsOnSphere, randomArrayVal, selectNRandomFromArray } from '../../../Utils/random';
import * as C from '../constants';
import { MaterialsContext } from '../MaterialsContext';
import BuildingInstances from './BuildingInstances';
import { BuildingsContext } from './BuildingsContext';
import { generateTilesets } from './tiles';
import { faceCentroid } from '../../../Utils/geometry';
import NoiseSphereGeometry from '../../../Utils/NoiseSphere';


class WorldNeighborhoods {
    constructor(surface, theme) {
        this.surface = surface;
        this.theme = theme;
        this.count = 100;
        this.numTiles = Math.floor(C.WORLD_RADIUS) * 2
        this.maxRadius = C.WORLD_RADIUS * 6 // Try to get this as low as possible after happy with maxSize (TODO there is probably a decent heuristic so you don't have to eyeball this)
    }

    worldRoadWidth = () => {
        switch (this.theme) {
            case C.NIGHT: {
                return C.WORLD_RADIUS / 11
            }
            case C.SUNSET: {
                return C.WORLD_RADIUS / 11
            }
            case C.DREAM: {
                return C.WORLD_RADIUS / 11
            }
            case C.NATURAL: {
                return C.WORLD_RADIUS / 11
            }
        }
    }

    worldBuildingCorriderWidth = () => {
        switch (this.theme) {
            case C.NIGHT: {
                return C.WORLD_RADIUS
            }
            case C.SUNSET: {
                return C.WORLD_RADIUS
            }
            case C.DREAM: {
                return C.WORLD_RADIUS / 5
            }
            case C.NATURAL: {
                return C.WORLD_RADIUS
            }
        }
    }

    onPath(centroid) {
        return C.WORLD_ROAD_PATH.map(pointOnPath => centroid.distanceTo(pointOnPath))
            .filter(distFromPoint => distFromPoint < this.worldRoadWidth())
            .length > 0;
    }
    tooClose(centroid) {
        return C.WORLD_ROAD_PATH.map(pointOnPath => centroid.distanceTo(pointOnPath))
            .filter(distFromPoint => distFromPoint > this.worldBuildingCorriderWidth())
            .length == C.WORLD_ROAD_PATH.length;
    }

    /*
    Return true if we should render the neighbor
    */
    rules(neighbor) {
        return !this.onPath(neighbor.centroid) && !this.tooClose(neighbor.centroid)
    }

    // options are 6,3,1,0
    subdivisions = (tile) => {
        const area = tile.triangle.getArea();
        if (this.theme == C.NIGHT) {
            if (area < C.WORLD_SMALL_TILE) {
                return Math.random() > .5 ? 1 : 0;
            } else if (area < C.WORLD_MEDIUM_TILE) {
                return Math.random() > .75 ? 3 : 0;
            } else {
                return Math.random() > .75 ? 3 : 0;
            }
        }
        if (this.theme == C.SUNSET) {
            if (area < C.WORLD_SMALL_TILE) {
                return 1
            } else if (area < C.WORLD_MEDIUM_TILE) {
                return Math.random() > .75 ? 3 : 0;
            } else {
                return Math.random() > .75 ? 6 : 0;
            }
        }
        if (this.theme == C.NATURAL) {
            return 6;
        }
        // detroit buildings
        if (this.theme == C.DREAM) {
            // return 6;
            if (area < C.WORLD_SMALL_TILE) {
                return 0;
            } else {
                return Math.random() > .5 ? 0 : 1;
            }
        }
    }

    getNeighborhoodCentroids({ surface }) {
        const sphereCenter = new THREE.Vector3();
        surface.boundingBox.getCenter(sphereCenter);
        const numRandPoints = C.WORLD_RADIUS * 2;
        const centroids = randomPointsOnSphere(C.WORLD_RADIUS, sphereCenter, numRandPoints);
        return centroids;
    }

    pickBuildings(tile, buildings) {
        const n = this.subdivisions(tile);
        return {
            allowedBuildings: buildings.filter(building => {
                return C.WORLD_BUILDING_CATEGORIES[this.theme].includes(building.name)
            }),
            subdivisions: n
        }
    }
}


export function generateSphereWorldGeometry(radius, sides, tiers, maxHeight) {
    const noiseSphere = new NoiseSphereGeometry(
        radius,
        sides,
        tiers,
        {
            centroid: new THREE.Vector3(),
            seed: 12345,
            noiseWidth: 1,
            noiseHeight: maxHeight,
            scale: { x: 1, y: 1, z: 1},
        })
    noiseSphere.verticesNeedUpdate = true;
    noiseSphere.computeBoundingSphere();
    noiseSphere.computeBoundingBox();
    noiseSphere.computeFaceNormals();
    return noiseSphere;
}

export function WorldSurface({ geometry, themeName }) {

    const { tron, ground29Purple, pockedStone2, ground29Black, rock19 } = useContext(MaterialsContext);

    const exteriorMaterial = useMemo(() => ({
        dream: pockedStone2,
        night: ground29Black,
        natural: rock19,
        sunset: ground29Purple,
    }))
    return <>
        <group>
            <mesh
                geometry={geometry}
                material={tron}
            />
            <mesh
                geometry={geometry}
                material={exteriorMaterial[themeName]}
                receiveShadow
            />
        </group>
    </>
}

export function World({ themeName, setReady }) {
    const { buildings, loaded: buildingsLoaded } = useContext(BuildingsContext);

    const [surface, meshes] = useMemo(() => {
        if (!buildingsLoaded) return [];

        const _surface = generateSphereWorldGeometry(
            C.WORLD_RADIUS,
            C.WORLD_SIDES,
            C.WORLD_TIERS,
            C.MAX_WORLD_FACE_HEIGHT,
        )

        const _meshes = {}
        C.THEME_NAMES.forEach(themeName => {
            const _neighborhoods = new WorldNeighborhoods(_surface, themeName);
            _meshes[themeName] = generateTilesets({ buildings, neighborhoods: [_neighborhoods] });
        })

        return [_surface, _meshes]
    }, [buildingsLoaded]);

    useEffect(() => {
        if (meshes && buildingsLoaded) setReady(true);
    }, [meshes])

    return (
        <>
            {meshes &&
                <>
                    <WorldSurface geometry={surface} themeName={themeName} />
                    <BuildingInstances meshes={meshes} themeName={themeName} />
                </>
            }
        </>
    )
}