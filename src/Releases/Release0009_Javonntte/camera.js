import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useRender, useThree, useResource } from 'react-three-fiber';
import { Car } from './car';

export function Camera({ cameraRef, fov, near, far, carProps, lightProps }) {

    const spotLight = useRef();

    const steeringWheelRef = useRef();
    const cadillacRef = useRef();
    const { setDefaultCamera } = useThree();

    useEffect(() => {
        if (cameraRef.current) {
            setDefaultCamera(cameraRef.current);
        }
    }, [cameraRef.current]);

    // useRender((state, time) => {
    //     steeringWheelRef.current.rotation.y = cameraRef.current.rotation.y * .2;
    //     // cadillacRef.current.rotation.x = cameraRef.current.rotation.x * .01;
    //     // cadillacRef.current.rotation.y = cameraRef.current.rotation.y * .01;
    // })

    return <perspectiveCamera
        ref={cameraRef}
        fov={fov}
        near={near}
        far={far}
    >
        {
            cameraRef.current &&
           //  carProps.steeringWheelGeoms.length && cadillacHoodGeoms.length &&
            <Car
                curCamera={cameraRef.current}
                position={new THREE.Vector3(0, -14.5, -3)}
                {...carProps}
                // steeringWheelGeoms={steeringWheelGeoms} // TODO don't pass this in, init in in the component!
                // onButtonClicked={onButtonClicked}
            />
         
        }
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

}

