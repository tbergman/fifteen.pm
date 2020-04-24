import React, { useRef, useMemo } from "react";
import { extend, useFrame, useThree } from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

extend({ OrbitControls});

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
      enableKeys={true}
      minPolarAngle={Math.PI / 2.1}
      maxPolarAngle={ Math.PI /2.5}
      keyPanSpeed={21.0}
      {...props}
    />
  );
}
