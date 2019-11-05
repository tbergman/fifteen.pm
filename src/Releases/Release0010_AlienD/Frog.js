import React, { useRef, Suspense } from 'react';
import { useFrame, useLoader } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import * as C from './constants';

export default function Frog() {
    const gltf = useLoader(GLTFLoader, C.FROG_URL, loader => {
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco-gltf/')
        loader.setDRACOLoader(dracoLoader)
      })
    console.log(gltf.scene);
    return <primitive object={gltf.scene} position={[0, 0, 0]}/>
  }