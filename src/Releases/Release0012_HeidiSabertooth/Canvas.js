import React, { Suspense } from 'react';
import { Canvas } from 'react-three-fiber';
import { AudioPlayerContext } from '../../Common/UI/Player/AudioPlayerContext';
import { Scene } from './Scene';

export default function HeidiSabertoothCanvas({ }) {

    return (
        // Unfortunately some gymnastics required here to pass music player context through canvas.
        // There's more than one way to solve this and some room for clean-up but this does the job.
        // https://github.com/konvajs/react-konva/issues/188#issuecomment-478302062
        // https://github.com/react-spring/react-three-fiber/issues/114
        <AudioPlayerContext.Consumer>
            {
                value => (
                    <Canvas
                        id="canvas"
                        pixelRatio={window.devicePixelRatio}
                        onCreated={({ gl }) => {
                            gl.shadowMap.enabled = true;
                            gl.gammaInput = true;
                            gl.gammaOutput = true;
                            gl.antialias = true;
                            // IMPORTANT: Comment this out during development!
                            gl.debug.checkShaderErrors = false;
                        }}
                    >
                        <AudioPlayerContext.Provider value={value}>
                            <Suspense fallback={null}>
                                <Scene />
                            </Suspense>
                        </AudioPlayerContext.Provider>
                    </Canvas>
                )}
        </AudioPlayerContext.Consumer>
    )
}
