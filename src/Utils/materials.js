import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { assetPathShared } from "./assets.js";
import { useRender, useThree } from 'react-three-fiber';

/* eslint import/no-webpack-loader-syntax: off */
import skinningVertexShader from '!raw-loader!glslify-loader!../Shaders/skinningVertex.glsl';
/* eslint import/no-webpack-loader-syntax: off */
import riverFragmentShader from '!raw-loader!glslify-loader!../Shaders/riverFragment.glsl';
/* eslint import/no-webpack-loader-syntax: off */
import tronFragmentChunk from '!raw-loader!glslify-loader!../Shaders/tronFragmentChunk.glsl';
/* eslint import/no-webpack-loader-syntax: off */
import plotChunk from '!raw-loader!glslify-loader!../Shaders/plotChunk.glsl';


export function initFoamGripMaterial(textureLoader) {
	var envMapCube = new THREE.CubeTextureLoader()
		.setPath(assetPathShared('textures/env-maps/barc-rooftop/'))
		.load([
			'px.png',
			'nx.png',
			'py.png',
			'ny.png',
			'pz.png',
			'nz.png',
		]);

	// const textureCube = loader.load(Array(6).fill('Barce_Rooftop.png'));
	return new THREE.MeshPhongMaterial({
		color: 0xC0C0C0,
		specular: 0xC0C0C0,// 0x4c4c4c,
		shininess: 100,
		skinning: true,
		normalMap: textureLoader.load(assetPathShared("textures/foam-grip/foam-grip-normal.png")),
		aoMap: textureLoader.load(assetPathShared("textures/foam-grip/foam-grip-ao.png")),

		specularMap: textureLoader.load(assetPathShared("textures/foam-grip/foam-grip-albedo.png")),
		// map: textureLoader.load(assetPathShared("textures/foam-grip/foam-grip-albedo.png")),
		envMap: envMapCube,
		refractionRatio: 1.0,
		combine: THREE.AddOperation	
		
	})
}


export function initPinkRockMaterial(textureLoader) {
	const mat = initRockMaterial(textureLoader, 0xFF0FFF);
	const albedoMap = textureLoader.load(assetPathShared("textures/copper-rock/copper-rock1-alb-pink.png"));
	mat.map = albedoMap;
	return mat;
}

export function initRockMaterial(textureLoader, color) {
	const loader = new THREE.CubeTextureLoader();
	loader.setPath(assetPathShared('textures/env-maps/'));
	const textureCube = loader.load(Array(6).fill('office-space1.jpg'));
	const normalMap = textureLoader.load(assetPathShared("textures/copper-rock/copper-rock1-normal.png"));
	const roughnessMap = textureLoader.load(assetPathShared("textures/copper-rock/copper-rock1-rough.png"));
	const metalnessMap = textureLoader.load(assetPathShared("textures/copper-rock/copper-rock1-metal.png"));
	const aoMap = textureLoader.load(assetPathShared("textures/copper-rock/copper-rock1-ao.png"));
	const displacementMap = textureLoader.load(assetPathShared("textures/copper-rock/copper-rock1-height"));
	const albedoMap = textureLoader.load(assetPathShared("textures/copper-rock/copper-rock1-alb.png"))
	albedoMap.repeat.set(3, 3);
	albedoMap.wrapS = THREE.RepeatWrapping;
	albedoMap.wrapT = THREE.RepeatWrapping;
	normalMap.wrapS = THREE.RepeatWrapping;
	normalMap.wrapT = THREE.RepeatWrapping;
	// TODO playaround
	const mat = new THREE.MeshStandardMaterial({
		color: color,
		roughness: .4,
		metalness: .5,
		skinning: true,
		map: albedoMap,
		normalMap: normalMap,
		roughnessMap: roughnessMap,
		metalnessMap: metalnessMap,
		aoMap: aoMap,
		displacementMap: displacementMap,
		displacementScale: 20.4, // TODO play around
		displacementBias: -.01,
		envMap: textureCube
	});
	return mat;
}


