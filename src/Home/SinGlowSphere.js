import { default as React, useContext, useRef } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { MaterialsContext } from './MaterialsContext';


export default function SinGlowSphere({ radius }) {
    const { foamGripPurple } = useContext(MaterialsContext)
    const { clock } = useThree();
    const light = useRef();
    useFrame(() => {
        const throb = Math.abs(Math.sin(clock.elapsedTime)) + 20
        light.current.intensity = throb
    })
    return (
        <>
            <pointLight ref={light} color={"purple"} />
            <mesh material={foamGripPurple} >
                <sphereBufferGeometry attach="geometry" args={[radius]} />
            </mesh>
        </>
    )
}
