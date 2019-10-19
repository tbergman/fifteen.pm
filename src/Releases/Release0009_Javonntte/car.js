import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useResource, useThree, useLoader } from 'react-three-fiber';
import { useGLTF } from "../../Utils/hooks";
import * as C from './constants';
import { EmissiveMaterial, Metal03Material, TronMaterial, BlackLeather12 } from '../../Utils/materials';

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

// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// // TODO !!! --> https://github.com/react-spring/react-three-fiber/blob/master/migration.md#gltf-to-jsx
// function Model(props) {
//     const group = useRef()
//     const gltf = useLoader(GLTFLoader, stork)
//     const actions = useRef()
//     const [mixer] = useState(() => new THREE.AnimationMixer())
//     useFrame((state, delta) => mixer.update(delta))
//     useEffect(() => {
//       const root = group.current
//       actions.current = { storkFly_B_: mixer.clipAction(gltf.animations[0], root) }
//       return () => gltf.animations.forEach(clip => mixer.uncacheClip(clip))
//     }, [])
//     useEffect(() => void actions.current.storkFly_B_.play(), [])
//     return (
//       <group ref={group} {...props}>
//         <scene name="AuxScene">
//           <mesh
//             castShadow
//             receiveShadow
//             name="mesh_0"
//             morphTargetDictionary={gltf.__$[1].morphTargetDictionary}
//             morphTargetInfluences={gltf.__$[1].morphTargetInfluences}>
//             <bufferGeometry attach="geometry" {...gltf.__$[1].geometry} />
//             <meshStandardMaterial attach="material" {...gltf.__$[1].material} />
//           </mesh>
//         </scene>
//       </group>
//     )
//   }

function Dash({ dashGeoms, onLightsButtonClicked }) {
    const [dashRef, dash] = useResource();
    const [buttonRef, button] = useResource();
    const [metal03MaterialRef, metal03Material] = useResource();
    const [emissiveMaterialRef, emissiveMaterial] = useResource();
    const [tronMaterialRef, tronMaterial] = useResource();
    const dashPos = new THREE.Vector3(8, 12.5, -1);//.add(position);

    // TODO button animation https://github.com/react-spring/react-three-fiber/blob/799d21878a472f7f2bfb2c7051c5f84a56bc491f/examples/components/GltfAnimation.js
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
    const [blackLeather12MaterialRef, blackLeather12Material] = useResource();
    useFrame((state, time) => {
        if (!steeringWheel) return;
        steeringWheel.rotation.y = curCamera.rotation.y * .2;
        // cadillacRef.current.rotation.x = cameraRef.current.rotation.x * .01;
        // cadillacRef.current.rotation.y = cameraRef.current.rotation.y * .01;
    })
    return <group ref={steeringWheelRef}>
        <BlackLeather12
            materialRef={blackLeather12MaterialRef}
            textureRepeat={{ x: 4, y: 1 }}
        />
        {blackLeather12Material && steeringWheelGeoms.map(geometry => {
            // if (geometry.name == "Gloves") {
            return <mesh
                key={geometry.name}
                ref={steeringWheelRef}
                geometry={geometry}
                material={blackLeather12Material}
            />
            // } else {
            //     return <mesh
            //         key={geometry.name}
            //         ref={steeringWheelRef}
            //         geometry={geometry}
            //     />
            // }
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

export default function Car({
    curCamera,
    position,
    road,
    drivingProps,
    steeringWheelGeoms,
    cadillacHoodGeoms,
    dashGeoms,
    onLightsButtonClicked,
    lightProps,
}) {
    const [carRef, car] = useResource();
    curCamera = curCamera || useThree().camera;
    const { clock } = useThree();
    const normal = new THREE.Vector3();
    const binormal = new THREE.Vector3();
    const up = new THREE.Vector3(0, 2, 2);// TODO these is supposed to be normalized to 1 and have only 1 non zero value lol  


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
        curCamera.position.copy(pos);
        // Using arclength for stablization in look ahead.
        const lookAt = road.parameters.path.getPointAt((t + 30 / road.parameters.path.getLength()) % 1).multiplyScalar(drivingProps.scale);
        // Camera Orientation 2 - up orientation via normal
        lookAt.copy(pos).add(dir);
        curCamera.matrix.lookAt(curCamera.position, lookAt, normal);
        curCamera.rotation.setFromRotationMatrix(curCamera.matrix);
        curCamera.rotation.z += Math.PI / 12; // TODO added code - can it be baked into matrix rotation?
        car.position.copy(curCamera.position).add(position);
    })

    // TODO render order to make sure the car's always in front https://discourse.threejs.org/t/always-render-mesh-on-top-of-another/120/5
    return <
        group
        ref={carRef}
     
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