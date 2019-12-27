import * as THREE from "three";
import React, { useEffect, useRef, useContext, useMemo } from "react";
import { useLoader, useFrame } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { MaterialsContext } from './MaterialsContext';
import * as C from "./constants";

export default function Frog(props) {
  const group = useRef();
  const gltf = useLoader(GLTFLoader, C.FROG_URL, loader => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco-gltf/");
    loader.setDRACOLoader(dracoLoader);
  });

  const { foamGripSilver } = useContext(MaterialsContext);

  let {count = 1000, amount = 10} = props;

  const mesh = useMemo(() => {
    if (!gltf) {
      return;
    }
    let geom;
    gltf.scene.traverse(child => {
      if (child.isMesh) {
        geom = child.geometry;
        geom.scale( 0.08, 0.08, 0.08 );
        geom.toNonIndexed();
        geom.computeVertexNormals();
        geom.computeBoundingBox();
      }   
    })
    return new THREE.InstancedMesh(geom, foamGripSilver, count);
  }, [gltf])


  const dummy = new THREE.Object3D();
  useFrame(() => {
    // from: https://threejs.org/examples/?q=suza#webgl_instancing_suzanne
    if (mesh) {
      var time = Date.now() * 0.001;
      mesh.rotation.x = Math.sin( time / 4 );
      mesh.rotation.y = Math.sin( time / 2 );
      var i = 0;
      var offset = ( amount - 1 ) / 2;
      for ( var x = 0; x < amount; x ++ ) {
        for ( var y = 0; y < amount; y ++ ) {
          for ( var z = 0; z < amount; z ++ ) {
            dummy.position.set( offset - x, offset - y, offset - z );
            dummy.rotation.y = ( Math.sin( x / 4 + time ) + Math.sin( y / 4 + time ) + Math.sin( z / 4 + time ) );
            dummy.rotation.z = dummy.rotation.y * 2;
            dummy.updateMatrix();
            mesh.setMatrixAt( i ++, dummy.matrix );
          }
        }
      }
      mesh.instanceMatrix.needsUpdate = true;
    }
  })
  return (
    <group ref={group} {...props}>
      <primitive name="Frogs" object={mesh} />
    </group>
  );
}
