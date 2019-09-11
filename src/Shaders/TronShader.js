import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useRender, useResource, useThree } from 'react-three-fiber';
import { assetPathShared } from "../Utils/assets";

import tronFragmentChunk from '!raw-loader!glslify-loader!./tronFragmentChunk.glsl';
import plotChunk from '!raw-loader!glslify-loader!./plotChunk.glsl';

// Shader built in the style of: https://medium.com/@pailhead011/extending-three-js-materials-with-glsl-78ea7bbb9270
export function TronMaterial({ materialRef, pointLight, pos, ...props }) {
  const { camera, canvas } = useThree();
  const [colorMap, normalMap, metalnessMap, envMap] = useMemo(() => {
    const textureLoader = new THREE.TextureLoader();
    const colorMap = textureLoader.load(assetPathShared("textures/aluminum-scuffed/Aluminum-Scuffed_basecolor.png"));
    const normalMap = textureLoader.load(assetPathShared("textures/aluminum-scuffed/Aluminum-Scuffed_normal.png"));
    const metalnessMap = textureLoader.load(assetPathShared("textures/aluminum-scuffed/Aluminum-Scuffed_metallic.png"));
    // const hdrTexture = textureLoader.load(assetPathShared("hdris/atmosphere.png"))
    // const envMap = THREE.EquirectangularToCubeGenerator.convert(hdrTexture);
    const envMap = new THREE.CubeTextureLoader()
      // .setPath(assetPathShared('textures/env-maps/barc-rooftop/'))
      // .load([
      //   'px.png',
      //   'nx.png',
      //   'py.png',
      //   'ny.png',
      //   'pz.png',
      //   'nz.png',
      // ]);
//       graycloud_bk.jpg
// graycloud_dn.jpg
// graycloud_ft.jpg
// graycloud_lf.jpg
// graycloud_rt.jpg
// graycloud_up.jpg
      .setPath(assetPathShared('textures/env-maps/graycloud/'))
      .load([
        'graycloud_lf.jpg',
        'graycloud_rt.jpg',
        'graycloud_up.jpg',
        'graycloud_dn.jpg',
        'graycloud_ft.jpg',
        'graycloud_bk.jpg',
      ]);
 
      // envMap.repeat = THREE.RepeatWrapping;
      // envMap.repeat.set(10000, 10000);//meshWidth / textureWidth, meshHeight / textureHeight);
    return [colorMap, normalMap, metalnessMap, envMap]
  });
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.userData.uTime = { value: 0 };
      // materialRef.current.userData.uGlobalOffset = { value: pos };
      materialRef.current.userData.uCurCenter = { value: camera.position };
      materialRef.current.onBeforeCompile = shader => {
        shader.uniforms.uTime = materialRef.current.userData.uTime;
        // shader.uniforms.uGlobalOffset = materialRef.current.userData.uGlobalOffset;
        shader.uniforms.uCurCenter = materialRef.current.userData.uCurCenter;

        // add in custom uniforms and funcs
        shader.fragmentShader = `
        uniform float uTime;
        //uniform vec3 uGlobalOffset;
        uniform vec3 uCurCenter;
        ` +
          plotChunk +
          shader.fragmentShader;

        // add custom code before the last line
        // shader.fragmentShader = shader.fragmentShader.replace(
        //   `vec4 diffuseColor = vec4( diffuse, opacity );`,
        //   tronFragmentChunk
        // )
      }
      materialRef.current.needsUpdate = true;
    }
  }, [])
  useRender((state, time) => {
    if (!materialRef.current) return;
    materialRef.current.userData.uTime.value += .1;
  });
  return <meshPhongMaterial
    {...props}
    ref={materialRef}
    // emissive={new THREE.Color("red")}
    lights
    receiveShadow
    castShadow
    map={colorMap}
    envMapIntensity = {0.3}
    reflectivity={0.8} // env map uses this
    envMap={envMap}
    // refractionRatio={.1}
    normalMap={normalMap}
    metalnessMap={metalnessMap}
  />
}