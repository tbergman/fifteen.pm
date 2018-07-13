import * as THREE from "three";

let ballPosition = new THREE.Vector3( 0, - 45, 0 );
let ballSize = 60; //40


let ballGeo = new THREE.SphereBufferGeometry( ballSize, 32, 16 );
let ballMaterial = new THREE.MeshLambertMaterial();

let sphere = new THREE.Mesh( ballGeo, ballMaterial );
sphere.castShadow = true;
sphere.receiveShadow = true;

export { ballPosition, ballSize, sphere };