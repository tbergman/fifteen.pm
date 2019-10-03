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
    useRender(() => {
        // TODO - could use speed offset to control bounds. See: https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_fly.html
        // // Computes the Euclidean length (straight-line length) from (0, 0, 0) to (x, y, z).
        const distFromOrigin = camera.position.length();
        const distToSurface = (distFromOrigin - radius * 1.01);
        // speed as factor of distance to surface 
    })
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