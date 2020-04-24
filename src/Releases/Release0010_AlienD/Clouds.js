import * as THREE from "three";
import React, { useMemo, useRef } from "react";
import { loadImage } from "../../Common/Utils/LegacyLoaders";
import { assetPathJV } from "./utils";
import { useFrame } from "react-three-fiber";

export default function Clouds(props) {
  let {
    size = 18000,
    rotationAxis = new THREE.Vector3(0, -1, 0),
    rotationRad = 0.00075,
    rotationRadIncr = 0.00001,
    transparent = true,
    opacity = 0.05,
    position = [0, 0, 0],
  } = props;
  const clouds = useRef();
  const cloudsMesh = useMemo(() => {
    return loadImage({
      geometry: new THREE.SphereBufferGeometry(size, 32, 32),
      url: assetPathJV("images/background-okeefe-edited-long.jpg"),
      name: "Clouds",
      position: position,
      invert: true,
      rotateY: 180,
      transparent: transparent,
      opacity: opacity
    });
  });

  useFrame(() => {
    if (clouds.current) {
      clouds.current.rotateOnAxis(rotationAxis, rotationRad);
    }
  });

  return clouds && <primitive ref={clouds} name="Clouds" object={cloudsMesh} />;
}
