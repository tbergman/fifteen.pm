import React, { useEffect, useRef, useState, useMemo } from 'react';
import { apply as applyThree, Canvas, extend, useRender, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { apply as applySpring, useSpring, a, interpolate } from 'react-spring/three'

// Import and register postprocessing classes as three-native-elements
import { UnrealBloomPass } from 'three-full';
import { EffectComposer } from 'three-full';
import { RenderPass } from 'three-full';
import { GlitchPass } from 'three-full';

applySpring({ EffectComposer, RenderPass, GlitchPass, UnrealBloomPass })
extend({ EffectComposer, RenderPass, GlitchPass, UnrealBloomPass })


/** This component creates a glitch effect */
export const GlitchEffect = React.memo(({ factor }) => {
    const { gl, scene, camera, size } = useThree()
    const composer = useRef()
    useEffect(() => void composer.current.setSize(size.width, size.height), [size])
    // This takes over as the main render-loop (when 2nd arg is set to true)
    useRender(() => composer.current.render(), true)
    return (
        <effectComposer ref={composer} args={[gl]}>
            <renderPass attachArray="passes" args={[scene, camera]} />
            <a.glitchPass attachArray="passes" renderToScreen factor={factor} />
        </effectComposer>
    )
})


export const BloomEffect = React.memo(({ camera, factor }) => {
    const { gl, scene, size } = useThree()
    const composer = useRef()
    useEffect(() => void composer.current.setSize(size.width, size.height), [size])
    useRender(() => { return composer.current.render() }, true)
    return (

        <effectComposer ref={composer} args={[gl]}>
            <renderPass attachArray="passes" args={[scene, camera]} />
            <a.unrealBloomPass
                attachArray="passes"
                renderToScreen
                radius={.5}
                threshold={.01}
                strength={1.5}
                // resolution={new THREE.Vector2(window.innerWidth, window.innerHeight)}//{x: size.width, y: size.height}} />
            />
        </effectComposer>
    )
});
