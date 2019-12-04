import React, { useEffect, useState, Suspense } from "react";
import { FixedLights } from "./lights";
import { useThree } from "react-three-fiber";
import Frog from "./frog";
import Frog2 from "./Frog2";
import { MaterialsProvider } from "./MaterialsContext";

export function Scene({}) {
  const { scene, camera } = useThree();

  useEffect(() => {
    // camera.position.set([0, 0, 0]);
  });

  return (
    <>
      <MaterialsProvider>
        <FixedLights />
        <ambientLight color={0xffffff} intensity={1.0} />
        <Suspense fallback={null}>
          {/* <Frog /> */}
          <Frog2 />
        </Suspense>
      </MaterialsProvider>
    </>
  );
}
