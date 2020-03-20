import React, { Suspense, useRef, useResource, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, extend, useFrame } from 'react-three-fiber';
import "../../UI/Player/Player.css";
import "../Room.css";
import { MaterialsProvider } from './MaterialsContext';
import Stars from '../../Utils/Stars';
import Hall from './Hall';
import LiveStreamScreen from './LiveStreamScreen'
import { LIVESTREAM_URL } from './constants'
import TrackLight from '../../Utils/Lights/TrackLight'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
extend({ OrbitControls })

const Controls = props => {
  const { camera, gl } = useThree()
  const controls = useRef()
  useFrame(() => controls.current && controls.current.update())
  return <orbitControls ref={controls} args={[camera, gl.domElement]} {...props} />
}

export default function Scene({ content, hasEnteredWorld, ...props }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!camera) return;
    // TODO random spawn camera pos

  }, [camera])


  return (<>
    <LiveStreamScreen src={LIVESTREAM_URL} sizeX={32} sizeY={18} position={[0, 15, 0]} play={hasEnteredWorld} />
    <Controls enableDamping rotateSpeed={0.3} dampingFactor={0.1} />
    <Stars count={1000} radius={2} colors={[0xffffff, 0xfffff0, 0xf9f1f1]} />
    <TrackLight intensity={.25} size={1} position={[0, 8, -5]} start={[0, 40, 100]} end={[0, 40, -100]} />
    <TrackLight intensity={.75} position={[0, 8, -5]} start={[0, 30, 100]} end={[0, 30, -100]} />
    <MaterialsProvider>
      <Suspense fallback={null}>
        <Hall />
      </Suspense>
    </MaterialsProvider>
  </>)
}