import React, { useRef } from 'react';
import { extend, useRender, useThree } from 'react-three-fiber';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TrackballControls } from 'three-full';
import {FirstPersonControls} from "../../Utils/FirstPersonControls"
extend({ OrbitControls, TrackballControls, FirstPersonControls });


export function Controls(props) {
    const controls = useRef();
    const { canvas, camera } = useThree();

    useRender(() => { controls.current && controls.current.update(.01) });
    return (
        // <orbitControls
        //     ref={controls}
        //     args={[camera, canvas]}
        //     {...props}
        // />
        // <trackballControls
        //     ref={controls}
        //     args={[camera, canvas]}
        // />
        <firstPersonControls
            ref={controls}
            args={[camera, canvas]}
            {...props}
        />
    );
}