import React, { useRef } from 'react';
import { extend, useFrame, useThree, useResource } from 'react-three-fiber';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { isMobile } from '../../Utils/BrowserDetection';
import Headlights from './car/Headlights';
import * as C from './constants';

extend({ OrbitControls, FlyControls });


export function Controls({ curCamera, ...props }) {
    curCamera = curCamera || useThree().camera;
    const controls = useRef();
    const [controlsGroupRef, controlsGroup] = useResource();
    const { gl } = useThree();
    const delta = .001;

    useFrame(() => {
        if (!controls.current) return;  
        // An inefficient hack where the headlights dont look in the right direction
        // since headlights are tied to car and we're not in it
        controlsGroup.position.copy(controls.current.object.position)

    })

    useFrame(() => { controls.current && controls.current.update(delta) });

    return (
        // isMobile ?
        <group ref={controlsGroupRef}>
            <orbitControls
                ref={controls}
                args={[curCamera, gl.domElement]}
                // enableKeys={false}
                // enableZoom={false}
                {...props}
            >
            </orbitControls>
            <Headlights colors={C.TRACK_THEMES[3].headlights} />
        </group>
        // :
        // <flyControls
        //     ref={controls}
        //     args={[curCamera, gl.domElement]}
        //     {...props}
        // />
    );
}