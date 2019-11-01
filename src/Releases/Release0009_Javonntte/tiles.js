import * as THREE from 'three';
import { subdivideTriangle, triangleCentroid as centroidFromTriangle, triangleCentroidFromVertices as centroidFromPoints, triangleFromVertices } from '../../Utils/geometry';
import { findNearest, loadKDTree } from '../../Utils/KdTree';
import { randomArrayVal, selectNRandomFromArray } from '../../Utils/random';
import * as C from './constants';
import { createInstance } from './instances';

function subdivide6(triangleComponents, centroid) {
    return [
        triangleFromVertices(triangleComponents.i1, triangleComponents.a, centroid),
        triangleFromVertices(triangleComponents.a, triangleComponents.i2, centroid),
        triangleFromVertices(triangleComponents.i2, triangleComponents.b, centroid),
        triangleFromVertices(triangleComponents.b, triangleComponents.i3, centroid),
        triangleFromVertices(triangleComponents.i3, triangleComponents.c, centroid),
        triangleFromVertices(triangleComponents.c, triangleComponents.i1, centroid),
    ]
}

function subdivide36(triangleComponents, centroid) {
    const thirtySix = [];
    subdivide6(triangleComponents, centroid).forEach(subTriangle => {
        const subTriangleComponents = subdivideTriangle(subTriangle);
        const subCentroid = centroidFromTriangle(subTriangle);
        return thirtySix.push(...subdivide6(subTriangleComponents, subCentroid))
    });
    return thirtySix;
}

function formatElement({ triangle, normal, centroid, building }) {
    if (triangle) centroid = centroidFromPoints(triangle.a, triangle.b, triangle.c);
    return {
        ...building,
        centroid: centroid,
        normal: normal,
        
    }
}

function format36({ buildings, normal, centroid, triangle }) {
    const subdividedTriangle = subdivideTriangle(triangle);
    const randBuildings = selectNRandomFromArray(buildings, 36)
    return subdivide36(subdividedTriangle, centroid).map((triangle, idx) => formatElement({ triangle, normal, building: randBuildings[idx] }));
}

function format6({ buildings, normal, centroid, triangle }) {
    const subdividedTriangle = subdivideTriangle(triangle);
    const randBuildings = selectNRandomFromArray(buildings, 6)
    return subdivide6(subdividedTriangle, centroid).map((triangle, idx) => formatElement({ triangle, normal, building: randBuildings[idx] }));
}

function format1({ buildings, normal, centroid }) {
    return [formatElement({ normal, centroid, building: randomArrayVal(buildings) })]
}

function pickBuildings(tile, buildings) {
    const area = tile.triangle.getArea();
    if (area > 16) {
        return [
            {
                allowedBuildings: buildings.filter(building => building.footprint == C.LARGE),
                subdivisions: 1
            },
            {
                allowedBuildings: buildings.filter(building => building.footprint == C.MEDIUM),
                subdivisions: 6
            }
        ][THREE.Math.randInt(0, 1)]
    } else if (area > 14) {
        return {
            allowedBuildings: buildings.filter(building => building.footprint == C.MEDIUM),
            subdivisions: 6
        }
    } else {
        return {
            allowedBuildings: buildings.filter(building => building.footprint == C.SMALL),
            subdivisions: 6
        }
    }
}

function formatTile(tile, neighborhoodCentroid, neighborhoodRadius, buildings) {
    const { allowedBuildings, subdivisions } = pickBuildings(tile, buildings)
    const formationProps = { buildings: allowedBuildings, ...tile };
    const formation = (() => {
        switch (subdivisions) {
            case 1: return format1(formationProps);
            case 6: return format6(formationProps);
            case 36: return format36(formationProps);
        }
    })();
    return formation;
}

// expensive 1-time operation for tileset
function generateTileFormations(surface, buildings, neighborhoods) {
    const tiles = neighborhoods.generateTiles({ surface });
    const kdTree = loadKDTree(tiles);
    const formations = {};
    Object.keys(tiles).forEach(id => formations[id] = []);
    neighborhoods.getCentroids({ surface, tiles }).forEach(centroid => {
        const [neighborhoodRadius, neighbors] = findNearest(centroid, kdTree, neighborhoods.maxSize, neighborhoods.maxRadius, tiles);
        Object.values(neighbors).forEach(neighbor => {
            const id = neighbor.id;
            const replace = !formations[id].length || formations[id] && THREE.Math.randInt(0, 1) == 1;
            if (replace && neighborhoods.rules(neighbor)) {
                formations[id] = formatTile(neighbor, centroid, neighborhoodRadius, buildings);
            }
        });
    });
    return formations;
}

export function generateTileset({ surface, buildings, neighborhoods }) {
    const instances = {};
    const instancedMeshes = {};
    // generate formations for all tiles
    const formations = generateTileFormations(surface, buildings, neighborhoods);
    // add each geometry instance from each tile formation to the elements by name look up
    Object.keys(formations).forEach(tId => {
        formations[tId].forEach(buildingInstance => {
            if (!instances[buildingInstance.name]) instances[buildingInstance.name] = [];
            instances[buildingInstance.name].push(buildingInstance);
        });
    });
    // create an instance geometry for each geometry type that includes all locations on each formation for that geometry
    Object.keys(instances).forEach((name) => {
        if (instances[name].length) {
            instancedMeshes[name] = createInstance(instances[name]);
        }
    })
    return instancedMeshes;
}
