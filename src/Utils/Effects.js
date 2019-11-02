import React, { useEffect, useRef, useState } from 'react';
import { a, apply as applySpring } from 'react-spring/three';
import { extend, useFrame, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { ClearMaskPass, DotScreenPass, GlitchPass, HorizontalBlurShader, MaskPass, VerticalBlurShader } from 'three-full';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';



applySpring({ EffectComposer, RenderPass, GlitchPass, UnrealBloomPass, DotScreenPass, MaskPass, ShaderPass, ClearMaskPass, VerticalBlurShader, HorizontalBlurShader, FilmPass })
extend({ EffectComposer, RenderPass, GlitchPass, UnrealBloomPass, DotScreenPass, MaskPass, ShaderPass, ClearMaskPass, VerticalBlurShader, HorizontalBlurShader, FilmPass })


/** This component creates a glitch effect */
export const GlitchEffect = React.memo(({ factor }) => {
    const { gl, scene, camera, size } = useThree()
    const composer = useRef()
    useEffect(() => void composer.current.setSize(size.width, size.height), [size])
    // This takes over as the main render-loop (when 2nd arg is set to true)
    useFrame(() => composer.current.render(), true)
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
    useFrame(() => { return composer.current.render() }, true)
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
    useFrame(() => { return composer.current.render(delta.current) }, true);

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
                args={[new THREE.Vector2(0.8, 0), 0.5, 1.]} // center angle scale
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

export const BloomFilmEffect = React.memo(({ }) => {
    const composer = useRef()
    const { scene, gl, size, camera, clock } = useThree()
    const [v, setV] = useState();
    useEffect(() => void composer.current.setSize(size.width, size.height), [size])
    useFrame(() => {
        composer.current.render()
        setV(Math.sin(clock.oldTime));
    }, 2)
    return (
        <effectComposer ref={composer} args={[gl]}>
            <renderPass attachArray="passes" scene={scene} camera={camera} />
            {/* // strength, radius threshold */}
            <unrealBloomPass attachArray="passes" args={[undefined, 2.6, 0.54, .998]} />
            <filmPass attachArray="passes" args={[.33, .04, 148, false]} />
        </effectComposer>
    )
});