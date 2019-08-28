import React, { useEffect, useRef, useState, useMemo } from 'react';
import { apply as applyThree, Canvas, extend, useRender, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { apply as applySpring, useSpring, a, interpolate } from 'react-spring/three'

// Import and register postprocessing classes as three-native-elements
import { UnrealBloomPass } from 'three-full';
import { EffectComposer } from 'three-full';
import { RenderPass } from 'three-full';
import { GlitchPass } from 'three-full';
import { DotScreenPass } from 'three-full';
import { MaskPass } from 'three-full';
import { ShaderPass } from 'three-full';
import { ColorifyShader } from 'three-full';
import { ClearMaskPass } from 'three-full';
import { VignetteShader } from 'three-full';

applySpring({ EffectComposer, RenderPass, GlitchPass, UnrealBloomPass, DotScreenPass, MaskPass, ShaderPass, ClearMaskPass })
extend({ EffectComposer, RenderPass, GlitchPass, UnrealBloomPass, DotScreenPass, MaskPass, ShaderPass, ClearMaskPass })


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


export const Advanced2Effect = React.memo(({ camera }) => {
    const { gl, scene, size } = useThree()
    const composer = useRef()
    useEffect(() => void composer.current.setSize(size.width, size.height), [size])
    useRender(() => { return composer.current.render() }, true)
    return (
        <effectComposer ref={composer} args={[gl]}>
            {/* AT THIS POINT THE ENTIRE FIRST PART OF RENDERER <renderPass
            attachArray="passes"

            /> */}
            
            <renderPass
                attachArray="passes"
                args={[scene, camera]} />
            <dotScreenPass
                attachArray="passes"
                renderToScreen
                args={[new THREE.Vector2(0, 0), 0.5, 0.8]}
            />
            <maskPass
                attachArray="passes"
                renderToScreen
                args={[scene, camera]}
            />
            <shaderPass
                attachArray="passes"
                renderToScreen
                uniforms-color={new THREE.Uniform(new THREE.Color(1, 0.8, 0.8))}
                args={[ColorifyShader]}
            />
            <clearMaskPass
                attachArray="passes"
                renderToScreen
            />
            {/* <maskPass
                attachArray="passes"
                renderToScreen
                inverse
                args={[scene, camera]}
            /> */}
            {/* <a.shaderPass
                attachArray="passes"
                renderToScreen
                uniforms-color={new THREE.Uniform(new THREE.Color(1, 0.75, 0.5))}
                args={[ColorifyShader]}
            /> */}
            {/* <a.clearMaskPass
                attachArray="passes"
                renderToScreen
            /> */}
            {/* <a.shaderPass
                attachArray="passes"
                renderToScreen
                args={[VignetteShader]}
            /> */}




            {/* 
				composer2.addPass( renderMaskInverse );
				composer2.addPass( effectColorify2 );
				composer2.addPass( clearMask );
				composer2.addPass( effectVignette );  */}
        </effectComposer>
    )
    ////	renderScene.uniforms[ "tDiffuse" ].value = composerScene.renderTarget2.texture;
});