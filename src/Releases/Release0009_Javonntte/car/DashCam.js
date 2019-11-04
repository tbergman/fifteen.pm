import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from 'react-three-fiber';

export default function DashCam() {
    const ref = useRef()
    const { mouse, aspect, size, setDefaultCamera } = useThree();
    // Make the camera known to the system
    const lookAt = useRef(new THREE.Vector3());
    useEffect(() => {
        ref.current.aspect = aspect;
        ref.current.updateMatrixWorld()
        setDefaultCamera(ref.current);
    }, [])
    // Update it every frame
    useFrame(() => ref.current.updateMatrixWorld())

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
    
    return <perspectiveCamera
        ref={ref}
        aspect={size.width / size.height}
        radius={(size.width + size.height) / 4}
        fov={55}
        position={[0, .068, .15]}
        onUpdate={self => self.updateProjectionMatrix()}
    />
}
