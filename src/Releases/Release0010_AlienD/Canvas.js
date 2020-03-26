import React, { useRef } from "react";
import { Canvas, extend, useThree, useEffect } from "react-three-fiber";
import { AudioPlayerContext } from "../../Common/UI/Player/AudioPlayerContext";
import { Scene } from "./Scene";
import { Controls } from "./controls";

export default function AlienDCanvas({}) {
  return (
    // Unfortunately some gymnastics required here to pass music player context through canvas.
    // There's more than one way to solve this and some room for clean-up but this does the job.
    // https://github.com/konvajs/react-konva/issues/188#issuecomment-478302062
    // https://github.com/react-spring/react-three-fiber/issues/114
    <AudioPlayerContext.Consumer>
      {value => (
        <Canvas id="canvas" camera={{ position: [0, 0, -50] }}>
          <ambientLight intensity={0.5} />
          <spotLight intensity={0.8} position={[300, 300, 400]} />
          <AudioPlayerContext.Provider value={value}>
            <Scene />
          </AudioPlayerContext.Provider>
          <Controls />
        </Canvas>
      )}
    </AudioPlayerContext.Consumer>
  );
}
