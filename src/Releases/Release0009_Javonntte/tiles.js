import React, { useMemo, useRef } from 'react';
import { useResource, useRender } from 'react-three-fiber';
import * as THREE from 'three';
import { TronBuildingShader } from '../../Shaders/TronBuildingShader';
import { faceCentroid, getMiddle, triangleCentroid, triangleFromFace } from '../../Utils/geometry';
import { randVal, randomClone } from "./utils";
import {Building, buildingName} from "./buildings";

// TODO rm me
function random(seed) {
    var x = Math.sin(seed) * 10000;
    var r = x - Math.floor(x);
    return r;
}

// TODO rm me
function getRandomColor(centroid) {
    var letters = '0123456789ABCDEF';
    var color = '#';
    var seed = random(centroid.x * centroid.y * centroid.z) * 10000;
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(random(seed++) * 16)];
    }
    return color;
}

// TODO refactor
function subdivideTriangle(tri, centroid, formation) {
    const i1 = tri.a;
    const i2 = tri.b;
    const i3 = tri.c;
    const a = getMiddle(tri.a, tri.b);
    const b = getMiddle(tri.b, tri.c);
    const c = getMiddle(tri.a, tri.c);
    const triangles = [];
    switch (formation) {
        case "small":
            triangles.push(tri);
            break;
        case "medium":
            // all same size
            triangles.push(new THREE.Triangle(i1, a, centroid));
            triangles.push(new THREE.Triangle(a, i2, centroid));
            triangles.push(new THREE.Triangle(i2, b, centroid));
            triangles.push(new THREE.Triangle(b, i3, centroid));
            triangles.push(new THREE.Triangle(i3, c, centroid));
            triangles.push(new THREE.Triangle(c, i1, centroid));
            break;
        case "bigLeft1":
            // big on left, medium on top, small on bottom right
            triangles.push(new THREE.Triangle(i1, i2, c)); // big building // TODO probably can store all of this in maps
            triangles.push(new THREE.Triangle(i2, i3, centroid)); // medium building
            triangles.push(new THREE.Triangle(i3, c, centroid)); // narrow building
            break;
        case "extraSubdivisions":
            const equalTriangles = subdivideTriangle(tri, centroid, "medium");
            for (let i = 0; i < equalTriangles.length; i++) {
                const halvedTriangles = subdivideTriangle(equalTriangles[i], triangleCentroid(equalTriangles[i]), "medium");
                for (let j = 0; j < halvedTriangles.length; j++) {
                    triangles.push(halvedTriangles[j]);
                }
            }
            break;
        case "small":
    }
    return triangles;
}
function TileBuilding(props) {
    const [materialRef, material] = useResource();
    const [geometryRef, geometry] = useResource();
    return <>
        <TronBuildingShader materialRef={materialRef} {...props} />
        {/* <Building geometryRef={geometryRef} {...props} /> */}
        {/* {geometry && material && props.tileResources ? ( */}
        {material && props.tileResources ? (
            <mesh
                geometry={randVal(props.tileResources)}
                material={material}
                position={props.pos}
                rotation={new THREE.Euler(Math.PI / 2, 0, 0)}
            />
        ) : null}
    </>;
}

function TileStreet(props) {
    const [materialRef, material] = useResource();
    const [geometryRef, geometry] = useResource();
    return <>
        <boxGeometry args={[3., .01]} ref={geometryRef} />
        <TronBuildingShader materialRef={materialRef} {...props} />
        {/* <meshBasicMaterial ref={materialRef} color={"red"} /> */}
        {material && geometry && (
            <mesh
                position={props.pos}
                scale={[.1, .1, .1]}
                material={material}
                geometry={geometry}
            />
        )}
    </>
}

function TileFloor(props) {
    const [materialRef, material] = useResource();
    const [geometryRef, geometry] = useResource();
    const yOffset = props.pos.y + props.pos.z * .1;
    return (
        <>
            {/* <meshBasicMaterial ref={materialRef} color="white" /> */}
            <TronBuildingShader materialRef={materialRef} {...props} />
            <planeGeometry args={[props.size, props.size]} ref={geometryRef} />
            {material && geometry && (
                <mesh
                    geometry={geometry}
                    material={material}
                    position={props.pos}
                    // [props.pos.x, yOffset, props.pos.z]}
                    rotation={new THREE.Euler(-Math.PI / 2, 0, 0)}
                >
                </mesh>
            )}
        </>
    );
}

