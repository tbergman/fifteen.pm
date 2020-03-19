import React, { Suspense, useRef, useResource } from "react";
import * as THREE from "three";
import Hls from 'hls.js';

export default function LiveStreamScreen({ src, size, position, play }) {

  // Create video element
  let video = document.createElement("video");
  document.body.appendChild(video);

  // Add support for HLS stream 

  if(Hls.isSupported()) {
    const hls = new Hls({debug:true});
    hls.loadSource(src);
    console.log(src);
    hls.attachMedia(video);
    // play video
    if (play) {
      video.play();
    }
 }
 // hls.js is not supported on platforms that do not have Media Source Extensions (MSE) enabled.
 // When the browser has built-in HLS support (check using `canPlayType`), we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video element throught the `src` property.
 // This is using the built-in support of the plain video element, without using hls.js.
  else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = src;
    video.addEventListener('canplay', function() {
      if(play) {
        video.play();
      }
    });
  }

  // create material from video texture
  let texture = new THREE.VideoTexture(video);
  texture.minFilter = THREE.LinearFilter;
  texture.format = THREE.RGBFormat;
  let material = new THREE.MeshBasicMaterial({ map: texture });
  let geometry = new THREE.PlaneBufferGeometry(size, size);

  return (
    <mesh material={material}>
      <bufferGeometry attach="geometry" {...geometry} position={position} />
    </mesh>
  );
}
