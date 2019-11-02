import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from 'react-three-fiber';

export default function DashCam() {
    const ref = useRef()
    const { aspect, size, setDefaultCamera } = useThree();
    // Make the camera known to the system
    useEffect(() => {
        ref.current.aspect = aspect;
        ref.current.updateMatrixWorld()
        setDefaultCamera(ref.current);
    }, [])
    // Update it every frame
    useFrame(() => ref.current.updateMatrixWorld())
    return <perspectiveCamera
        ref={ref}
        aspect={size.width / size.height}
        radius={(size.width + size.height) / 4}
        fov={55}
        position={[0, .068, .15]}
        onUpdate={self => self.updateProjectionMatrix()}
    />
}
