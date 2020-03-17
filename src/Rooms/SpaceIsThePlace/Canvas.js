import React from 'react';
import '../Room.css';
import Scene from './Scene';
import { Canvas } from 'react-three-fiber';

export default function SpaceIsThePlaceCanvas(content) {
  return (
    <Canvas
      id="canvas"
      pixelRatio={window.devicePixelRatio}
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = true;
        gl.gammaInput = true;
        gl.gammaOutput = true;
        gl.antialias = true;
      }}
    >
      <Scene content={content} />
    </Canvas>
  )
}