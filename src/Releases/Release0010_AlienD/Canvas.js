import React, { useRef } from "react";
import * as THREE from "three";
import { Canvas, extend, useThree, useEffect, useFrame } from "react-three-fiber";
import { AudioPlayerContext } from "../../Common/UI/Player/AudioPlayerContext";
import { Scene } from "./Scene";
import { Controls } from "./controls";


export default function AlienDCanvas({}) {

  // setup camera to pass to canvas
  let camera =  new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 2, 21000 );
  return (
    <AudioPlayerContext.Consumer>
      {value => (
        <Canvas id="canvas" camera={camera}>
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
