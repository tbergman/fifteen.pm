import * as THREE from "three";
import GLTFLoader from 'three-gltf-loader';

//  initialize an object of type 'image'
export const loadImage = ({ geometry, url, position }) => {

  // create material from image texture
  let texture = new THREE.TextureLoader().load(url);
  texture.minFilter = THREE.LinearFilter;
  texture.format = THREE.RGBFormat;
  let material = new THREE.MeshBasicMaterial({map: texture});

  // create mesh from material and geometry
  let imageMesh = new THREE.Mesh(geometry, material);
  imageMesh.position.set(...position);
  return imageMesh;
}

//  initialize an object of type 'video'
export const loadVideo = ({ geometry, url, position, loop, muted, playbackRate }) => {
  // initialize video element
  let videoElement = document.createElement('video');
  videoElement.src = url;
  videoElement.crossOrigin = 'anonymous';
  videoElement.loop = loop;
  videoElement.muted = muted;
  videoElement.playbackRate = playbackRate;

  // create material from video texture
  let texture = new THREE.VideoTexture(videoElement);
  texture.minFilter = THREE.LinearFilter;
  texture.format = THREE.RGBFormat;
  let material = new THREE.MeshBasicMaterial({map: texture});
  // create mesh from material and geometry
  let videoMesh = new THREE.Mesh(geometry, material);
  videoMesh.renderOrder = 1;
  // configure geometry
  geometry.scale(-1, 1, 1);
  // set position
  videoMesh.position.set(...position);
  return videoMesh;
}

// initialize an object of type 'gltf', with callbacks for success + errors
export const loadGLTF = ({url, relativeScale, position, rotateX, onSuccess, onError}) => {
  const loader = new GLTFLoader();
  loader.load(url, object => {
    object.scene.scale.multiplyScalar(relativeScale);
    object.scene.position.set(...position);
    let child = object.scene.children[0];
    // floaterChild.geometry.computeBoundingBox();
    child.position.set(0, 0, 0);
    object.scene.position.set(...position);
    onSuccess(object.scene);
  }, onError);
}