export function initWaterMaterial(textureLoader, width, height, side) {
	const waterY = 103.;
	const alpha = 1.;
	// const rockTexture1 = textureLoader.load(assetPathShared("images/tiny3.png"))
	const rockTileTexture2 = textureLoader.load(assetPathShared("images/tiny2.png"));
	let waterMaterial = new THREE.ShaderMaterial({
		fragmentShader: riverFragmentShader,
		vertexShader: skinningVertexShader,
		// lights: true,
		// fog: true,
		transparent: true,
		// needsUpdate: true,
		uniforms: THREE.UniformsUtils.merge([
			THREE.UniformsLib["lights"],
		]),
		// side: side ? side : THREE.FrontSide,
		skinning: true,
	});
	// potentially add env map: view-source:https://2pha.com/demos/threejs/shaders/fresnel_cube_env.html
	waterMaterial.uniforms.u_alpha = { type: 'f', value: alpha || 1.0 };
	waterMaterial.uniforms.waterY = { type: 'f', value: waterY };
	waterMaterial.uniforms.lightIntensity = { type: 'f', value: 1.0 };
	waterMaterial.uniforms.textureSampler = { type: 't', value: rockTileTexture2 }; //imgMesh2.material.map };
	waterMaterial.uniforms.u_time = { type: 'f', value: 1.0 };
	waterMaterial.uniforms.u_resolution = { type: "v2", value: new THREE.Vector2() };
	waterMaterial.uniforms.iChannel0 = { value: rockTileTexture2 }; //imgMesh1.material.map };
	waterMaterial.uniforms.iChannel1 = { value: rockTileTexture2 };//imgMesh2.material.map };
	waterMaterial.uniforms.iChannel0.value.wrapS = THREE.RepeatWrapping;
	waterMaterial.uniforms.iChannel0.value.wrapT = THREE.RepeatWrapping;
	waterMaterial.uniforms.iChannel1.value.wrapS = THREE.RepeatWrapping;
	waterMaterial.uniforms.iChannel1.value.wrapT = THREE.RepeatWrapping;
	waterMaterial.uniforms.u_resolution.value.x = width;
	waterMaterial.uniforms.u_resolution.value.y = height;
	return waterMaterial;
}


export function initTransluscentMaterial(opacity) {
	return new THREE.MeshStandardMaterial({
		opacity: opacity,
		premultipliedAlpha: true,
		transparent: true,
		skinning: true
	});
}

export function initPinkShinyMaterial() {
	return new THREE.MeshStandardMaterial({
		color: 0xFB0082,
		metalness: 0.5,
		roughness: 0.0,
		skinning: true,
		needsUpdate: true,
		transparent: true,
		opacity: 0.5
	});
}


// Shader built in the style of: https://medium.com/@pailhead011/extending-three-js-materials-with-glsl-78ea7bbb9270
export function CloudMaterial({ materialRef, pointLight, pos, ...props }) {
  const { camera, canvas } = useThree();
  const [colorMap, normalMap, metalnessMap, envMap] = useMemo(() => {
    const textureLoader = new THREE.TextureLoader();
    const colorMap = textureLoader.load(assetPathShared("textures/aluminum-scuffed/Aluminum-Scuffed_basecolor.png"));
    const normalMap = textureLoader.load(assetPathShared("textures/aluminum-scuffed/Aluminum-Scuffed_normal.png"));
    const metalnessMap = textureLoader.load(assetPathShared("textures/aluminum-scuffed/Aluminum-Scuffed_metallic.png"));
    const envMap = new THREE.CubeTextureLoader()
      .setPath(assetPathShared('textures/env-maps/graycloud/'))
      .load([
        'graycloud_rt.jpg',
        'graycloud_lf.jpg',
        'graycloud_up.jpg',
        'graycloud_dn.jpg',
        'graycloud_ft.jpg',
        'graycloud_bk.jpg',
      ]);
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
    lights
    receiveShadow
    castShadow
    map={colorMap}
	envMapIntensity = {0.3}
	opacity={props.opacity || 1.0}
    reflectivity={props.reflectivity || 0.8} // env map uses this
    envMap={envMap}
	// refractionRatio={.1}
	side={props.side || THREE.FrontSide}
    normalMap={normalMap}
    metalnessMap={metalnessMap}
  />
}