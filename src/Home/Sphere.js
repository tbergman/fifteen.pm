import { a } from '@react-spring/three';
import React, { useContext, useEffect, useState } from 'react';
import useYScroll from '../Common/Scroll/useYScroll';
import { MaterialsContext } from './MaterialsContext';

export default function Sphere({ radius }) {
    const [y] = useYScroll([-200, 200], { domTarget: window })
    const { foamGripPurple } = useContext(MaterialsContext)

    return (
        <>
            <a.group rotation-y={y.to(y => (y / 1000))}>
                <mesh material={foamGripPurple} >
                    <sphereBufferGeometry attach="geometry" args={[radius]} />
                </mesh>
            </a.group>
        </>
    )
}
