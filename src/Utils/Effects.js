import React, { useEffect, useRef, useState, useMemo } from 'react';
import { apply as applyThree, Canvas, extend, useRender, useThree } from 'react-three-fiber';
import * as THREE from 'three';
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import TileGenerator from "../../Utils/TileGenerator";
// import { CityTile } from "./tiles";
// import { assetPath9 } from "./utils";
// import { useGLTF } from "../../Utils/hooks";
// import { Effects } from "../../Utils/Effects";
// import { BUILDINGS_URL } from "./constants";
// import "./index.css";

import {apply as applySpring, useSpring, a, interpolate } from 'react-spring/three'

// Import and register postprocessing classes as three-native-elements
import { EffectComposer } from './postprocessing/EffectComposer'
import { RenderPass } from './postprocessing/RenderPass'
import { GlitchPass } from './postprocessing/GlitchPass'

applySpring({ EffectComposer, RenderPass, GlitchPass })
extend({ EffectComposer, RenderPass, GlitchPass })
// extend({ OrbitControls });



/** This component creates a glitch effect */
export const Effects = React.memo(({ factor }) => {
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
