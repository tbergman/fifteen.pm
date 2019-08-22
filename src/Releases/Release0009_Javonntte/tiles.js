import React from 'react';
import { useResource } from 'react-three-fiber';
import * as THREE from 'three';
import { useBuildings, loadBuildings } from "./models";


function TileElement(props) {
    const buildings = useBuildings();
    console.log("IN TILE ELEMENT: ", buildings)
    if (props.pos.z % 5 === 0 || props.pos.x % 5 === 0) {
        return TileStreet(props);
    } else {
        return <>
            {buildings ? (
                <mesh
                    geometry={buildings["disco1"]} {...props}
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
    return <mesh position={[props.pos.x, props.pos.y, props.pos.z]} scale={[.1, .1, .1]}>
        <boxGeometry attach="geometry" />
        <meshBasicMaterial
            attach="material"
            color="red"
        />
    </mesh>;
}

function TileFloor(props) {
    const [tileMaterialRef, tileMaterial] = useResource()
    const [tileGeometryRef, tileGeometry] = useResource()
    return (
        <>
            <meshBasicMaterial ref={tileMaterialRef} color="white" />
            <planeGeometry args={[props.size, props.size]} ref={tileGeometryRef} />
            {tileMaterial && tileGeometry && (
                <mesh
                    material={tileMaterial}
                    geometry={tileGeometry}
                    position={props.pos}
                    rotation={new THREE.Euler(-Math.PI / 2, 0, 0)}
                />
            )}
        </>
    );
}

export const CityTile = function (props) {
    return <>
        <TileFloor {...props} />
        <TileElement {...props} />
    </>;
}