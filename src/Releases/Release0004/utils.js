import * as THREE from "three";
import {assetPath} from "../../Utils/assets";

export const randomChoice = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const assetPath4 = (p) => {
  return assetPath("4/" + p);
}

export const assetPath4Videos = (p) => {
  return assetPath4("videos/" + p);
}

export const assetPath4Objects = (p) => {
  return assetPath4("objects/" + p);
}

export const assetPath4Images = (p) => {
  return assetPath4("images/" + p);
}

export const makeSphere = (x) => {
  return new THREE.SphereBufferGeometry(x, 32, 32);
};

export const multiSourceVideo = (path) => ([
  { type:'video/mp4', src: assetPath4Videos(`${path}.mp4`) },
  { type:'video/webm', src: assetPath4Videos(`${path}.webm`) }
]);

const firstPersonControlKeys = [37, 38, 39, 40];

export const keyPressIsFirstPersonControls = (keycode) => {
  return firstPersonControlKeys.includes(keycode)
}