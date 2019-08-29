import React, { useEffect, useRef } from 'react';
import { useRender, useThree } from 'react-three-fiber';

export function Controls({ target }) {
    const controls = useRef();
    const { camera, canvas } = useThree();
    useEffect(() => {
        if (target) {
            console.log("TARGET", target);
            controls.current.target.copy(target);
        }
    }, [target])
    useRender(() => { controls.current && controls.current.update() });
    return (
        <orbitControls
            ref={controls}
            args={[camera, canvas]}
            enableDamping
            dampingFactor={0.5}
            rotateSpeed={0.2}
        />
    );
}

