import * as THREE from "three";

const rotateObject = (object, rotateX=0, rotateY=0, rotateZ=0) => {

   rotateX = (rotateX * Math.PI)/180;
   rotateY = (rotateY * Math.PI)/180;
   rotateZ = (rotateZ * Math.PI)/180;

   object.rotateX(rotateX);
   object.rotateY(rotateY);
   object.rotateZ(rotateZ);

}


//  initialize an object of type 'image'
export const loadImage = ({ geometry, url, name, invert, position, transparent, opacity, rotateX, rotateY, rotateZ }) => {

  // create material from image texture
  let texture = new THREE.TextureLoader().load(url);
  texture.minFilter = THREE.LinearFilter;
  texture.format = THREE.RGBFormat;
  let material = new THREE.MeshBasicMaterial({map: texture, transparent: transparent, opacity: opacity});

  // create mesh from material and geometry
  let imageMesh = new THREE.Mesh(geometry, material);
  // configure geometry
  if (invert) {
    geometry.scale(-1, 1, 1);
  }
  imageMesh.position.set(...position);
  imageMesh.name = name;
  rotateObject(imageMesh, rotateX, rotateY, rotateZ);
  return imageMesh;
}

//  initialize an object of type 'video'
export const loadVideo = ({
    geometry, url, name, position, loop,
    muted, mimetype, invert, volume, sources,
    computeBoundingSphere, playbackRate,
    rotateX, rotateY, rotateZ  }) => {
  // initialize video element
  let videoElement = document.createElement('video');
  videoElement.crossOrigin = 'anonymous';
  videoElement.loop = loop;
  videoElement.muted = muted;
  videoElement.volume = volume;
  videoElement.playbackRate = playbackRate;
  for (let i = 0; i < sources.length; i++) {
    /* First source element creation */
    let src = document.createElement("source");
    // Attribute settings for my first source
    src.setAttribute("src", sources[i].src);
    src.setAttribute("type", sources[i].type);
    videoElement.appendChild(src);
  }
  document.body.appendChild(videoElement);

  // create material from video texture
  let texture = new THREE.VideoTexture(videoElement);
  texture.minFilter = THREE.LinearFilter;
  texture.format = THREE.RGBFormat;
  let material = new THREE.MeshBasicMaterial({map: texture});
  // create mesh from material and geometry
  let videoMesh = new THREE.Mesh(geometry, material);
  videoMesh.renderOrder = 1;
  // configure geometry
  if (invert) {
    geometry.scale(-1, 1, 1);
  }
  if (computeBoundingSphere) {
    geometry.computeBoundingSphere();
  }
  // set position
  videoMesh.position.set(...position);
  videoMesh.name = name;
  videoMesh.userData.video = videoElement;
  // rotate
  rotateObject(videoMesh, rotateX, rotateY, rotateZ);
  return videoMesh;
}

// initialize an object of type 'gltf', with callbacks for success + errors
export const loadGLTF = ({url, name, relativeScale, position, rotateX, rotateY, rotateZ, pivotPoint, loader, onSuccess, onError}) => {
  loader.load(url, object => {
    object.scene.scale.multiplyScalar(relativeScale);
    object.scene.position.set(...position);
    let child = object.scene.children[0];
    // floaterChild.geometry.computeBoundingBox();
    child.position.set(0, 0, 0);
    object.scene.position.set(...position);
    object.name = name;
    rotateObject(object.scene, rotateX, rotateY, rotateZ);
    onSuccess(object);
  }, onError);
}

export const loadOBJ = ({url, name, relativeScale, position, rotateX, rotateY, rotateZ, pivotPoint, loader, onSuccess, onError}) => {
  loader.load(url, object => {
    object.scale.multiplyScalar(relativeScale);
    object.position.set(...position);
    object.name = name;
    rotateObject(object, rotateX, rotateY, rotateZ);
    onSuccess(object);
  }, onError);
}
