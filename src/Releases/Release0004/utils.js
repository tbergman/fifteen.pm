import * as THREE from "three";
import {assetPath} from "../../Utils/assets";

export const randomChoice = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
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
  return new THREE.SphereBufferGeometry(x, x, x);
};
