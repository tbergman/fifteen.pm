import React, { useState, useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from 'react-three-fiber';
import { isMobile } from '../../../Utils/BrowserDetection';

export default function DashCam({ useDashCam }) {
    const ref = useRef()
    const { aspect, size, setDefaultCamera } = useThree();
    const [looking, setLooking] = useState(false);

    useEffect(() => {
        window.addEventListener("touchmove", look, false);
        window.addEventListener("mousemove", look, false);
        window.addEventListener("touchend", () => setLooking(false), false);
    })

    const [euler, PI_7, PI_48, PI_96] = useMemo(() => [
        new THREE.Euler(0, 0, 0, 'YXZ'),
        Math.PI / 7,
        Math.PI / 48,
        Math.PI / 96
    ])

    const look = (event) => {
        if (!ref.current) return;
        if (!looking) setLooking(true);
        const [clientX, clientY] = (() => {
            if (event.touches) {
                return [event.touches[0].clientX, event.touches[0].clientY]
            } else {
                return [event.clientX, event.clientY]
            }
        })()
        const movementX = (clientX - window.innerWidth / 2) || 0;
        const movementY = (clientY - window.innerHeight / 2) || 0;
        euler.setFromQuaternion(ref.current.quaternion);
        euler.x -= movementY * 0.00005;
        euler.y -= movementX * 0.00005;
        euler.y = Math.max(- PI_48, Math.min(PI_48, euler.y));
        euler.x = Math.max(- PI_96, Math.min(PI_7, euler.x));
        ref.current.quaternion.setFromEuler(euler);
    }

    // revert back to rotation 0 on mobile if no touch action
    useFrame(() => {
        if (!isMobile || looking) return;
        if (ref.current.rotation.y > 0) ref.current.rotation.y -= .1;
        if (ref.current.rotation.y < 0) ref.current.rotation.y += .1;
        if (ref.current.rotation.x > 0) ref.current.rotation.x -= .1;
        if (ref.current.rotation.x < 0) ref.current.rotation.x += .1;
    })

    // Make the camera known to the system
    useEffect(() => {
        if (!useDashCam) return;
        ref.current.aspect = aspect;
        ref.current.updateMatrixWorld()
        setDefaultCamera(ref.current);
    }, [useDashCam])

    // Update it every frame
    useFrame(() => ref.current.updateMatrixWorld())
    return <>
        <perspectiveCamera
            ref={ref}
            aspect={size.width / size.height}
            radius={(size.width + size.height) / 4}
            fov={50}
            near={.1}
            position={[0, .068, .15]}
            onUpdate={self => self.updateProjectionMatrix()}
        />
    </>
}
