import * as THREE from "three";
import { Sky as ThreeSky } from 'three/examples/jsm/objects/Sky';
import React, { useEffect, useRef, useContext, useMemo } from "react";
import {useThree, useFrame} from 'react-three-fiber';

export default function Sky(props) {
  let {
    turbidity = 13,
    rayleigh = 0.4,
    luminance = 1,
    mieCoefficient = 0.1,
    mieDirectionalG = 10.0,
    sunPosition = new THREE.Vector3(0,10,0)

  } = props;
  const {scene} = useThree();

  const mesh = useMemo(() =>{
    const sky = new ThreeSky();
    sky.scale.setScalar( 450000 );
    const sunSphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry( 20000, 16, 8 ),
      new THREE.MeshBasicMaterial( { color: 0xffffff } )
    );
    sunSphere.visible = false;

    scene.add( sunSphere );
    
    var theta = Math.PI * ( -100);
    var phi = 2 * Math.PI * ( -.25 );

    sunSphere.position.x = 1 * Math.cos( phi );
    sunSphere.position.y = 1 * Math.sin( phi ) * Math.sin( theta );
    sunSphere.position.z = 1 * Math.sin( phi ) * Math.cos( theta );
    
    sky.material.uniforms.sunPosition.value.copy( sunSphere.position );
    return sky;
  })

  useFrame(() => {
    if (mesh) {
      mesh.material.uniforms.turbidity.value = turbidity;
      mesh.material.uniforms.rayleigh.value = rayleigh;
      mesh.material.uniforms.luminance.value = luminance;
      mesh.material.uniforms.mieCoefficient.value = mieCoefficient;
      mesh.material.uniforms.mieDirectionalG.value = mieDirectionalG;
      mesh.material.uniforms.sunPosition.value.copy( sunPosition );
    }

  })






  return <primitive object={mesh}/>;
};