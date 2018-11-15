import * as THREE from "three";

export const CONSTANTS = {
  cameraStartPos: new THREE.Vector3(-12.5, -8, -30),
  frameRate: 25,
  purbaShootTimes: [
    2,
    20,
    23,
    29,
    32,
    35,
    44,
    47,
    108,
    71,
    105,
    110,
    114,
    116,
    135
  ],
  phurbaCombos: [
    {
      start: new THREE.Vector3(-1000, -1000, -1000),
      end: new THREE.Vector3(1000, 1000, 1000),
    },
    {
      start: new THREE.Vector3(-1000, -1000, 1000),
      end: new THREE.Vector3(1000, 1000, -1000),
    },
    {
      start: new THREE.Vector3(-1000, 1000, 1000),
      end: new THREE.Vector3(1000, -1000, -1000),
    },
    {
      start: new THREE.Vector3(1000, 1000, 1000),
      end: new THREE.Vector3(-1000, -1000, -1000),
    },
    {
      start: new THREE.Vector3(1000, -1000, 1000),
      end: new THREE.Vector3(-1000, 1000, -1000),
    }
  ]
}
