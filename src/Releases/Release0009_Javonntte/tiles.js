import React from 'react';
import { useResource } from 'react-three-fiber';
import * as THREE from 'three';

function TileBuilding(props) {
    return <>
        {props.tileResources ? (
            <mesh
                geometry={props.tileResources["disco1"]} {...props}
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

function TileElement(props) {
    if (props.pos.z % 5 === 0 || props.pos.x % 5 === 0) return TileStreet(props);
    else return TileBuilding(props);
}

export const CityTile = function (props) {
    return <>
        <TileFloor {...props} />
        <TileElement {...props} />
    </>;
}