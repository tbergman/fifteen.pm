import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useRender, useThree, useResource } from 'react-three-fiber';
import { Cadillac } from './car';
import { Metal03Material } from '../../Utils/materials'

export function Camera({ fov, near, far, path, maxDist, center, lightProps, steeringWheelGeoms, cadillacHoodGeoms }) {

    const spotLight = useRef();
    const cameraRef = useRef();
    const parentRef = useRef();
    const steeringWheelRef = useRef();
    const { setDefaultCamera, scene } = useThree();
    const frenetFrames = useRef();
    const [metal03MaterialRef, metal03Material] = useResource();
    const normal = new THREE.Vector3(0, 0, 0);
    const binormal = new THREE.Vector3(0, 1, 0);
    const loopTime = 500000;
    const scale = 1;
    const offset = 6;

    useEffect(() => {
        if (cameraRef.current) {
            setDefaultCamera(cameraRef.current);
        }
    }, [cameraRef]);

    // useEffect(() => {
    //     const closed = true;
    //     if (path) {
    //         const curve = path.parameters.options.extrudePath;
    //         frenetFrames.current = curve.computeFrenetFrames(loopTime, closed);
    //     }
    // });

    const cadillacPos = new THREE.Vector3()
    // useRender((state, time) => {
    //     if (!frenetFrames.current || !cadillacRef) return;
    //     const curve = path.parameters.options.extrudePath;
    //     var t = (time % loopTime) / loopTime;
    //     var pos = curve.getPointAt(t);
    //     pos.multiplyScalar(scale);
    //     // interpolation
    //     var segments = frenetFrames.current.tangents.length;
    //     var pickt = t * segments;
    //     var pick = Math.floor(pickt);
    //     var pickNext = (pick + 1) % segments;
    //     binormal.subVectors(frenetFrames.current.binormals[pickNext], frenetFrames.current.binormals[pick]);
    //     binormal.multiplyScalar(pickt - pick).add(frenetFrames.current.binormals[pick]);
    //     var dir = curve.getTangentAt(t);
    //     normal.copy(binormal).cross(dir);
    //     // We move on a offset on its binormal
    //     pos.add(normal.clone().multiplyScalar(offset));
    //     cameraRef.current.position.copy(pos);
    //     // Using arclength for stablization in look ahead.
    //     var lookAt = curve.getPointAt((t + 30 / curve.getLength()) % 1).multiplyScalar(scale);
    //     // Camera Orientation 2 - up orientation via normal
    //     lookAt.copy(pos).add(dir);
    //     cameraRef.current.matrix.lookAt(cameraRef.current.position, lookAt, normal);
    //     cameraRef.current.rotation.setFromRotationMatrix(cameraRef.current.matrix, cameraRef.current.rotation.order);
    //     // cadillacRef.current.position.copy(new THREE.Vector3(cameraRef.current.x, cameraRef.current.y, cameraRef.current.z - 10));
    // })

    return <>
        {/* <Metal03Material materialRef={metal03MaterialRef} /> */}
        <perspectiveCamera
            ref={cameraRef}
            fov={fov}
            near={near}
            far={far}
        >
            {cameraRef.current && steeringWheelGeoms.length && cadillacHoodGeoms.length &&
                <>
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
                            position={[.5, -1.5, .5]}
                        />
                    })}
                </>
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

