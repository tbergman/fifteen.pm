import React from 'react';
import { useResource } from 'react-three-fiber';
import * as THREE from 'three';
import { TronBuildingShader } from '../../Shaders/TronBuildingShader';


function TileBuilding(props) {
    return <>
        {props.tileResources ? (
            <mesh
                geometry={props.tileResources["lightWire1"]}
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
                    rotation={new THREE.Euler(-Math.PI / 2, 0, 0)}
                >
                </mesh>
            )}
        </>
    );
    // const [materialRef, material] = useResource()
    // const [geometryRef, geometry] = useResource()
    // return (

    //     <mesh
    //         // material={material}
    //         // geometry={geometry}
    //         position={props.pos}
    //         rotation={new THREE.Euler(-Math.PI / 2, 0, 0)}
    //     >
    //         <planeGeometry attach="geometry" args={[props.size - .1, props.size - .1]} />
    //         <TronBuildingShader {...props} />
    //     </mesh>


    // );
    // // return TronBuildingShader(props);
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