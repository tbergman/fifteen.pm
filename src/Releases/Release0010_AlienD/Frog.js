import * as THREE from "three";
import React, { useEffect, useRef, useContext, useMemo } from "react";
import { useLoader, useFrame, useThree } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { MaterialsContext } from "./MaterialsContext";
import * as C from "./constants";
import {copy, choose, calcSoundOffsetUnit} from "./utils"


export default function Frog(props) {
  // Setup

  const { camera, mouse } = useThree();
  const { foamGripSilver } = useContext(MaterialsContext);
  let {
    amount = 10,
    currentTrackName,
    bpm,
    scale = 0.08,
    xOffset = 0.75,
    yOffset = -0.66,
    zOffset = 0.5
  } = props;
  const count = Math.pow(amount, 3);

  // load in assets

  const gltf = useLoader(GLTFLoader, C.FROG_URL, loader => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco-gltf/");
    loader.setDRACOLoader(dracoLoader);
  });

  const sound = useMemo(() => {
    if (!camera || !currentTrackName) {
      return;
    }
    // Audio
    const listener = new THREE.AudioListener();
    camera.add(listener);

    const sound = new THREE.PositionalAudio(listener);
    const audioLoader = new THREE.AudioLoader();
    let soundUrl = C.SOUND_URLS_BY_TRACK_NAME[currentTrackName];
    console.log('GOT SOUND URL', soundUrl, "For", currentTrackName);
    audioLoader.load(soundUrl, buffer => {
      sound.setBuffer(buffer);
      sound.minDistance = C.ROLLOFF_MIN_DISTANCE;
      sound.maxDistance = C.ROLLOFF_MAX_DISTANCE;
      sound.rolloffFactor = C.ROLLOFF_FACTOR;
    });
    return sound;
  }, [camera, currentTrackName]);

  const soundOffsets = useMemo(() => {
    if (!bpm) {
      return;
    }
    let offsets = [];
    let soundOffsetUnit = calcSoundOffsetUnit(bpm);
    for (var i = 1; i < C.SOUND_SPRITE_NUMBER; i++) {
      offsets.push([soundOffsetUnit * i, soundOffsetUnit]);
    }
    return offsets;
  }, [bpm]);

  // configure the geometry
  const geom = useMemo(() => {
    if (!gltf || !scale) {
      return;
    }
    let geom;
    gltf.scene.traverse(child => {
      if (child.isMesh) {
        geom = child.geometry;
        geom.scale(scale, scale, scale);
        geom.toNonIndexed();
        geom.computeVertexNormals();
        geom.computeBoundingBox();
      }
    });
    return geom;
  }, [gltf, scale]);

  // configure the InstancedMesh
  const mesh = useMemo(() => {
    if (!geom) {
      return;
    }
    let mesh = new THREE.InstancedMesh(geom, foamGripSilver, count);

    // position instanced froggies in a cube
    let i = 0;
    let offset = (amount - 1) / 4;
    let transform = new THREE.Object3D();
    for (let x = 0; x < amount; x++) {
      for (let y = 0; y < amount; y++) {
        for (let z = 0; z < amount; z++) {
          transform.position.set(
            offset - x + xOffset,
            offset - y + yOffset,
            offset - z + zOffset
          );
          transform.updateMatrix();
          mesh.setMatrixAt(i++, transform.matrix);
        }
      }
    }
    return mesh;
  }, [geom]);

  // Sound Interactions

  let matrix = new THREE.Matrix4();
  let raycaster = new THREE.Raycaster();
  let rotationMatrix = new THREE.Matrix4().makeRotationY(21);
  let instanceMatrix = new THREE.Matrix4();
  let lastInstanceId = undefined;

  useFrame(() => {
    if (mesh) {
      if (soundOffsets && sound) {
        raycaster.setFromCamera(mouse, camera);
        let intersections = raycaster.intersectObject(mesh);
        if (intersections.length > 0) {
          // NOTE: animating and playing a sound for every intersection can be too much!
          // intersections.forEach(ix => {
          // let instanceId = ix.instanceId;
          let instanceId = intersections[0].instanceId;
          // only play the sound if you've hit a new frog from the last one.
          if (instanceId !== lastInstanceId) {
            mesh.getMatrixAt(instanceId, instanceMatrix);
            matrix.multiplyMatrices(instanceMatrix, rotationMatrix);
            mesh.setMatrixAt(instanceId, matrix);
            mesh.instanceMatrix.needsUpdate = true;
            if (sound.source !== undefined) {
              sound.stop();
            }
            sound.detune = choose(C.TUNES);
            sound.volume = choose(C.VOLUMES);
            let soundOffset = choose(soundOffsets);
            if (soundOffset[0] !== Infinity) {
              sound.offset = soundOffset[0];
              sound.duration = soundOffset[1];
            }
            sound.play();
          }
          lastInstanceId = copy(instanceId);
        }
      }
    }
  });

  // Cube Rotation + Movement

  useFrame(() => {
    if (mesh) {
      var time = Date.now() * 0.001;
      mesh.rotation.x = Math.sin(time / 4);
      mesh.rotation.y = Math.sin(time / 2);
      mesh.rotation.z = Math.sin(time / 3);
      mesh.instanceMatrix.needsUpdate = true;
    }
  });

  const group = useRef();
  return (
    <group ref={group} {...props}>
      <primitive name="Frogs" object={mesh} />
    </group>
  );
}
