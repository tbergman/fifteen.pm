import * as THREE from "three";
import React, { useEffect, useRef, useContext, useMemo } from "react";
import { useLoader, useFrame, useThree } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { MaterialsContext } from "./MaterialsContext";
import * as C from "./constants";

export default function Frog(props) {

  const group = useRef();
  const gltf = useLoader(GLTFLoader, C.FROG_URL, loader => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco-gltf/");
    loader.setDRACOLoader(dracoLoader);
  });

  const { foamGripSilver } = useContext(MaterialsContext);

  let { amount = 10, freqArray, audioStream } = props;
  const count = Math.pow(amount, 3);

  const mesh = useMemo(() => {
    if (!gltf) {
      return;
    }
    let geom;
    gltf.scene.traverse(child => {
      if (child.isMesh) {
        geom = child.geometry;
        geom.scale(0.08, 0.08, 0.08);
        geom.toNonIndexed();
        geom.computeVertexNormals();
        geom.computeBoundingBox();
      }
    });
    let mesh = new THREE.InstancedMesh(geom, foamGripSilver, count);

    // position instanced froggies in a cube
    var i = 0;
    var offset = ( amount - 1 ) / 4;
    var transform = new THREE.Object3D();
    for ( var x = 0; x < amount; x ++ ) {
      for ( var y = 0; y < amount; y ++ ) {
        for ( var z = 0; z < amount; z ++ ) {
          transform.position.set( offset - x, offset - y, offset - z );
          transform.updateMatrix();
          mesh.setMatrixAt( i ++, transform.matrix );
        }
      }
    }
    return mesh;
  }, [gltf]);

  // TODO: Maybe I should be using my own mouse vector?
  const { camera, mouse } = useThree();
  let raycaster = new THREE.Raycaster();
  let rotationMatrix = new THREE.Matrix4().makeRotationY( 0.1 );
  let instanceMatrix = new THREE.Matrix4();

  useFrame(() => {
    if (mesh) {
      raycaster.setFromCamera( mouse, camera );
      let intersection = raycaster.intersectObject( mesh );
      console.log('intersection object:');
      console.log(intersection);

      if ( intersection.length > 0 ) {
        console.log('INTERSECTION!!!!!');
        let instanceId = intersection[ 0 ].instanceId;
  
        mesh.getMatrixAt( instanceId, instanceMatrix );
        matrix.multiplyMatrices( instanceMatrix, rotationMatrix );
  
        mesh.setMatrixAt( instanceId, matrix );
        mesh.instanceMatrix.needsUpdate = true;
  
      }
    }
  });

  return (
    <group ref={group} {...props}>
      <primitive name="Frogs" object={mesh} />
    </group>
  );
}
