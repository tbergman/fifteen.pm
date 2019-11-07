import React, { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree, extend } from 'react-three-fiber';
import { FirstPersonControls } from 'three-full';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { isMobile } from '../../../Utils/BrowserDetection';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

extend({ OrbitControls, FlyControls, PointerLockControls });

export default function DashCam({ target }) {
    const ref = useRef()
    const { gl, mouse, aspect, size, setDefaultCamera } = useThree();

    useEffect(() => {
        window.addEventListener("touchmove", touchLook, false);
    })

    const [euler, PI_2] = useMemo(() => [new THREE.Euler(0, 0, 0, 'YXZ'), Math.PI / 2])

    const touchLook = (event) => {
        if (!ref.current) return;

        //   this.setMouseCoords(event.touches[0].clientX, event.touches[0].clientY);
        // var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        // console.log("EVENT", event)
        var movementX = (event.touches[0].clientX - window.innerWidth / 2) || 0;
        var movementY = (event.touches[0].clientY - window.innerHeight / 2) || 0;

        console.log('Event Touches: ', event.touches)
        console.log("MOVX", movementX, "MOVY", movementY)

        euler.setFromQuaternion(ref.current.quaternion);

        euler.x -= movementY * 0.00002;
        euler.y -= movementX * 0.00002;

        euler.x = Math.max(- PI_2, Math.min(PI_2, euler.x));
        ref.current.quaternion.setFromEuler(euler);

        //scope.dispatchEvent( { type: 'change' });
    }

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
        {ref.current &&
            // (isMobile ?
            //     <orbitControls
            //     ref={controls}
            //     target={target}
            //     args={[ref.current, gl.domElement]}
            //     enablePan={false}
            //     />
            //     :
            <pointerLockControls
                ref={controls}
                args={[ref.current, gl.domElement]}
                isLocked={true} />
            // )
        }
    </>
}
