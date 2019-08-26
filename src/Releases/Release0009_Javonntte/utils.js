import * as THREE from 'three';
import { assetPath } from "../../Utils/assets"

export const assetPath9 = (p) => {
  return assetPath("9/" + p);
}

export const randVal = (obj) => {
  const keys = Object.keys(obj);
  const numKeys = keys.length;
  const randIdx = THREE.Math.randInt(0, numKeys - 1);
  return obj[keys[randIdx]];
}