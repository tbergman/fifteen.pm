import * as THREE from "three";

export const CONSTANTS = {
  // Get window dimension
  ww: document.documentElement.clientWidth || document.body.clientWidth,
  wh: window.innerHeight,
  pxr: window.devicePixelRatio,
  hourglassAxis: new THREE.Vector3(0, 0, 1)
}