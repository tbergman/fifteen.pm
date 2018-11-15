import * as THREE from "three";

export const CONSTANTS = {
  purbaShootTimes: [
    2
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
