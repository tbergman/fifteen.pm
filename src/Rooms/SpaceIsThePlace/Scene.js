import React, { Suspense, useRef, useResource, } from 'react';
import { useThree, extend, useFrame } from 'react-three-fiber';
import "../../UI/Player/Player.css";
import "../Room.css";
import { MaterialsProvider } from './MaterialsContext';
import Stars from '../../Utils/Stars';
import Hall from './Hall';
import LiveStreamScreen from './LiveStreamScreen'
import { LIVESTREAM_URL } from './constants'
import TrackLight from './TrackLight'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
extend({ OrbitControls })

const Controls = props => {
  const { camera, gl } = useThree()
  const controls = useRef()
  useFrame(() => controls.current && controls.current.update())
  return <orbitControls ref={controls} args={[camera, gl.domElement]} {...props} />
}

export default function Scene({ content, hasEnteredWorld, ...props }) {

  return (<>
    <LiveStreamScreen src={LIVESTREAM_URL} size={1} position={[0, 0, 0]} play={hasEnteredWorld} />
    <Controls enableDamping rotateSpeed={0.3} dampingFactor={0.1} />
    <Stars radius={2} colors={[0xffffff, 0xfffff0, 0xf9f1f1]} />
    <ambientLight />
    <pointLight position={[10, 10, 10]} />
    <TrackLight position={[0,1,0]} />
    <MaterialsProvider>
      <Suspense fallback={null}>
        <Hall />
      </Suspense>
    </MaterialsProvider>
  </>)
}