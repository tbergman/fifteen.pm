import React, { useRef } from 'react';
import { extend, useFrame, useThree } from 'react-three-fiber';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { isMobile } from '../../Utils/BrowserDetection';

extend({ OrbitControls, FlyControls });


export function Controls({curCamera, ...props}) {
    curCamera = curCamera || useThree().camera;
    const controls = useRef();
    const { gl } = useThree();
    const delta = .001;
    useFrame(() => { controls.current && controls.current.update(delta) });
    return (
        // isMobile ?
            // <orbitControls
            //     ref={controls}
            //     args={[curCamera]}
            //     enableKeys={false}
            //     enableZoom={false}
            //     {...props}
            // />
            // :
            <flyControls
                ref={controls}
                args={[curCamera, gl.domElement]}
                {...props}
            />
    );
}