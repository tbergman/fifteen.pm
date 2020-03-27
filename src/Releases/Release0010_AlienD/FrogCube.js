import * as THREE from "three";
import React, { useEffect, useRef, useContext, useMemo } from "react";
import { useLoader, useFrame, useThree } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import * as C from "./constants";
import {copy, choose, genSoundOffsets} from "./utils"


export default function FrogCube(props) {
  // Setup

  const { camera, mouse } = useThree();
  let {
    amount = 2,
    bpm,
    scale = 1.42,
    xOffset = 63,
    yOffset = 63,
    zOffset = 63,
    xFactor = 102,
    yFactor = 102,
    zFactor = 102,
    position = [-601, 666, -110],
  } = props;

  // load in assets

  const gltf = useLoader(GLTFLoader, C.FROG_OBJECT_URL, loader => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco-gltf/");
    loader.setDRACOLoader(dracoLoader);
  });

  const frogSounds = useMemo(() => {
    if (!camera) {
      return;
    }
    // Audio
    const listener = new THREE.AudioListener();
    camera.add(listener);
    const sound = new THREE.PositionalAudio(listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(C.FROG_SOUNDS_URL, buffer => {
      sound.setBuffer(buffer); 
      sound.setRefDistance(C.FROG_SOUNDS_ROLLOFF_MIN_DISTANCE)
      sound.setMaxDistance(C.FROG_SOUNDS_ROLLOFF_MAX_DISTANCE);
      sound.setRolloffFactor(C.FROG_SOUNDS_ROLLOFF_FACTOR)
    });
    return sound;
  }, [camera]);

  const soundOffsets = useMemo(() => {
    if (!bpm) {
      return;
    }
    return genSoundOffsets(C.FROG_SOUNDS_NUM_SAMPLES, C.FROG_SOUNDS_BARS_PER_SAMPLE, bpm);
  }, [bpm]);

  // configure the frogObjetry
  const frogMesh = useMemo(() => {
    if (!gltf || !scale) {
      return;
    }
    let frogMesh;
    gltf.scene.traverse(child => {
      if (child.isMesh) {
        frogMesh = child;
        frogMesh.geometry.scale(scale, scale, scale);
        frogMesh.geometry.toNonIndexed();
        frogMesh.geometry.computeVertexNormals();
        frogMesh.geometry.computeBoundingBox();
      }
    });
    return frogMesh;
  }, [gltf, scale]);

  // configure the InstancedMesh
  const frogCubeMesh = useMemo(() => {
    if (!frogMesh) {
      return;
    }
    let mesh = new THREE.InstancedMesh(frogMesh.geometry, frogMesh.material, Math.pow(amount, 3));

    // position instanced froggies in a cube
    let i = 0;
    let offset = (amount - 1) / 4;
    let transform = new THREE.Object3D();
    for (let x = 0; x < amount; x++) {
      for (let y = 0; y < amount; y++) {
        for (let z = 0; z < amount; z++) {
          transform.position.set(
            offset - (x * xFactor) + xOffset,
            offset - (y * yFactor) + yOffset,
            offset - (z * zFactor) + zOffset
          );
          transform.updateMatrix();
          mesh.setMatrixAt(i++, transform.matrix);
        }
      }
    }
    frogMesh.rotation.x = THREE.Math.degToRad(180);
    return mesh;
  }, [frogMesh, amount]);

  // Sound Interactions

  let matrix = new THREE.Matrix4();
  let raycaster = new THREE.Raycaster();
  let rotationMatrixY = new THREE.Matrix4().makeRotationY(720);
  let rotationMatrixZ = new THREE.Matrix4().makeRotationZ(90);
  let rotationMatrixX = new THREE.Matrix4().makeRotationX(130);
  let rotationMatrices = [rotationMatrixX, rotationMatrixY, rotationMatrixZ];
  let instanceMatrix = new THREE.Matrix4();
  let lastInstanceId = undefined;

  useFrame(() => {
    if (frogCubeMesh) {
      if (soundOffsets && frogSounds) {
        raycaster.setFromCamera(mouse, camera);
        let intersections = raycaster.intersectObject(frogCubeMesh);
        if (intersections.length > 0) {
          // NOTE: animating and playing a sound for every intersection can be too much!
          // intersections.forEach(ix => {
          // let instanceId = ix.instanceId;
          let instanceId = intersections[0].instanceId;
          // only play the sound if you've hit a new frog from the last one.
          if (instanceId !== lastInstanceId) {
            frogCubeMesh.getMatrixAt(instanceId, instanceMatrix);
            let rotationMatrix = choose(rotationMatrices);
            matrix.multiplyMatrices(instanceMatrix, rotationMatrix);
            frogCubeMesh.setMatrixAt(instanceId, matrix);
            frogCubeMesh.instanceMatrix.needsUpdate = true;
            if (frogSounds.source !== undefined) {
              frogSounds.stop();
            }
            // choose a random sound / note / level
            frogSounds.detune = choose(C.FROG_SOUNDS_NOTES);
            let soundOffset = choose(soundOffsets);
            if (soundOffset[0] !== Infinity) {
              frogSounds.offset = soundOffset[0];
              frogSounds.duration = soundOffset[1];
            }
            frogSounds.play();
          }
          lastInstanceId = copy(instanceId);
        }
      }
    }
  });

  // Cube Rotation + Movement

  useFrame(() => {
    if (frogCubeMesh) {
      var time = Date.now() * 0.001;
      frogCubeMesh.rotation.x = -1.0 * Math.sin(time / 4);
      // frogCubeMesh.rotation.y = Math.sin(time / 2);
      frogCubeMesh.rotation.z = Math.sin(time / 3);
      frogCubeMesh.instanceMatrix.needsUpdate = true;
    }
  });

  const group = useRef();
  return (
    <group ref={group} {...props}>
      <primitive name="Frogs" object={frogCubeMesh} position={position} />
    </group>
  );
};
