import React from 'react';
import { useResource } from 'react-three-fiber';
import * as THREE from 'three';
import { Buildings, getRandomBuilding } from './buildings';
import { getMiddle, triangleCentroidFromVertices as getCentroid } from '../../Utils/geometry';
import { SMALL, MEDIUM, LARGE } from './constants';

export const SkyCityTile = props => {
    return <group>
        <Buildings
            material={props.tileElements.buildings.material}
            subdivisions={props.tileElements.lookup[props.tileId]}
            normal={props.normal}
        />
    </group>
}


function formation1({ centroid, triangleComponents, geometries }) {
    return [
        {
            geometry: getRandomBuilding(geometries[SMALL]),
            centroid: getCentroid(triangleComponents.i1, triangleComponents.a, centroid)
        },
        {
            geometry: getRandomBuilding(geometries[SMALL]),
            centroid: getCentroid(triangleComponents.a, triangleComponents.i2, centroid)
        },
        {
            geometry: getRandomBuilding(geometries[SMALL]),
            centroid: getCentroid(triangleComponents.i2, triangleComponents.b, centroid)
        },
        {
            geometry: getRandomBuilding(geometries[SMALL]),
            centroid: getCentroid(triangleComponents.b, triangleComponents.i3, centroid)
        },
        {
            geometry: getRandomBuilding(geometries[SMALL]),
            centroid: getCentroid(triangleComponents.i3, triangleComponents.c, centroid)
        },
        {
            geometry: getRandomBuilding(geometries[SMALL]),
            centroid: getCentroid(triangleComponents.c, triangleComponents.i1, centroid)
        },
    ]
}

export function subdivideTriangle({ formation, triangle, centroid, geometries }) {
    const triangleComponents = {
        i1: triangle.a,
        i2: triangle.b,
        i3: triangle.c,
        a: getMiddle(triangle.a, triangle.b),
        b: getMiddle(triangle.b, triangle.c),
        c: getMiddle(triangle.a, triangle.c),
    }
    switch (formation) {
        case 1: return formation1({ centroid, triangleComponents, geometries })
    }
}

export function pickTileFormation({ triangle, centroid, geometries }) {
    const formation = 1;
    return subdivideTriangle({ formation, triangle, centroid, geometries })
}

// function pickTilePattern(triangle) {

    //     const area = triangle.getArea();
    //     // TODO calculate area buckets given data
    //     if (area < 1.6) {
    //         return "large"; // TODO make these randomly picked from lists
    //     } else if (area >= 1.6 && area < 3) {
    //         return "large"; // TODO make these randomly picked from lists
    //     } else if (area >= 3) {
    //         return "large"
    //     }
    // }
    // function TileSurface({ face, triangle, normal, centroid, ...props }) {
    //     const [materialRef, material] = useResource();
    //     const [geometryRef, geometry] = useResource();
    //     const vertices = new Float32Array([
    //         triangle.a.x, triangle.a.y, triangle.a.z,
    //         triangle.b.x, triangle.b.y, triangle.b.z,
    //         triangle.c.x, triangle.c.y, triangle.c.z,
    //     ])
    //     const geom = new THREE.Geometry();
    //     geom.vertices.push(triangle.a);
    //     geom.vertices.push(triangle.b);
    //     geom.vertices.push(triangle.c);
    //     triangle.getNormal(normal);
    //     geom.faces.push(new THREE.Face3(0, 1, 2, normal));
    //     return <>
    //         <boxGeometry ref={geometryRef} />
    //         <meshBasicMaterial ref={materialRef} color="red" />
    //         {geometry && material ?
    //             <mesh
    //                 geometry={geometry}
    //                 material={material}
    //                 position={centroid}
    //             /> : null
    //         }
    //     </>
    // }
