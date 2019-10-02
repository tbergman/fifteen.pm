import React, { useRef } from 'react';
import { extend, useRender, useThree } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import {isMobile} from '../../Utils/BrowserDetection';

extend({ OrbitControls, FlyControls });

export function Controls({ radius, ...props }) {
    const controls = useRef();
    const { camera } = useThree();
    const delta = .001;
    useRender(() => { controls.current && controls.current.update(delta) });
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
                args={[camera]}
                {...props}
            />
    );
}