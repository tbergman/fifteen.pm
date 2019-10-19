import React, { useRef } from 'react';
import { extend, useFrame, useThree } from 'react-three-fiber';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { isMobile } from '../../Utils/BrowserDetection';

extend({ OrbitControls, FlyControls });


export function Controls({ radius, road, ...props }) {
    const controls = useRef();
    const { camera, gl } = useThree();
    const delta = .001;
    console.log("GL", gl)
    useFrame(() => { controls.current && controls.current.update(delta) });
    return (
        isMobile ?
            <orbitControls
                ref={controls}
                args={[camera]}
                {...props}
            />
            :
            <flyControls
                ref={controls}
                args={[camera, gl.domElement]}
                {...props}
            />
    );
}