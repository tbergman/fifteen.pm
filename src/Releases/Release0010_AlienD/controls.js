import React, { useRef } from "react";
import { extend, useFrame, useThree } from "react-three-fiber";
import { FlyControls } from "three/examples/jsm/controls/FlyControls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { isMobile } from "../../Common/Utils/BrowserDetection";

extend({ OrbitControls, FlyControls });

export function Controls({ curCamera, ...props }) {
  curCamera = curCamera || useThree().camera;
  const controls = useRef();
  const { gl } = useThree();
  const delta = 0.001;
  useFrame(() => {
    controls.current && controls.current.update(delta);
  });
  return (
    <orbitControls
      ref={controls}
      args={[curCamera, gl.domElement]}
      enableKeys={false}
      enableZoom={true}
      {...props}
    />
  );
}
