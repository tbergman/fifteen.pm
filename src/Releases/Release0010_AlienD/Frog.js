import * as THREE from "three";
import React, { useEffect, useRef, useContext } from "react";
import { useLoader, useFrame } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { MaterialsContext } from './MaterialsContext';
import * as C from "./constants";

export default function Frog2(props) {
  const group = useRef();
  const gltf = useLoader(GLTFLoader, C.FROG_URL, loader => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco-gltf/");
    loader.setDRACOLoader(dracoLoader);
  });
  const { foamGripPurple } = useContext(MaterialsContext);
  return (
    <group ref={group} {...props}>
      <mesh name="Frog" material={foamGripPurple}>
        <bufferGeometry attach="geometry" {...gltf.__$[31].geometry} />
      </mesh>
    </group>
  );
}
