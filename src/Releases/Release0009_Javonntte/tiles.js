import React, { useRef } from 'react';
import { useResource } from 'react-three-fiber';
import * as THREE from 'three';
import { TronBuildingShader } from '../../Shaders/TronBuildingShader';
import { randVal } from "./utils";

// function Building({ geometryRef, tileResources }) {
//     if (!tileResources) return null;
//     const buildings = Object.values(tileResources).map((tileResource) => {
//         return <primitive ref={geometryRef} object={tileResource} />;
//     })
//     return buildings[THREE.Math.randInt(0, 1)];
// }

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

export const CityTile = React.memo(props => {
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
}, (props) => !props.isInitialRender);