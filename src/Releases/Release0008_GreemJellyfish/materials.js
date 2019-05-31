import * as THREE from 'three';
import { assetPath8 } from "./utils.js";

/* eslint import/no-webpack-loader-syntax: off */
import skinningVertexShader from '!raw-loader!glslify-loader!../../Shaders/skinningVertex.glsl';
/* eslint import/no-webpack-loader-syntax: off */
import riverFragmentShader from '!raw-loader!glslify-loader!../../Shaders/riverFragment.glsl';

export function initFoamGripMaterial(textureLoader) {
	var envMapCube = new THREE.CubeTextureLoader()
		.setPath(assetPath8('textures/env-maps/barc-rooftop/'))
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
		color: 0xf2f2f2,
		specular: 0xfdfdfd,
		shininess: 100,
		skinning: true,
		normalMap: textureLoader.load(assetPath8("textures/foam-grip/foam-grip-normal.png")),
		aoMap: textureLoader.load(assetPath8("textures/foam-grip/foam-grip-ao.png")),
		specularMap: textureLoader.load(assetPath8("textures/foam-grip/foam-grip-albedo.png")),
		envMap: envMapCube,
	})
}


export function initRockMaterial(textureLoader) {

	var loader = new THREE.CubeTextureLoader();
	loader.setPath(assetPath8('textures/env-maps/'));
	var textureCube = loader.load(Array(6).fill('office-space1.jpg'));
	const normalMap = textureLoader.load(assetPath8("textures/copper-rock/copper-rock1-normal.png"));
	const roughnessMap = textureLoader.load(assetPath8("textures/copper-rock/copper-rock1-rough.png"));
	const metalnessMap = textureLoader.load(assetPath8("textures/copper-rock/copper-rock1-metal.png"));
	var aoMap = textureLoader.load(assetPath8("textures/copper-rock/copper-rock1-ao.png"));
	var displacementMap = textureLoader.load(assetPath8("textures/copper-rock/copper-rock1-height"));
	// TODO playaround
	return new THREE.MeshStandardMaterial({
		color: 0xFF0FFF,
		roughness: .4,
		metalness: .5,
		skinning: true,
		normalMap: normalMap,
		roughnessMap: roughnessMap,
		metalnessMap: metalnessMap,
		aoMap: aoMap,
		displacementMap: displacementMap,
		displacementScale: 2.4, // TODO play around
		displacementBias: - 0.428408, // TODO play around
		envMap: textureCube
	});
}


export function initWaterMaterial(textureLoader, width, height, side) {
	const waterY = 103.;
	const alpha = 1.;
	// const rockTexture1 = textureLoader.load(assetPath8("images/tiny3.png"))
	const rockTileTexture2 = textureLoader.load(assetPath8("images/tiny2.png"));
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
		fog: true,
		needsUpdate: true,
		transparent: true,
		opacity: 0.5
	});
}