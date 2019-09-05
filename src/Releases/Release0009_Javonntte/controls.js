import React, { useRef } from 'react';
import { extend, useRender, useThree } from 'react-three-fiber';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
extend({ OrbitControls });


export function Controls(props) {
    const controls = useRef();
    const { canvas, camera } = useThree();

    useRender(() => { controls.current && controls.current.update() });
    return (
        <orbitControls
            ref={controls}
            args={[camera, canvas]}
            {...props}
        />
    );
}