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
    <LiveStreamScreen src={LIVESTREAM_URL} sizeX={16} sizeY={9} position={[0, 4, -10]} play={hasEnteredWorld} />
    <Controls enableDamping rotateSpeed={0.3} dampingFactor={0.1} />
    <Stars count={1000} radius={2} colors={[0xffffff, 0xfffff0, 0xf9f1f1]} />
    <TrackLight intensity={0.1} size={1} position={[0,2,-5]} />
    {/* <TrackLight intensity={.05} size={.1} position={[0,2.5,-5]} color={"red"} /> */}
    <MaterialsProvider>
      <Suspense fallback={null}>
        <Hall />
      </Suspense>
    </MaterialsProvider>
  </>)
}