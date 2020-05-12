import React, { Suspense, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from 'react-three-fiber';
import DetroitLogo from '../Releases/Release0009_Javonntte/detroitBelt/DetroitLogo'
import { MaterialsProvider } from '../Releases/Release0009_Javonntte/MaterialsContext';
import useYScroll from '../Common/Scroll/useYScroll'
import { a } from '@react-spring/three'

export default function HomeDefaultScene({ }) {
    const { scene, camera } = useThree();
    const [y] = useYScroll([-200, 200], { domTarget: window })
    useEffect(() => {
        camera.position.z = -5
        scene.background = new THREE.Color(0x18d921);
    })

    return (
        <>
            <MaterialsProvider>
                <Suspense fallback={null}>
                    <a.group rotation-y={y.interpolate(y => (y / 1000))}>
                        <DetroitLogo />
                    </a.group>
                </Suspense>
            </MaterialsProvider>
        </>
    )
}

