import React, { useRef } from 'react';
import { useResource } from 'react-three-fiber';
import * as THREE from 'three';
import { useBuildings, loadBuildings, useModel } from "./models";
import { BUILDINGS_URL } from "./constants";



// class TileElement2 extends Component {
//     state = {
//       building
//     }

// }  



function TileElement(props) {

    console.log("IN TILE ELEMENT: ", props.building);
    if (props.pos.z % 5 === 0 || props.pos.x % 5 === 0) {
        return TileStreet(props);
    } else {
        return <>
            {props.building ? (
                <mesh
                    geometry={props.building["disco1"]} {...props}
                    position={props.pos}
                    rotation={new THREE.Euler(Math.PI / 2, 0, 0)}
                >
                    <meshPhysicalMaterial
                        attach="material"
                        roughness={0.8}
                        metalness={0.6}
                        emissive="#a4f20d"
                        // emissiveIntensity={active ? 0.1 : 0}
                        color="#001000"
                        fog={true}
                        shininess={0.5}
                    />
                </mesh>
            ) : null}
        </>;
    }
}

function TileStreet(props) {
    const [materialRef, material] = useResource();
    const [geometryRef, geometry] = useResource();
    return <>
        <boxGeometry ref={geometryRef} />
        <meshBasicMaterial ref={materialRef} color={"red"} />
        {material && geometry && (
            <mesh
                position={[props.pos.x, props.pos.y, props.pos.z]}
                scale={[.1, .1, .1]}
                material={material}
                geometry={geometry}
            />
        )}
    </>
}

function TileFloor(props) {
    const [materialRef, material] = useResource()
    const [geometryRef, geometry] = useResource()
    return (
        <>
            <meshBasicMaterial ref={materialRef} color="white" />
            <planeGeometry args={[props.size, props.size]} ref={geometryRef} />
            {material && geometry && (
                <mesh
                    material={material}
                    geometry={geometry}
                    position={props.pos}
                    rotation={new THREE.Euler(-Math.PI / 2, 0, 0)}
                />
            )}
        </>
    );
}

export const CityTile = function (props) {
    console.log("render CityTile", props.building);
    return <>
        <TileFloor {...props} />
        <TileElement {...props} />
    </>;
}