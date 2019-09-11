import React from 'react';
import { useResource } from 'react-three-fiber';
import * as THREE from 'three';
import { Buildings } from "./buildings";


function pickTilePattern(triangle) {

    const area = triangle.getArea();
    // TODO calculate area buckets given data
    if (area < 1.6) {
        return "large"; // TODO make these randomly picked from lists
    } else if (area >= 1.6 && area < 3) {
        return "large"; // TODO make these randomly picked from lists
    } else if (area >= 3) {
        return "large"
    }
}
function TileSurface({ face, triangle, normal, centroid, ...props }) {
    const [materialRef, material] = useResource();
    const [geometryRef, geometry] = useResource();
    const vertices = new Float32Array([
        triangle.a.x, triangle.a.y, triangle.a.z,
        triangle.b.x, triangle.b.y, triangle.b.z,
        triangle.c.x, triangle.c.y, triangle.c.z,
    ])
    const geom = new THREE.Geometry();
    geom.vertices.push(triangle.a);
    geom.vertices.push(triangle.b);
    geom.vertices.push(triangle.c);
    triangle.getNormal(normal);
    geom.faces.push(new THREE.Face3(0, 1, 2, normal));
    return <>
        <boxGeometry ref={geometryRef} />
        <meshBasicMaterial ref={materialRef} color="red" />
        {geometry && material ?
            <mesh
                geometry={geometry}
                material={material}
                position={centroid}
            /> : null
        }
    </>
}



export const CityTile = props => {
    return <group>
        <Buildings
            formation={pickTilePattern(props.triangle)}
            geometries={props.tileElements.buildings.geometries}
            material={props.tileElements.buildings.material}
            {...props}
        />
    </group>
}