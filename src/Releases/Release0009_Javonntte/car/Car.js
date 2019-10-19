import React, { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useResource, useThree, useLoader } from 'react-three-fiber';
// import DashCam from './DashCam';
import Dash from './Dash';
import Headlamps from './Headlamps';
import SteeringWheel from './SteeringWheel';

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

export default function Car({
    road,
    drivingProps,
    steeringWheelGeoms,
    cadillacHoodGeoms,
    dashGeoms,
    onLightsButtonClicked,
}) {

    const { clock, setDefaultCamera } = useThree();
    const [dashCamRef, dashCam] = useResource();
    const [carRef, car] = useResource();
    const [dashCamActive, setDashCamActive] = useState(false);
    const [normal, binormal, up] = useMemo(() => {
        return [
            new THREE.Vector3(),
            new THREE.Vector3(),
            new THREE.Vector3(0, 2, 2), // TODO these is supposed to be normalized to 1 and have only 1 non zero value lol  
        ]
    });

    useEffect(() => {
        if (dashCam){
            console.log("DASHCAM!")
            setDashCamActive(true);
        }
        
    }, [dashCam])

    // TODO http://jsfiddle.net/krw8nwLn/66/
    useFrame(() => {
        if (!car) return;
        const t = (clock.elapsedTime % drivingProps.numSteps) / drivingProps.numSteps;
        const pos = road.parameters.path.getPointAt(t);
        pos.multiplyScalar(drivingProps.scale);
        // interpolation
        const segments = road.tangents.length;
        const pickt = t * segments;
        const pick = Math.floor(pickt);
        const pickNext = (pick + 1) % segments;
        binormal.subVectors(road.binormals[pickNext], road.binormals[pick]);
        binormal.multiplyScalar(pickt - pick).add(road.binormals[pick]).add(up);
        const dir = road.parameters.path.getTangentAt(t);
        normal.copy(binormal).cross(dir)
        // We move on a offset on its binormal
        pos.add(normal.clone().multiplyScalar(drivingProps.offset));
        car.position.copy(pos);
        // Using arclength for stablization in look ahead.
        const lookAt = road.parameters.path.getPointAt((t + 30 / road.parameters.path.getLength()) % 1).multiplyScalar(drivingProps.scale);
        // Camera Orientation 2 - up orientation via normal
        lookAt.copy(pos).add(dir);
        car.matrix.lookAt(car.position, lookAt, normal);
        car.rotation.setFromRotationMatrix(car.matrix);
        car.rotation.z += Math.PI / 12; // TODO added code - can it be baked into matrix rotation?
    })


    // TODO render order to make sure the car's always in front https://discourse.threejs.org/t/always-render-mesh-on-top-of-another/120/5
    return <group ref={carRef}>
        
            <SteeringWheel
                curCamera={dashCam}
                steeringWheelGeoms={steeringWheelGeoms}
            />
            <Dash
                dashGeoms={dashGeoms}
                onLightsButtonClicked={onLightsButtonClicked}
            >
                <perspectiveCamera
                    position={[0,0,70]}
                    onUpdate={self => {
                        console.log("UPDARTE!", self)
                        setDefaultCamera(self)
                    }}
                    ref={dashCamRef}
                    far={5000}
                    />
            </Dash>
            <Headlamps
                intensity={1.1}
                // penumbra: 0.1,
                distance={10000}
                shadowCameraNear={.0001}
                shadowCameraFar={200}
                shadowMapSizeWidth={512}
                shadowMapSizeHeight={512}
            />
    </group >;
}