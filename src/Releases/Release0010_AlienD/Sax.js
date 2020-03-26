import * as THREE from "three";
import React, {useMemo } from "react";
import { useLoader, useFrame, useThree } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as C from "./constants";
import {choose, genSoundOffsets} from "./utils"

export default function Sax(props) {
  const { scale = 10, position=[0,1000,-110], bpm, rotation=[] } = props;
  const { camera, mouse, clock } = useThree();
  let raycaster = new THREE.Raycaster();

  // load in the saxophone

  const gltf = useLoader(GLTFLoader, C.SAX_OBJECT_URL);
  const mesh = useMemo(() => {
    if (!gltf) {
      return;
    }
    let mesh;
    gltf.scene.traverse(child => {
      if (child.isMesh) {
        mesh = child;
        mesh.geometry.scale(scale, scale, scale);
        mesh.geometry.toNonIndexed();
        mesh.geometry.computeVertexNormals();
      }
    });
    mesh.position.set(...position)
    mesh.rotation.y = Math.PI / 2
    mesh.rotation.z = -0.05
    return mesh;
  }, [gltf]);

  const saxSounds = useMemo(() => {
    if (!camera) {
      return;
    }
    // Audio
    const listener = new THREE.AudioListener();
    camera.add(listener);

    const sound = new THREE.PositionalAudio(listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(C.SAX_SOUNDS_URL, buffer => {
      sound.setBuffer(buffer);
      sound.setRefDistance(C.SAX_SOUNDS_ROLLOFF_MIN_DISTANCE);
      sound.setMaxDistance(C.SAX_SOUNDS_ROLLOFF_MAX_DISTANCE);
      sound.setRolloffFactor(C.SAX_SOUNDS_ROLLOFF_FACTOR);
    });
    return sound;
  }, [camera]);

  const soundOffsets = useMemo(() => {
    if (!bpm) {
      return;
    }
    return genSoundOffsets(C.SAX_SOUNDS_NUM_SAMPLES, C.SAX_SOUNDS_BARS_PER_SAMPLE, bpm);
  }, [bpm]);

  let startCycle = clock.getElapsedTime();

  // Sound Animation
  useFrame(() => {
    if (mesh && saxSounds) {
      let now = clock.getElapsedTime();
      let timeDiff = now - startCycle;
      if (soundOffsets && saxSounds && saxSounds.source !== undefined) {
        raycaster.setFromCamera(mouse, camera);
        let intersections = raycaster.intersectObject(mesh);
        if (intersections.length > 0) {
          if (timeDiff >= C.SAX_SOUNDS_DEBOUNCE) {
            saxSounds.stop();
            let soundOffset = choose(soundOffsets);
            if (soundOffset[0] !== Infinity) {
              saxSounds.offset = soundOffset[0];
              saxSounds.duration = soundOffset[1];
            }
            console.log('HERE!')
            saxSounds.play();
            startCycle = clock.getElapsedTime();
          }
        }
      }
    }
  });

  return <primitive name="Sax" object={mesh}  />;
}
