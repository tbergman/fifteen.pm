import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { extend, useRender, useThree } from 'react-three-fiber';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TrackballControls } from 'three-full';
import { FirstPersonControls } from "../../Utils/FirstPersonControls"
extend({ OrbitControls, TrackballControls, FirstPersonControls });

export function Controls({boundingRadius, ...props}) {
    const controls = useRef();
    const { camera } = useThree();
    // const [shouldCheckPosition, setShouldCheckPosition] = useState(false);
    // const [prevPos, setPrevPos] = useState(camera.position);
    // const origin = new THREE.Vector3(); // TODO this is hacky should be passed in
    // const diff = new THREE.Vector3(camera.position);
    // useEffect(() => {
    //     // diff.subVectors(diff, )
    //     if (camera.position.distanceTo(origin) >= boundingRadius){
    //         console.log("PASSED LIMIT at pos", camera.position)

    //         // camera.position.copy(prevPos);
    //         // console.log("PASSED LIMIT at pos", camera.position)
    //         setPrevPos(camera.position);
    //     }
    // }, [shouldCheckPosition])
    // useRender((state, time) =>{
    //     if ((time % .001).toFixed(3) == 0) {
    //         setShouldCheckPosition(true);
    //     } else if (!shouldCheckPosition) {
    //         setShouldCheckPosition(false);
    //     }
    // })
    useRender(() => { controls.current && controls.current.update(.001) });
    return (
        <firstPersonControls
            ref={controls}
            args={[camera]}
            {...props}
        />
    );
}