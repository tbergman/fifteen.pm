import * as THREE from 'three';
import { subdivideTriangle, triangleCentroid as centroidFromTriangle, triangleCentroidFromVertices as centroidFromPoints, triangleFromVertices } from '../../../Utils/geometry';
import { findNearest, loadKDTree } from '../../../Utils/KdTree';
import { randomArrayVal, selectNRandomFromArray } from '../../../Utils/random';
import { createInstance } from './instances';
import { generateTiles } from '../../../Utils/SphereTiles';

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

function subdivide3(triangleComponents, centroid) {
    return [
        triangleFromVertices(triangleComponents.i1, triangleComponents.a, centroid),
        // triangleFromVertices(triangleComponents.a, triangleComponents.i2, centroid),
        triangleFromVertices(triangleComponents.i2, triangleComponents.b, centroid),
        // triangleFromVertices(triangleComponents.b, triangleComponents.i3, centroid),
        triangleFromVertices(triangleComponents.i3, triangleComponents.c, centroid),
        // triangleFromVertices(triangleComponents.c, triangleComponents.i1, centroid),
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

function formatN({ buildings, normal, centroid, triangle, n }) {
    if (n === 1) return [formatElement({ normal, centroid, building: randomArrayVal(buildings) })]
    const subdividedTriangle = subdivideTriangle(triangle);
    const randBuildings = selectNRandomFromArray(buildings, n)
    const subdivideN = {
        3: subdivide3,
        6: subdivide6,
        36: subdivide36,
    }[n];
    return subdivideN(subdividedTriangle, centroid).map((triangle, idx) => formatElement({ triangle, normal, building: randBuildings[idx] }));
}

// expensive 1-time operation for tileset
function generateTileFormations(buildings, neighborhood) {
    const tiles = generateTiles({ surface: neighborhood.surface });
    const kdTree = loadKDTree(tiles);
    const formations = {};
    Object.keys(tiles).forEach(id => formations[id] = []);
    neighborhood.getNeighborhoodCentroids({ surface: neighborhood.surface, tiles }).forEach(centroid => {
        const [neighborhoodRadius, neighbors] = findNearest(centroid, kdTree, neighborhood.numTiles, neighborhood.maxRadius, tiles);
        Object.values(neighbors).forEach(neighbor => {
            const id = neighbor.id;
            const replace = !formations[id].length || formations[id] && THREE.Math.randInt(0, 1) == 1;
            if (replace && neighborhood.rules(neighbor)) {
                const { allowedBuildings, subdivisions } = neighborhood.pickBuildings(neighbor, buildings);
                formations[id] = formatN({ n: subdivisions, buildings: allowedBuildings, ...neighbor });
            }
        });
    });
    return formations;
}

function generateInstanceAttributes(formations) {
    const instances = {};
    // add each geometry instance from each tile formation to the elements by name look up
    Object.keys(formations).forEach(tId => {
        formations[tId].forEach(buildingInstance => {
            if (!instances[buildingInstance.name]) instances[buildingInstance.name] = [];
            instances[buildingInstance.name].push(buildingInstance);
        });
    });
    return instances;
}

export function generateTilesets({ buildings, neighborhoods }) {
    const instancedMeshes = {};
    const instancesByGroup = neighborhoods.map(neighborhood => {
        // generate formations for all tiles
        const formations = generateTileFormations(buildings, neighborhood);
        return generateInstanceAttributes(formations);
    })
    const joinedInstancesByName = {};
    instancesByGroup.forEach(instancesByName => {
        Object.keys(instancesByName).forEach((name) => {
            if (!joinedInstancesByName[name]) joinedInstancesByName[name] = [];
            joinedInstancesByName[name].push(...instancesByName[name])
        })
    })
    Object.keys(joinedInstancesByName).forEach((name) => {
        if (joinedInstancesByName[name].length) instancedMeshes[name] = createInstance(joinedInstancesByName[name]);
    })
    return instancedMeshes;
}