import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useRender, useResource } from 'react-three-fiber';
import { useGLTF } from "../../Utils/hooks";
import * as C from './constants';
import { Metal03Material } from '../../Utils/materials';

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

function Dash(){
    return (
        
    )
}

export function Car({ curCamera, position, steeringWheelGeoms, dashGeoms, onLightsButtonClicked }) {
    const [carRef, car] = useResource();
    const [steeringWheelRef, steeringWheel] = useResource();
    const [dashRef, dash] = useResource();
    const [buttonRef, button] = useResource();
    const [metal03MaterialRef, metal03Material] = useResource();
    const dashPos = new THREE.Vector3(8, 12.5, -1);//.add(position);
    // useMemo(() => {
    //     const buttonP = new THREE.Vector3(0, 0, 5);
    //     return buttonP.add(position);
    // });

    useRender((state, time) => {
        if (!steeringWheel) return;
        console.log('button', button)
        steeringWheel.rotation.y = curCamera.rotation.y * .2;
        // cadillacRef.current.rotation.x = cameraRef.current.rotation.x * .01;
        // cadillacRef.current.rotation.y = cameraRef.current.rotation.y * .01;
    })
    return <
        group
        ref={carRef}
        position={position}
    >


        <group ref={steeringWheelRef}>
            {steeringWheelGeoms.map(geometry => {
                return <mesh
                    key={geometry.name}
                    ref={steeringWheelRef}
                    geometry={geometry}
                />
            })}
        </group>
        <Metal03Material
            materialRef={metal03MaterialRef}
            textureRepeat={{x: 1, y: 1}}
            roughness={0}
            />
        {metal03Material &&
            <group
                ref={dashRef}
                position={dashPos}
            >
                {dashGeoms.map(geom => {
                    return geom.name == C.LIGHTS_BUTTON ?
                        <mesh
                            onPointerOver={self => onLightsButtonClicked()}
                            key={geom.name}>
                            <primitive attach="geometry" object={geom} />
                        </mesh> :
                        <mesh
                            key={geom.name}
                            geometry={geom}
                            material={metal03Material}
                        />
                })}
            </group>
        }
    </group >;
}