import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useRender, useThree } from 'react-three-fiber';

export function Camera({ fov, near, far, maxDist, center, lightProps }) {
    const spotLight = useRef();
    const cameraRef = useRef();
    const { setDefaultCamera, scene } = useThree();
    const {tooFarAway, setTooFarAway} = useState(false);

    useEffect(() => {
        if (cameraRef.current) {
            setDefaultCamera(cameraRef.current);
        }
    }, [cameraRef])

        // useRender((state, time) => {
        //     if ((time % .5).toFixed(1) == 0) {
        //         const distToCenter = cameraRef.current.position.distanceTo(center);
        //         setTooFarAway(distToCenter > maxDist);
        //     }
        // })

        // TODO -- add https://discourse.threejs.org/t/three-js-move-camera/6852/3 logic instead of this
        // that is, add an invisible sphere and check for intersection
        useRender(() => {
            if (cameraRef.current.position.x > maxDist) {
                cameraRef.current.position.x = maxDist;
            }
            if (cameraRef.current.position.x < -maxDist) {
                cameraRef.current.position.x = -maxDist;
            }
            if (cameraRef.current.position.y > maxDist) {
                cameraRef.current.position.y = maxDist;
            }
            if (cameraRef.current.position.y < -maxDist) {
                cameraRef.current.position.y = -maxDist;
            }
 
            if (cameraRef.current.position.z > maxDist) {
                cameraRef.current.position.z = maxDist;
            }
            if (cameraRef.current.position.z < -maxDist) {
                cameraRef.current.position.z = -maxDist;
            }
        })
    return <perspectiveCamera
        // onUpdate={self => {
        // var helper = new THREE.CameraHelper(self);
        // scene.add(helper);
        // }}
        ref={cameraRef}
        fov={fov}
        near={near}
        far={far}
    >
        <pointLight
            onUpdate={self => self.lookAt(new THREE.Vector3(0, 0, 1))}
            ref={spotLight}
            castShadow
            position={new THREE.Vector3(0, 0, 0)}
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