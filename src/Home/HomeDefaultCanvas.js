import React from 'react';
import { Canvas } from 'react-three-fiber';
import HomeDefaultScene from './HomeDefaultScene';

export function HomeDefaultCanvas({ }) {
    return (
        <Canvas
            id="canvas"
            pixelRatio={window.devicePixelRatio}
            onCreated={({ gl }) => {
                gl.shadowMap.enabled = true;
                gl.gammaInput = true;
                gl.gammaOutput = true;
                gl.antialias = true;
                // IMPORTANT: Turn this on for development!
                // gl.debug.checkShaderErrors = false;
            }}
        >
            )}
            <HomeDefaultScene />
        </Canvas>
    )
}
