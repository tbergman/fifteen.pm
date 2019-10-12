import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useRender, useThree, useResource } from 'react-three-fiber';
import { Cadillac } from './car';
import { Metal03Material } from '../../Utils/materials'

export function Camera({ fov, near, far, tubeGeometry, maxDist, center, lightProps, steeringWheelGeoms, cadillacHoodGeoms }) {

    const spotLight = useRef();
    const cameraRef = useRef();
    const parentRef = useRef();
    const steeringWheelRef = useRef();
    const cadillacRef = useRef();
    const { setDefaultCamera, scene } = useThree();
    const frenetFrames = useRef();
    const [metal03MaterialRef, metal03Material] = useResource();
    const normal = new THREE.Vector3(0, 0, 0);
    const binormal = new THREE.Vector3(0, 1, 0);
    const loopTime = 50000;
    const scale = .8;
    const offset = 6;

    useEffect(() => {
        if (cameraRef.current) {
            setDefaultCamera(cameraRef.current);
        }
    }, [cameraRef]);

    // useEffect(() => {
    //     const closed = true;
    //     if (tubeGeometry) {
    //         const curve = tubeGeometry.parameters.options.extrudePath;
    //         frenetFrames.current = curve.computeFrenetFrames(loopTime, closed);
    //     }
    // });

    const cadillacPos = new THREE.Vector3()
    useRender((state, time) => {
        // if (!frenetFrames.current || !steeringWheelRef) return;
        if (!steeringWheelRef) return;
        // const curve = path.parameters.path.options.extrudePath;
        var t = (time % loopTime) / loopTime;
        var pos = tubeGeometry.parameters.path.getPointAt(t);
        pos.multiplyScalar(scale);
        // interpolation
        var segments = tubeGeometry.tangents.length;//frenetFrames.current.tangents.length;
        var pickt = t * segments;
        var pick = Math.floor(pickt);
        var pickNext = (pick + 1) % segments;
        binormal.subVectors(tubeGeometry.binormals[pickNext], tubeGeometry.binormals[pick]);
        binormal.multiplyScalar(pickt - pick).add(tubeGeometry.binormals[pick]);
        var dir = tubeGeometry.parameters.path.getTangentAt(t);
        normal.copy(binormal).cross(dir);
        // We move on a offset on its binormal
        pos.add(normal.clone().multiplyScalar(offset));
        cameraRef.current.position.copy(pos);
        // Using arclength for stablization in look ahead.
        var lookAt = tubeGeometry.parameters.path.getPointAt((t + 30 / tubeGeometry.parameters.path.getLength()) % 1).multiplyScalar(scale);
        // Camera Orientation 2 - up orientation via normal
        lookAt.copy(pos).add(dir);
        cameraRef.current.matrix.lookAt(cameraRef.current.position, lookAt, normal);
        cameraRef.current.rotation.setFromRotationMatrix(cameraRef.current.matrix, cameraRef.current.rotation.order);
        steeringWheelRef.current.rotation.y = cameraRef.current.rotation.y * .2;
        cadillacRef.current.rotation.x = cameraRef.current.rotation.x * .01;
        cadillacRef.current.rotation.y = cameraRef.current.rotation.y * .01;
        // cadillacRef.current.position.copy(new THREE.Vector3(cameraRef.current.x, cameraRef.current.y, cameraRef.current.z - 10));
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
                    {cadillacHoodGeoms.map(geometry => {
                        return <mesh
                            key={geometry.name}
                            geometry={geometry}
                            scale={[2,2,2]}
                            position={[.5, -3, -.5]}
                        />
                    })}
                </group>
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
    </>
}

