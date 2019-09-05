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
import { FilmPass } from 'three-full';
import { VignetteShader } from 'three-full';
import { HorizontalBlurShader } from 'three-full';
import { VerticalBlurShader } from 'three-full';

applySpring({ EffectComposer, RenderPass, GlitchPass, UnrealBloomPass, DotScreenPass, MaskPass, ShaderPass, ClearMaskPass, VerticalBlurShader, HorizontalBlurShader, FilmPass })
extend({ EffectComposer, RenderPass, GlitchPass, UnrealBloomPass, DotScreenPass, MaskPass, ShaderPass, ClearMaskPass, VerticalBlurShader, HorizontalBlurShader, FilmPass })


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


export const BloomEffect = React.memo(({ camera, radius = .1, threshold = .01, strength = 0.5, factor }) => {
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
                radius={radius}
                threshold={threshold}
                strength={strength}
            // resolution={new THREE.Vector2(window.innerWidth, window.innerHeight)}//{x: size.width, y: size.height}} />
            />
        </effectComposer>
    )
});

// https://github.com/mrdoob/three.js/blob/master/examples/webgl_postprocessing_advanced.html
export const Advanced2Effect = React.memo(({ camera }) => {
    const { gl, scene, size } = useThree()
    const composer = useRef();
    const delta = useRef(0.01);
    useEffect(() => void composer.current.setSize(size.width, size.height), [size]);
    useRender(() => { return composer.current.render(delta.current) }, true);

    return (
        <effectComposer ref={composer} args={[gl]}>
            <renderPass
                attachArray="passes"
                args={[scene, camera]} />

            {/*    <shaderPass
                attachArray="passes"
                args={[HorizontalBlurShader]}
                uniforms-h-value={2 / (size.width / 2)}
            />
            <shaderPass
                attachArray="passes"
                args={[VerticalBlurShader]}
                uniforms-v-value={2 / (size.height / 2)}
            />
            <dotScreenPass
                attachArray="passes"
                renderToScreen
                args={[new THREE.Vector2(0, 0), 0.5, 0.8]}
            />
            <maskPass
                attachArray="passes"
                // renderToScreen
                args={[scene, camera]}
            /> */}
            {/* <shaderPass
                attachArray="passes"
                renderToScreen
                uniforms-color={new THREE.Uniform(new THREE.Color(1.0, 0.0, 0.0))}
                args={[ColorifyShader]}
            /> */}
            <dotScreenPass
                attachArray="passes"
                // renderToScreen
                args={[new THREE.Vector2(0, 0), 0.5, 1.]} // center angle scale
            /> 
            <filmPass
                attachArray="passes"
                renderToScreen
                args={[0.35, 0.025, 648, false]}
            />
            {/* <shaderPass
                attachArray="passes"
                // renderToScreen
                uniforms-offset-value={0.95}
                uniforms-darkness-value={1.6}
                args={[VignetteShader]}
            /> */}

            {/* <clearMaskPass
                attachArray="passes"
                renderToScreen
            /> */}
            {/* <maskPass
                attachArray="passes"
                renderToScreen
                inverse
                args={[scene, camera]}
            /> */}

            {/* <shaderPass
                attachArray="passes"
                renderToScreen
                uniforms-color={new THREE.Uniform(new THREE.Color(1, 0.75, 0.5))}
                args={[ColorifyShader]}
            /> */}

            {/* <shaderPass
                attachArray="passes"
                renderToScreen
                uniforms-offset-value={0.95}
                uniforms-darkness-value={1.6} 
                args={[VignetteShader]}
            /> */}

            {/* <clearMaskPass
                attachArray="passes"
                renderToScreen
            /> */}


        </effectComposer>
    );
});