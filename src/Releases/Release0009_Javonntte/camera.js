import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useRender, useThree, useResource } from 'react-three-fiber';
import { Cadillac } from './car';

export function Camera({ fov, near, far, maxDist, center, lightProps, steeringWheelGeoms, cadillacHoodGeoms }) {

    const spotLight = useRef();
    const cameraRef = useRef();
    const steeringWheelRef = useRef();
    const cadillacRef = useRef();
    const { setDefaultCamera } = useThree();
   

    useEffect(() => {
        if (cameraRef.current) {
            setDefaultCamera(cameraRef.current);
        }
    }, [cameraRef]);

    useRender((state, time) => { 
        steeringWheelRef.current.rotation.y = cameraRef.current.rotation.y * .2;
        cadillacRef.current.rotation.x = cameraRef.current.rotation.x * .01;
        cadillacRef.current.rotation.y = cameraRef.current.rotation.y * .01;
    })

    return <>
        {/* <Metal03Material materialRef={metal03MaterialRef} /> */}
        <perspectiveCamera
            ref={cameraRef}
            fov={fov}
            near={near}
            far={far}
        >
            {cameraRef.current && steeringWheelGeoms.length && cadillacHoodGeoms.length &&
                <group ref={cadillacRef}>
                    <group ref={steeringWheelRef}>
                        {steeringWheelGeoms.map(geometry => {
                            return <mesh
                                key={geometry.name}
                                ref={steeringWheelRef}
                                geometry={geometry}
                                position={[0, -14.5, -3]}
                            />
                        })}
                    </group>
                    {/* {cadillacHoodGeoms.map(geometry => {
                        // TODO
                        const opacity = geometry.name == "windows" ? 0 : 1;
                        return <mesh
                            key={geometry.name}
                            geometry={geometry}
                            scale={[4.1,4.1,4.1]}
                            position={[1.25, -10, 5]}
                            material-opacity={opacity}
                            // position={[1.5, -3, 3.5]}
                        />
                    })}*/}
                </group>
            }
            {/* // TODO: car headlights! */}
            <spotLight
                ref={spotLight}
                castShadow
                intensity={lightProps.intensity}
                // penumbra={lightProps.penumbra}
                distance={lightProps.distance}
                shadow-camera-near={lightProps.shadowCameraNear}
                shadow-camera-far={lightProps.shadowCameraFar}
                shadow-mapSize-width={lightProps.shadowMapSizeWidth}
                shadow-mapSize-height={lightProps.shadowMapSizeHeight}
            />
        </perspectiveCamera>
    </>
}

