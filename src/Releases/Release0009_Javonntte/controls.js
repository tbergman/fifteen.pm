import React, { useRef } from 'react';
import { useRender, useThree } from 'react-three-fiber';

export function Controls() {
    const controls = useRef();
    const { camera, canvas } = useThree();
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

