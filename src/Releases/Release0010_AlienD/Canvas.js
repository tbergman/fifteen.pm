import React, { useRef } from 'react'
import { Canvas, extend, useThree, useRender } from 'react-three-fiber'
import { MusicPlayerContext } from '../../UI/Player/MusicPlayerContext';
import { Scene } from './Scene';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

extend({ OrbitControls })

const Controls = props => {
  const { camera } = useThree()
  const controls = useRef()
  useRender(() => controls.current && controls.current.update())
  return <orbitControls ref={controls} args={[camera]} {...props} />
}

export default function AlienDCanvas({ }) {
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
                        camera={{ position: [0, 0, 300] }}
                    >
                        <MusicPlayerContext.Provider value={value}>
                            <Scene />
                        </MusicPlayerContext.Provider>
                        <Controls/>
                    </Canvas>
                )}
        </MusicPlayerContext.Consumer>
    )
}

