import React, { useRef } from 'react';
import { extend, useRender, useThree } from 'react-three-fiber';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
extend({ OrbitControls });


export function Controls(props) {//{ dampingFactor = 0.5, rotateSpeed = 0.2, target, prop }) {
    const controls = useRef();
    const { canvas, camera } = useThree();

    // document.removeEventListener('mousemove', onMouseMove, false);
    // document.addEventListener('mousemove', onMouseMove, false);

    // function onMouseMove(event) {
    //     console.log("MOVE")
    //     var deltaX = ((event.clientX) / (window.innerWidth) - 0.5) * Math.PI * 0.04;
    //     var deltaY = ((event.clientY) / (window.innerHeight) - 0.5) * Math.PI * 0.04;
    //     rotateCamera(deltaX, deltaY);
    // }

    // function rotateCamera(x, y) {
    //     camera.rotation.x = -y;
    //     camera.rotation.y = -x;
    // }

    useRender(() => { controls.current && controls.current.update() });
    return (
        <orbitControls
            ref={controls}
            args={[camera, canvas]}
            {...props}
        />
    );
}