import React, { useEffect, useState, Suspense } from "react";
import { FixedLights } from "./lights";
import { useThree } from "react-three-fiber";
import Frog from "./frog";

export function Scene({}) {
  const { scene, camera } = useThree();

  useEffect(() => {
    // camera.position.set([0, 0, 0]);
  });

  return (
    <>
      <FixedLights />
      <Suspense fallback={null}>
        <Frog />
      </Suspense>
    </>
  );
}
