import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { useKeyPress } from '../../../Utils/hooks';

export default function DashCam() {
    const ref = useRef()
    const { aspect, size, setDefaultCamera } = useThree();
    // Make the camera known to the system
    const lookLeft = useKeyPress('ArrowLeft');
    const lookRight = useKeyPress('ArrowRight');
    useEffect(() => {
        ref.current.aspect = aspect;
        ref.current.updateMatrixWorld()
        setDefaultCamera(ref.current);
    }, [])
    // Update it every frame
    useFrame(() => ref.current.updateMatrixWorld())
    useFrame(() => {
        if (lookLeft && ref.current.rotation.y < 1.5) ref.current.rotation.y += .0075;
        else if (lookRight && ref.current.rotation.y > -1.5) ref.current.rotation.y -= .0075;
        if (!lookLeft && ref.current.rotation.y > 0) {
            ref.current.rotation.y -= .1;
        }
        if (!lookRight && ref.current.rotation.y < 0) {
            ref.current.rotation.y += .1;
        }
    })
    return <perspectiveCamera
        ref={ref}
        aspect={size.width / size.height}
        radius={(size.width + size.height) / 4}
        fov={55}
        position={[0, .068, .15]}
        onUpdate={self => self.updateProjectionMatrix()}
    />
}
