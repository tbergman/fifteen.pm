import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useRender, useResource } from 'react-three-fiber';
import { useGLTF } from "../../Utils/hooks";

export function onCarLoaded(gltf) {
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

export function Car({ curCamera, position, steeringWheelGeoms, onButtonClicked }) {
    const [carRef, car] = useResource();
    const [steeringWheelRef, steeringWheel] = useResource();
    const [buttonRef, button] = useResource();
    const buttonPos = new THREE.Vector3(10, 10, -5);//.add(position);
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
    return <group
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
        <group
            ref={buttonRef}
            position={buttonPos}
            scale={[2, 2, 2]}
        >
            <mesh
                onPointerOver={self => onButtonClicked()}
            >
                <boxGeometry attach='geometry' />
                <meshBasicMaterial
                    attach='material'
                    side={THREE.DoubleSide}
                    color={new THREE.Color("red")}
                />
            </mesh>
        </group>
    </group>;
}