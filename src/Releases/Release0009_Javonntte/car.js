import React, { useRef } from 'react';
import {useRender} from 'react-three-fiber';
import { useGLTF } from "../../Utils/hooks";
import * as C from './constants';

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

// NOT WORKING
export function Car({ curCamera, position }) {
    const steeringWheelRef = useRef();
    const [steeringWheelLoading, steeringWheelGeoms] = useGLTF(C.STEERING_WHEEL_URL, onCarLoaded)
    useRender((state, time) => {
        console.log(steeringWheelGeoms);
        steeringWheelRef.current.rotation.y = curCamera.rotation.y * .2;
        // cadillacRef.current.rotation.x = cameraRef.current.rotation.x * .01;
        // cadillacRef.current.rotation.y = cameraRef.current.rotation.y * .01;
    })
    return <>
        {/* {steeringWheelLoading. ? */}
            <group ref={steeringWheelRef}>
                {steeringWheelGeoms.map(geometry => {
                    return <mesh
                        key={geometry.name}
                        // ref={steeringWheelRef}
                        geometry={geometry}
                        position={position}
                    />
                })}
            </group> : null
        }
    </>;
}