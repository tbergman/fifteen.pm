import * as THREE from 'three';
import { faceCentroid, subdivideTriangle, triangleCentroid as centroidFromTriangle, triangleCentroidFromVertices as centroidFromPoints, triangleFromFace, triangleFromVertices } from '../../Utils/geometry';
import { randomArrayVal, selectNRandomFromArray, randomPointsOnSphere } from '../../Utils/random';
import { generateTiles } from '../../Utils/SphereTiles';
import { loadKDTree, findNearest } from '../../Utils/KdTree';
import { groupBuildingGeometries } from './buildings';
import * as C from './constants';


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
        // const subCentroid = subTriangle.getMidpoint();
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
    // console.log('randGeoms', randGeoms);
    return subdivide36(subdividedTriangle, centroid).map((triangle, idx) => formatElement({ triangle, normal, geometry: randGeoms[idx] }));
}

function format6({ geometries, normal, centroid, triangle }) {
    const subdividedTriangle = subdivideTriangle(triangle);
    const randGeoms = selectNRandomFromArray(geometries, 6)
    return subdivide6(subdividedTriangle, centroid).map((triangle, idx) => formatElement({ triangle, normal, geometry: randGeoms[idx] }));
}

function format1({ geometries, normal, centroid }) {
    return [formatElement({ normal, centroid, geometry: randomArrayVal(geometries) })]
}

function pickSubdivisionBucket(triangle) {
    const area = triangle.getArea();
    // TODO choose subdivision size based on size of triangle?
    const ratio = area / C.WORLD_RADIUS;
    // if (ratio > .25) return 36;
    // if (ratio > .2) return [6, 36][THREE.Math.randInt(0, 1)];
    // return [1, 6, 36][THREE.Math.randInt(0, 2)]
    return 36;
}

function pickFootprint(tile) {
    // TODO don't populate if it's this close to pole
    const poleLimit = C.WORLD_RADIUS - C.WORLD_RADIUS * .99 + Math.random() * .1;
    const distToPole = C.WORLD_RADIUS - Math.abs(tile.centroid.y);
    const closeToPole = distToPole < poleLimit;
    return C.SMALL;// closeToPole ? C.SMALL : C.WIDTH_BUCKETS[THREE.Math.randInt(0, C.WIDTH_BUCKETS.length - 1)];
}

function pickHeight(tile, neighborhoodCentroid, neighborhoodRadius) {
    const relativeDistFromNeighborhoodCenter = neighborhoodCentroid.distanceTo(tile.centroid) / neighborhoodRadius;
    // return relativeDistFromNeighborhoodCenter > .8 ? C.SHORT : C.TALL;
    return C.TALL;
}

function filterGeometries(tile, neighborhoodCentroid, neighborhoodRadius, geometries) {
    const footprint = pickFootprint(tile);
    const height = pickHeight(tile, neighborhoodCentroid, neighborhoodRadius);
    // return geometries[footprint][height];
    const g = []
    g.push(...geometries["small"][height])
    // g.push(...geometries["medium"][height])
    // g.push(... geometries["large"][height])
    return g;
}

function formatTile(tile, neighborhoodCentroid, neighborhoodRadius, geometries) {
    const allowedGeometries = filterGeometries(tile, neighborhoodCentroid, neighborhoodRadius, geometries);
    const subdivisionBucket = 36;//pickSubdivisionBucket(tile.triangle);
    const formationProps = { geometries: allowedGeometries, ...tile };
    const formation = (() => {
        switch (subdivisionBucket) {
            case 1: return format1(formationProps);
            case 6: return format6(formationProps);
            case 36: return format36(formationProps);
        }
    })().filter(f => f.geometry);// && THREE.Math.randInt(0, 20) > 1); // Add chaos monkey removal of random subdivisions and only add if geom exists
    return formation;
}

export function generateFormations(surfaceGeometry, geometries, neighborhoodProps) {
    const tiles = generateTiles(surfaceGeometry);
    const kdTree = loadKDTree(tiles);
    const formations = {}
    Object.keys(tiles).forEach(tileId => formations[tileId] = []);
    const geometriesByCategory = groupBuildingGeometries(geometries);
    if (!surfaceGeometry.boundingBox) surfaceGeometry.computeBoundingBox();
    const sphereCenter = new THREE.Vector3();
    surfaceGeometry.boundingBox.getCenter(sphereCenter);
    randomPointsOnSphere(C.WORLD_RADIUS, sphereCenter, neighborhoodProps.count).forEach(neighborhoodCentroid => {
        // TODO oof need to refactor so you can do kdTree.findNearest here
        const [neighborhoodRadius, neighbors] = findNearest(neighborhoodCentroid, kdTree, neighborhoodProps.maxSize, neighborhoodProps.maxRadius, tiles);
        Object.values(neighbors).forEach(neighbor => {
            // if already assigned, 50% chance of replacement
            const id = neighbor.id;
            // colors={track.theme.starColors}
            const replace = !formations[id].length || formations[id];// && THREE.Math.randInt(0, 1) == 1;
            if (replace) {
                formations[id] = formatTile(neighbor, neighborhoodCentroid, neighborhoodRadius, geometriesByCategory);
            }
        });
    });
    return formations;
}