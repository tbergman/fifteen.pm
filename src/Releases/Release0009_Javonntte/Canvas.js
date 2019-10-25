import React from 'react';
import { Scene } from './Scene';
import { Canvas, useFrame } from 'react-three-fiber';
import { MusicPlayerProvider, MusicPlayerContext } from '../../UI/Player/MusicPlayerContext';
import { BloomFilmEffect } from '../../Utils/Effects';

export default function JavonntteCanvas({}) {
    return (
        // Unfortunately some gymnastics required here to pass music player context through canvas.
        // There's more than one way to solve this and some room for clean-up but this does the job.
        // https://github.com/konvajs/react-konva/issues/188#issuecomment-478302062
        // https://github.com/react-spring/react-three-fiber/issues/114
        <MusicPlayerContext.Consumer>
            {
                value => (
                    <Canvas
                        id="canvas"
                        onCreated={({ gl }) => {
                            gl.shadowMap.enabled = true;
                            gl.gammaInput = true;
                            gl.gammaOutput = true;
                        }}
                    >
                        <MusicPlayerContext.Provider value={value}>
                            <Scene />
                        </MusicPlayerContext.Provider>
                    </Canvas>
                )}
        </MusicPlayerContext.Consumer>
    )
}