function TileElement(props) {
    if (props.pos.z % 5 === 0 || props.pos.x % 5 === 0) return TileStreet(props);
    else return TileBuilding(props);
}

export const CityTile = props => {
    console.log("render CityTile");
    // TODO the 'z' used here should be the current direction the camera is moving towards
    const offset = props.pos.z;
    return <group
    // rotation={new THREE.Euler(-Math.PI / 2, 0, 0)}
    // position={[props.pos.x, props.pos.y - offset, props.pos.z]}
    >
        <TileFloor {...props} />
        <TileElement {...props} />
    </group>
}


function Tile2Surface({ face, triangle, normal, centroid, ...props }) {
   const [materialRef, material] = useResource();
    const [geometryRef, geometry] = useResource();
    const vertices = new Float32Array([
        triangle.a.x, triangle.a.y, triangle.a.z,
        triangle.b.x, triangle.b.y, triangle.b.z,
        triangle.c.x, triangle.c.y, triangle.c.z,
    ])
    // vertices.push(...triangle.a)
    // vertices.push(...triangle.b)
    // vertices.push(...triangle.c)
    const geom = new THREE.Geometry();
    geom.vertices.push(triangle.a);
    geom.vertices.push(triangle.b);
    geom.vertices.push(triangle.c);
    triangle.getNormal(normal);
    geom.faces.push(new THREE.Face3(0, 1, 2, normal));


    return <>
        <boxGeometry ref={geometryRef} />
        {/* <primitive
            object={geom}
            ref={geometryRef}
        />*/}
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

function Tile2Building({ formation, triangle, centroid, normal, buildingGeometries, ...props }) {
    const [materialRef, material] = useResource();
    const [geometryRef, geometry] = useResource();
    const buildingGroupRef = useRef();
    const subdivisions = subdivideTriangle(triangle, centroid, formation);
    const color = getRandomColor(centroid); // TODO temporary color to help debug
    // const [hasRendered, setHasRendered] = useState(0)

    return <group>
        {subdivisions.map(triangleSubdivision => {
            // TODO might want to just store centroids during calculation
            const subdivisionCentroid = triangleCentroid(triangleSubdivision);
            const geometry = randomClone(buildingGeometries.narrow); // TODO
            return <group ref={buildingGroupRef} key={buildingName(geometry, subdivisionCentroid)}>
                <Building geometry={geometry} centroid={subdivisionCentroid} normal={normal} color={color} />
            </group>
        })}
    </group>;

    return <>
        <TronBuildingShader materialRef={materialRef} {...props} />
        {/* <Building geometryRef={geometryRef} {...props} /> */}
        {/* {geometry && material && props.tileResources ? ( */}
        {material && props.tileResources ? (
            <mesh
                geometry={randVal(props.tileResources)}
                material={material}
                position={props.pos}
                rotation={new THREE.Euler(Math.PI / 2, 0, 0)}
            />
        ) : null}
    </>;
}

function pickFacePattern(triangle) {
    const area = triangle.getArea();
    // TODO calculate area buckets given data
    if (area < 1.6) {
        return "small"; // TODO make these randomly picked from lists
    } else {
        return "medium"; // TODO make these randomly picked from lists
    }
}

function Tile2Elements(props) {
    // TODO put logic here that determines what to put on surface...
    // i.e. street or building etc? or just determine with 'pickfacepattern...'
    // if (props.pos.z % 5 === 0 || props.pos.x % 5 === 0) return TileStreet(props);
    // else return TileBuilding(props);
    return <Tile2Building formation={pickFacePattern(props.triangle)} {...props} />
}



export const CityTile2 = props => {
    // console.log("Rendering SphereTile", props.centroid)
    return <group>
        {/* <Tile2Surface {...props} /> */}
        <Tile2Elements {...props} />
    </group>
}