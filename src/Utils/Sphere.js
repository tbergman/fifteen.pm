import * as THREE from "three";

let ballPosition = new THREE.Vector3( 0, - 45, 0 );
let ballSize = 60; //40

let ballGeo = new THREE.SphereBufferGeometry( ballSize, 32, 16 );
let ballMaterial = new THREE.MeshLambertMaterial({
  // color: 0xaa2929,
  specular: 0x030303,
  wireframeLinewidth: 10,
  //map: clothTexture,
  side: THREE.DoubleSide,
  alphaTest: 0.5,
  transparent: true,
  wireframe: true,
});

let sphere = new THREE.Mesh( ballGeo, ballMaterial );
sphere.castShadow = true;
sphere.receiveShadow = true;
sphere.visible;

export { ballPosition, ballSize, sphere };