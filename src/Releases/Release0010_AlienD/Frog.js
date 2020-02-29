import * as THREE from "three";
import React, { useEffect, useRef, useContext, useMemo } from "react";
import { useLoader, useFrame, useThree } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { MaterialsContext } from "./MaterialsContext";
import * as C from "./constants";

const choose = choices => {
  return choices[Math.floor(Math.random() * choices.length)];
};

const copy = x => {
  return JSON.parse(JSON.stringify(x));
};
const TUNES = [-500, -300, 300, 700, -1200, 900];

const VOLUMES = [
  0.11,
  0.12,
  0.13,
  0.14,
  0.15,
  0.16,
  0.17,
  0.18,
  0.19,
  0.2,
  0.21,
  0.22,
  0.27,
  0.33,
  0.39
];

const BEAT_DELAYS = [0.5, 1, 1.5, 2];
let sound_sprite_offset_unit = 1.0;

export default function Frog(props) {
  const { camera, mouse } = useThree();
  const { scale = 0.08} = props;
  const gltf = useLoader(GLTFLoader, C.FROG_URL, loader => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco-gltf/");
    loader.setDRACOLoader(dracoLoader);
  });

  // Audio
  const listener = new THREE.AudioListener();
  camera.add(listener);

  const sound = new THREE.PositionalAudio(listener);
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load(C.SOUNDS_URL, buffer => {
    console.log(C.SOUNDS_URL);
    sound.setBuffer(buffer);
    sound.minDistance = C.ROLLOFF_MIN_DISTANCE;
    sound.maxDistance = C.ROLLOFF_MAX_DISTANCE;
    sound.rolloffFactor = C.ROLLOFF_FACTOR;
  });

  const { foamGripSilver } = useContext(MaterialsContext);

  let { amount = 10, freqArray, audioStream, bpm } = props;
  const count = Math.pow(amount, 3);

  const sound_offsets = useMemo(() => {
    if (!bpm) {
      return;
    }
    let sound_sprite_offset_unit = 60.0 / (bpm / 16.0);
    console.log("OFFSET UNIT", sound_sprite_offset_unit);
    let _offsets = [];
    for (var i = 1; i < C.SOUND_SPRITE_NUMBER; i++) {
      _offsets.push([sound_sprite_offset_unit * i, sound_sprite_offset_unit]);
    }
    return _offsets;
  }, [bpm]);

  const mesh = useMemo(() => {
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
    let mesh = new THREE.InstancedMesh(geom, foamGripSilver, count);

    // position instanced froggies in a cube
    let i = 0;
    let offset = (amount - 1) / 4;
    let transform = new THREE.Object3D();
    for (let x = 0; x < amount; x++) {
      for (let y = 0; y < amount; y++) {
        for (let z = 0; z < amount; z++) {
          transform.position.set(offset - x + 0.75, offset - y -0.5, offset - z + 0.66);
          transform.updateMatrix();
          mesh.setMatrixAt(i++, transform.matrix);
        }
      }
    }
    return mesh;
  }, [gltf, scale]);

  let matrix = new THREE.Matrix4();
  let raycaster = new THREE.Raycaster();
  let rotationMatrix = new THREE.Matrix4().makeRotationY(21);
  let instanceMatrix = new THREE.Matrix4();
  let lastInstanceId = undefined;

  useFrame(() => {
    if (mesh) {
      if (sound_offsets) {
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
            sound.detune = choose(TUNES);
            sound.volume = choose(VOLUMES);
            let sound_offset_data = choose(sound_offsets);
            if (sound_offset_data[0] !== Infinity) {
              sound.offset = sound_offset_data[0];
              sound.duration = sound_offset_data[1];
            }
            sound.play();
          }
          lastInstanceId = copy(instanceId);
        } 
      }
    }
  });


  useFrame(() => {
    if (mesh) {
      var time = Date.now() * 0.001;
      mesh.rotation.x = Math.sin( time / 4 );
      mesh.rotation.y = Math.sin( time / 2 );
      mesh.instanceMatrix.needsUpdate = true;
    }
    
  })

  const group = useRef();
  return (
    <group ref={group} {...props}>
      <primitive name="Frogs" object={mesh} />
    </group>
  );
}
