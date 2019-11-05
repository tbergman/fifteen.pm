import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree , extend } from 'react-three-fiber';
import { FirstPersonControls } from 'three-full';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { isMobile } from '../../Utils/BrowserDetection';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

extend({ OrbitControls, FlyControls, PointerLockControls });

export default function DashCam({target}) {
    const ref = useRef()
    const { gl, mouse, aspect, size, setDefaultCamera } = useThree();
    // Make the camera known to the system
    const lookAt = useRef(new THREE.Vector3());
    useEffect(() => {
        ref.current.aspect = aspect;
        ref.current.updateMatrixWorld()
        setDefaultCamera(ref.current);
    }, [])
    // Update it every frame
    useFrame(() => ref.current.updateMatrixWorld())
    const controls = useRef();
    // const { gl } = useThree();
    const delta = .001;
    // useFrame(() => { controls.current && controls.current.update(delta) });
    // useFrame(() => {
    // console.log(mouse, lookAt.current)
    // lookAt.current.x += ( mouse.x - lookAt.current.x ) * .02;
    // lookAt.current.y += ( - mouse.y - lookAt.current.y ) * .02;
    // lookAt.current.z = ref.current.position.z; // assuming the camera is located at ( 0, 0, z );
    // ref.current.lookAt( lookAt );
    // console.log("lookAt", ref.current);
    // console.log('mouse', mouse)
    // ref.current.quaternion.appl
    // })

    console.log('target', target)

    return <>
        <perspectiveCamera
            ref={ref}
            aspect={size.width / size.height}
            radius={(size.width + size.height) / 4}
            fov={55}
            position={[0, .068, .15]}
            onUpdate={self => self.updateProjectionMatrix()}
        />
        {ref.current && <pointerLockControls
            ref={controls}
            onUpdate={console.log(" controls updated with target", target, 'cam', ref.current)}
            // args={[ref.current]}
            args={[ref.current, gl.domElement]}
            // dragToLook={true}
            isLocked={true}
            // lookAt={target}
            // enableKeys={false}
            // enableZoom={false}
            // {...props}

        />}
    </>
}
