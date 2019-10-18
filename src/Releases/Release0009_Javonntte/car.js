import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useRender, useResource } from 'react-three-fiber';
import { useGLTF } from "../../Utils/hooks";
import * as C from './constants';
import { EmissiveMaterial, Metal03Material, TronMaterial } from '../../Utils/materials';

export function onCarElementLoaded(gltf) {
    // return gltf.scene
    const geometries = []
    gltf.scene.traverse(child => {
        if (child.isMesh) {
            const geometry = child.geometry.clone();
            geometry.name = child.name;
            geometries.push(geometry);
        }
    })
    return geometries;
}


function Button({ geom, clicked }) {


}


function Dash({ dashGeoms, onLightsButtonClicked }) {
    const [dashRef, dash] = useResource();
    const [buttonRef, button] = useResource();
    const [metal03MaterialRef, metal03Material] = useResource();
    const [emissiveMaterialRef, emissiveMaterial] = useResource();
    const [tronMaterialRef, tronMaterial] = useResource();
    const dashPos = new THREE.Vector3(8, 12.5, -1);//.add(position);


    // TODO https://github.com/react-spring/react-three-fiber/blob/799d21878a472f7f2bfb2c7051c5f84a56bc491f/examples/components/GltfAnimation.js
    return <>
        <Metal03Material
            materialRef={metal03MaterialRef}
            textureRepeat={{ x: 1, y: 1 }}
            roughness={0}
        />
        <EmissiveMaterial
            materialRef={emissiveMaterialRef}
        />
        <TronMaterial
            materialRef={tronMaterialRef}
            bpm={120} // TODO
        />
        {metal03Material && emissiveMaterial && tronMaterial &&
            <group
                ref={dashRef}
                position={dashPos}
            >
                {dashGeoms.map(geom => {
                    if (C.DASH_BUTTONS.includes(geom.name)) {
                        return <mesh
                            onPointerOver={self => onLightsButtonClicked()}
                            key={geom.name}>
                            <primitive attach="geometry" object={geom} />
                        </mesh>
                    }
                    else if (geom.name == C.LIGHTS_BUTTON_TEXT) {
                        return <mesh
                            key={geom.name}
                            geometry={geom}
                            material={emissiveMaterial}
                        />
                    }
                    else if (geom.name == C.SPEEDOMETER) {
                        return <mesh
                            key={geom.name}
                            geometry={geom}
                            material={tronMaterial}
                        />
                    }
                    else {
                        return <mesh
                            key={geom.name}
                            geometry={geom}
                            material={metal03Material}
                        />
                    }
                })}
            </group>
        }
    </>
}

function SteeringWheel({ curCamera, steeringWheelGeoms }) {
    const [steeringWheelRef, steeringWheel] = useResource();
    useRender((state, time) => {
        if (!steeringWheel) return;
        console.log('button', button)
        steeringWheel.rotation.y = curCamera.rotation.y * .2;
        // cadillacRef.current.rotation.x = cameraRef.current.rotation.x * .01;
        // cadillacRef.current.rotation.y = cameraRef.current.rotation.y * .01;
    })
    return <group ref={steeringWheelRef}>
        {steeringWheelGeoms.map(geometry => {
            return <mesh
                key={geometry.name}
                ref={steeringWheelRef}
                geometry={geometry}
            />
        })}
    </group>
}

function Headlamps({ intensity, distance, shadowCameraNear, shadowCameraFar, shadowMapSizeWidth, shadowMapSizeHeight }) {
    const spotLight = useRef();
    return <spotLight
        ref={spotLight}
        castShadow
        intensity={intensity}
        // penumbra={lightProps.penumbra}
        distance={distance}
        shadow-camera-near={shadowCameraNear}
        shadow-camera-far={shadowCameraFar}
        shadow-mapSize-width={shadowMapSizeWidth}
        shadow-mapSize-height={shadowMapSizeHeight}
    />
}

export function Car({
    curCamera,
    position,
    steeringWheelGeoms,
    dashGeoms,
    onLightsButtonClicked,
    lightProps
}) {
    const [carRef, car] = useResource();
    return <
        group
        ref={carRef}
        position={position}
    >
        <SteeringWheel
            curCamera={curCamera}
            steeringWheelGeoms={steeringWheelGeoms}
        />
        <Dash
            dashGeoms={dashGeoms}
            onLightsButtonClicked={onLightsButtonClicked}
        />
        <Headlamps {...lightProps} />
    </group >;
}