import * as THREE from 'three';
import { subdivideTriangle, triangleCentroid as centroidFromTriangle, triangleCentroidFromVertices as centroidFromPoints, triangleFromVertices } from '../../Utils/geometry';
import { findNearest, loadKDTree } from '../../Utils/KdTree';
import { randomArrayVal, selectNRandomFromArray } from '../../Utils/random';
import { groupBuildingGeometries } from './Buildings';
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

function formatElement({ triangle, normal, centroid, geometry }) {
    if (triangle) centroid = centroidFromPoints(triangle.a, triangle.b, triangle.c);
    return {
        geometry: geometry,
        centroid: centroid,
        normal: normal,
    }
}

function format36({ geometries, normal, centroid, triangle }) {
    const subdividedTriangle = subdivideTriangle(triangle);
    const randGeoms = selectNRandomFromArray(geometries, 36)
    return subdivide36(subdividedTriangle, centroid).map((triangle, idx) => formatElement({ triangle, normal, geometry: randGeoms[idx] }));
}

function format6({ geometries, normal, centroid, triangle }) {
    const subdividedTriangle = subdivideTriangle(triangle);
    const randGeoms = selectNRandomFromArray(geometries, 6)
    return subdivide6(subdividedTriangle, centroid).map((triangle, idx) => formatElement({ triangle, normal, geometry: randGeoms[idx] }));
    // return subdivide6(subdividedTriangle, centroid).map((triangle, idx) => formatElement({ triangle, normal, geometry: geometries[1] }));
}

function format1({ geometries, normal, centroid }) {
    // return [formatElement({ normal, centroid, geometry: geometries[1] })]
    return [formatElement({ normal, centroid, geometry: randomArrayVal(geometries) })]
}

function pickGeometries(tile, geometries) {
    const area = tile.triangle.getArea();
    if (area > 16) {
        return [
            {
                allowedGeometries: geometries[C.BUILDING_WIDTH_BUCKETS[2]],
                subdivisions: 1
            },
            {
                allowedGeometries: geometries[C.BUILDING_WIDTH_BUCKETS[1]],
                subdivisions: 6
            }
        ][THREE.Math.randInt(0, 1)]
    } else if (area > 14) {
        return {
            allowedGeometries: geometries[C.BUILDING_WIDTH_BUCKETS[1]],
            subdivisions: 6
        }
    } else {
        return {
            allowedGeometries: geometries[C.BUILDING_WIDTH_BUCKETS[0]],
            subdivisions: 6
        }
    }
}

function formatTile(tile, neighborhoodCentroid, neighborhoodRadius, geometries) {
    const { allowedGeometries, subdivisions } = pickGeometries(tile, geometries)
    const formationProps = { geometries: allowedGeometries, ...tile };
    const formation = (() => {
        switch (subdivisions) {
            case 1: return format1(formationProps);
            case 6: return format6(formationProps);
            case 36: return format36(formationProps);
        }
    })().filter(f => f.geometry && THREE.Math.randInt(0, 20) > 1); // Add if geom exists and also include a chaos monkey removal of random subdivisions
    return formation;
}

// expensive 1-time operation for tileset
function generateTileFormations(surface, geometries, neighborhoods) {
    const tiles = neighborhoods.generateTiles({ surface });
    const kdTree = loadKDTree(tiles);
    const formations = {}
    Object.keys(tiles).forEach(id => formations[id] = []);
    const geometriesByCategory = groupBuildingGeometries(geometries);
    neighborhoods.getCentroids({ surface, tiles }).forEach(centroid => {
        const [neighborhoodRadius, neighbors] = findNearest(centroid, kdTree, neighborhoods.maxSize, neighborhoods.maxRadius, tiles);
        Object.values(neighbors).forEach(neighbor => {
            // if already assigned, 50% chance of replacement
            const id = neighbor.id;
            const replace = !formations[id].length || formations[id] && THREE.Math.randInt(0, 1) == 1;
            if (replace && neighborhoods.rules(neighbor)) {
                formations[id] = formatTile(neighbor, centroid, neighborhoodRadius, geometriesByCategory);
            }
        });
    });
    return formations;
}

// TODO maybe the material ref should be assigned to the incoming geometries array of objects
export function generateTileset({ surface, buildings, neighborhoods }) {
    const elementsByName = {};
    const instancesByName = {};
    // build up a lookup of each geometry by name
    buildings.geometries.forEach((geometry) => elementsByName[geometry.name] = []);
    // get centers for each formation
    // generate formations for all tiles
    const formations = generateTileFormations(surface, buildings.geometries, neighborhoods);
    // add each geometry instance from each tile formation to the elements by name look up
    Object.keys(formations).forEach(tId => {
        formations[tId].forEach(element => {
            elementsByName[element.geometry.name].push(element);
        });
    });
    // create an instance geometry for each geometry type that includes all locations on each formation for that geometry
    Object.keys(elementsByName).forEach((name) => {
        if (elementsByName[name].length) {
            instancesByName[name] = createInstance(elementsByName[name], buildings.materials[THREE.Math.randInt(0, buildings.materials.length - 1)]);
        }
    });
    return instancesByName;
}
