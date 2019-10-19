import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { assetPathShared } from "./assets.js";
import { useFrame, useThree } from 'react-three-fiber';

/* eslint import/no-webpack-loader-syntax: off */
import skinningVertexShader from '!raw-loader!glslify-loader!../Shaders/skinningVertex.glsl';
/* eslint import/no-webpack-loader-syntax: off */
import riverFragmentShader from '!raw-loader!glslify-loader!../Shaders/riverFragment.glsl';
/* eslint import/no-webpack-loader-syntax: off */
import simpleVertex from '!raw-loader!glslify-loader!../Shaders/simpleVertex.glsl';
/* eslint import/no-webpack-loader-syntax: off */
import tronFragmentShader from '!raw-loader!glslify-loader!../Shaders/tronFragment.glsl';

/* eslint import/no-webpack-loader-syntax: off */
import vsDepthVertex from '!raw-loader!glslify-loader!../Shaders/vsDepthVertex.glsl';
/* eslint import/no-webpack-loader-syntax: off */
import simpleWithDepthVertex from '!raw-loader!glslify-loader!../Shaders/simpleWithDepthVertex.glsl';

function cloudEnvMap() {
	return new THREE.CubeTextureLoader()
		.setPath(assetPathShared('textures/env-maps/bluecloud/'))
		.load([
			'bluecloud_bk.jpg',
			'bluecloud_dn.jpg',
			'bluecloud_ft.jpg',
			'bluecloud_lf.jpg',
			'bluecloud_rt.jpg',
			'bluecloud_up.jpg',
		]);
}


function tileTextureMaps(textureMaps, props) {
	return textureMaps.map(textureMap => {
		const repeat = props.textureRepeat || { x: 1, y: 1 };
		textureMap.wrapS = THREE.RepeatWrapping;
		textureMap.offset.set(0, 0);
		textureMap.repeat.set(repeat.x, repeat.y);
		return textureMap;
	});
}

export function customDepthMaterial(material) {
	return new THREE.ShaderMaterial({
		vertexShader: vsDepthVertex,
		fragmentShader: THREE.ShaderLib.basic.fragmentShader,
		uniforms: material.uniforms
	});

}

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

export function FoamGripMaterial({ materialRef, ...props }) {
	materialRef = materialRef ? materialRef : useRef().current;
	const [colorMap, envMapCube, normalMap, aoMap, specularMap] = useMemo(() => {
		const textureLoader = new THREE.TextureLoader();
		const envMapCube = cloudEnvMap();
		const colorMap = textureLoader.load(assetPathShared("textures/foam-grip/foam-grip-albedo.png"));
		const normalMap = textureLoader.load(assetPathShared("textures/foam-grip/foam-grip-normal.png"))
		const aoMap = textureLoader.load(assetPathShared("textures/foam-grip/foam-grip-ao.png"))
		const specularMap = textureLoader.load(assetPathShared("textures/foam-grip/foam-grip-albedo.png"))
		return [colorMap, envMapCube, normalMap, aoMap, specularMap]
	});

	// const textureCube = loader.load(Array(6).fill('Barce_Rooftop.png'));
	return <meshPhongMaterial
		{...props}
		ref={materialRef}
		lights
		receiveShadow
		castShadow
		map={colorMap}
		color={props.color || 0xffffff}
		specular={0xf0f000}
		shininess={100}
		skinning={true}
		normalMap={normalMap}
		aoMap={aoMap}
		specularMap={specularMap}
		envMap={envMapCube}
		refractionRatio={1.0}
		combine={THREE.AddOperation}

	/>
}

// Shader built in the style of: https://medium.com/@pailhead011/extending-three-js-materials-with-glsl-78ea7bbb9270
// seems fun: https://www.clicktorelease.com/blog/creating-spherical-environment-mapping-shader/
export function CloudMaterial({ materialRef, ...props }) {
	materialRef = materialRef ? materialRef : useRef().current;
	const { camera, canvas } = useThree();
	const [colorMap, normalMap, metalnessMap, envMap] = useMemo(() => {
		const textureLoader = new THREE.TextureLoader();
		const colorMap = textureLoader.load(assetPathShared("textures/aluminum-scuffed/Aluminum-Scuffed_basecolor.png"));
		const normalMap = textureLoader.load(assetPathShared("textures/aluminum-scuffed/Aluminum-Scuffed_normal.png"));
		const metalnessMap = textureLoader.load(assetPathShared("textures/aluminum-scuffed/Aluminum-Scuffed_metallic.png"));
		const envMap = cloudEnvMap();
		const textureMaps = [colorMap, normalMap, metalnessMap, envMap];
		return tileTextureMaps(textureMaps, props);
	});
	return <meshPhongMaterial
		{...props}
		ref={materialRef}
		lights
		receiveShadow
		castShadow
		map={colorMap}
		shininess={props.shininess || 100}
		envMapIntensity={0.3}
		color={props.color || 0x0000c0}
		emissive={props.emissive || 0xfffb00}
		opacity={props.opacity || 1.0}
		reflectivity={props.reflectivity || 0.8} // env map uses this
		envMap={envMap}
		side={props.side || THREE.FrontSide}
		normalMap={normalMap}
		metalnessMap={metalnessMap}
	/>
}


export function Metal03Material({ materialRef, ...props }) {
	// https://www.cc0textures.com/view.php?tex=Metal03
	const [envMap, colorMap, normalMap, metalMap, roughnessMap, displacementMap] = useMemo(() => {
		const textureLoader = new THREE.TextureLoader();
		const envMap = props.envMapURL ? textureLoader.load(envMapUrl) : cloudEnvMap();
		const colorMap = textureLoader.load(assetPathShared("textures/metal03/Metal03_col.jpg"))
		const normalMap = textureLoader.load(assetPathShared("textures/metal03/Metal03_nrm.jpg"))
		const metalMap = textureLoader.load(assetPathShared("textures/metal03/Metal03_met.jpg"))
		const roughnessMap = textureLoader.load(assetPathShared("textures/metal03/Metal03_rgh.jpg"))
		const displacementMap = textureLoader.load(assetPathShared("textures/metal03/Metal03_disp.jpg"))
		const textureMaps = [envMap, colorMap, normalMap, metalMap, roughnessMap, displacementMap]
		return tileTextureMaps(textureMaps, props);
	});
	return <meshStandardMaterial
		{...props}
		ref={materialRef}
		lights
		receiveShadow
		castShadow
		envMap={envMap}
		map={colorMap}
		normalMap={normalMap}
		metalMap={metalMap}
		roughness={props.roughness || 0.5}
		roughnessMap={roughnessMap}
		displacementScale={props.displacementScale || 0} // TODO play around
		displacementBias={props.displacementBias || 0}
		displacementMap={displacementMap}
	/>
}

export function Ground29Material({ materialRef, ...props }) {
	// https://www.cc0textures.com/view.php?tex=Ground29
	const [colorMap, normalMap, aoMap, roughnessMap, displacementMap] = useMemo(() => {
		const textureLoader = new THREE.TextureLoader();
		const colorMap = textureLoader.load(assetPathShared("textures/ground29/Ground29_col.jpg"))
		const normalMap = textureLoader.load(assetPathShared("textures/ground29/Ground29_nrm.jpg"))
		const aoMap = textureLoader.load(assetPathShared("textures/ground29/Ground29_ao.jpg"))
		const roughnessMap = textureLoader.load(assetPathShared("textures/ground29/Ground29_rgh.jpg"))
		const displacementMap = textureLoader.load(assetPathShared("textures/ground29/Ground29_disp.jpg"))
		const textureMaps = [colorMap, normalMap, aoMap, roughnessMap, displacementMap]
		return tileTextureMaps(textureMaps, props);
	});

	// return <meshStandardMaterial
	return <meshStandardMaterial
		{...props}
		ref={materialRef}
		lights
		// wireframeLineWidth={10}
		// alphaTest={0.5}
		// transparent
		// wireframe
		receiveShadow
		castShadow
		color={props.color || 0xf0f0f0}
		map={colorMap}
		normalMap={normalMap}
		aoMap={aoMap}
		roughnessMap={roughnessMap}
		displacementScale={props.displacementScale || .01} // TODO play around
		displacementBias={props.displacementBias || 0}//-.01}
		displacementMap={displacementMap}
	/>
}

export function Facade12Material({ materialRef, ...props }) {
	// https://www.cc0textures.com/view.php?tex=Facade12

	const [colorMap, normalMap, emissiveMap, roughnessMap, displacementMap] = useMemo(() => {
		const textureLoader = new THREE.TextureLoader();
		const colorMap = textureLoader.load(assetPathShared("textures/facade12/Facade12_col.jpg"))
		const normalMap = textureLoader.load(assetPathShared("textures/facade12/Facade12_nrm.jpg"))
		const emissiveMap = textureLoader.load(assetPathShared("textures/facade12/Facade12_emi.jpg"))
		const roughnessMap = textureLoader.load(assetPathShared("textures/facade12/Facade12_rgh.jpg"))
		const displacementMap = textureLoader.load(assetPathShared("textures/facade12/Facade12_disp.jpg"))
		const textureMaps = [colorMap, normalMap, emissiveMap, roughnessMap, displacementMap]
		return tileTextureMaps(textureMaps, props);
	})

	return <meshStandardMaterial
		{...props}
		ref={materialRef}
		lights
		receiveShadow
		castShadow
		map={colorMap}
		normalMap={normalMap}
		emissiveMap={emissiveMap}
		roughnessMap={roughnessMap}
	// displacementMap={displacementMap}
	/>
}


export function Facade04Material({ materialRef, ...props }) {
	// https://www.cc0textures.com/view.php?tex=Facade12

	const [colorMap, normalMap, emissiveMap, roughnessMap, metalnessMap, maskMap, displacementMap] = useMemo(() => {
		const textureLoader = new THREE.TextureLoader();
		const colorMap = textureLoader.load(assetPathShared("textures/facade04/Facade04_col.jpg"))
		const normalMap = textureLoader.load(assetPathShared("textures/facade04/Facade04_nrm.jpg"))
		const emissiveMap = textureLoader.load(assetPathShared("textures/facade04/Facade04_emi.jpg"))
		const roughnessMap = textureLoader.load(assetPathShared("textures/facade04/Facade04_rgh.jpg"))
		const metalnessMap = textureLoader.load(assetPathShared("textures/facade04/Facade04_met.jpg"))
		const maskMap = textureLoader.load(assetPathShared("textures/facade04/Facade04_mask.jpg"))
		const displacementMap = textureLoader.load(assetPathShared("textures/facade04/Facade04_disp.jpg"))
		const textureMaps = [colorMap, normalMap, emissiveMap, roughnessMap, metalnessMap, maskMap, displacementMap]
		return tileTextureMaps(textureMaps, props);
	});

	return <meshStandardMaterial
		{...props}
		ref={materialRef}
		lights
		receiveShadow
		castShadow
		map={colorMap}
		maskMap={maskMap}
		normalMap={normalMap}
		emissiveMap={emissiveMap}
		metalnessMap={metalnessMap}
		roughnessMap={roughnessMap}
	// displacementMap={displacementMap}
	/>
}

export function Facade10Material({ materialRef, ...props }) {
	// https://www.cc0textures.com/view.php?tex=Facade12

	const [colorMap, normalMap, emissiveMap, roughnessMap, metalnessMap, displacementMap] = useMemo(() => {
		const textureLoader = new THREE.TextureLoader();
		const colorMap = textureLoader.load(assetPathShared("textures/facade10/Facade10_col.jpg"))
		const normalMap = textureLoader.load(assetPathShared("textures/facade10/Facade10_nrm.jpg"))
		const emissiveMap = textureLoader.load(assetPathShared("textures/facade10/Facade10_emi.jpg"))
		const roughnessMap = textureLoader.load(assetPathShared("textures/facade10/Facade10_rgh.jpg"))
		const metalnessMap = textureLoader.load(assetPathShared("textures/facade10/Facade10_met.jpg"))
		const displacementMap = textureLoader.load(assetPathShared("textures/facade10/Facade10_disp.jpg"))
		const textureMaps = [colorMap, normalMap, emissiveMap, roughnessMap, metalnessMap, displacementMap]
		return tileTextureMaps(textureMaps, props);
	});

	return <meshStandardMaterial
		{...props}
		ref={materialRef}
		lights
		receiveShadow
		castShadow
		map={colorMap}
		normalMap={normalMap}
		emissiveMap={emissiveMap}
		metalnessMap={metalnessMap}
		roughnessMap={roughnessMap}
	// displacementMap={displacementMap}
	/>
}

export function Windows1Material({ materialRef, ...props }) {
	const [colorMap, envMap] = useMemo(() => {
		const textureLoader = new THREE.TextureLoader();
		const colorMap = textureLoader.load(assetPathShared("textures/windows/windows1.png"))
		colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping;
		colorMap.offset.set(0, 0);
		colorMap.repeat.set(16, 16);
		const envMap = cloudEnvMap();
		return [colorMap, envMap];
	});
	return <meshStandardMaterial
		{...props}
		ref={materialRef}
		lights
		receiveShadow
		castShadow
		shininess={100}
		map={colorMap}
		envMap={envMap}
	// color={0xff0000}
	/>
}

export function TronMaterial({ materialRef, bpm, side }) {
	materialRef = materialRef ? materialRef : useRef().current;
	const BPM = 120; // TODO not passing down
	const { camera, size } = useThree();
	let t = 0;

	useFrame(
		(state, time) => {
			if (!materialRef.current) return; // avoid re-initialization async issues (e.g. if tiling)
			materialRef.current.uniforms.uTime.value = time;
		});
	const uniforms = useMemo(() => {
		return {
			uTime: { value: 0 },
			uCurCenter: { value: camera.position },
			uResolution: { value: new THREE.Vector2(size.width, size.length) },
			// uLightPosition: {value: camera.children[0].position},
			uBPM: { value: BPM },// TODO bpm },
		}
	}, [materialRef, bpm]);
	return <shaderMaterial
		ref={materialRef}
		uniforms={uniforms}
		// lights={true}
		// vertexShader={simpleWithDepthVertex}
		side={side}
		vertexShader={simpleVertex}
		fragmentShader={tronFragmentShader}
	/>;
}


export function BlackLeather12({ materialRef, ...props }) {
	const [diffuseMap, glossinessMap, heightMap, normalMap, reflectionMap] = useMemo(() => {
		const textureLoader = new THREE.TextureLoader();
		const diffuseMap = textureLoader.load(assetPathShared("textures/black-leather-12/black_leather_12_diffuse.png"))
		const glossinessMap = textureLoader.load(assetPathShared("textures/black-leather-12/black_leather_12_glossiness.png"))
		const heightMap = textureLoader.load(assetPathShared("textures/black-leather-12/black_leather_12_height.png"))
		const normalMap = textureLoader.load(assetPathShared("textures/black-leather-12/black_leather_12_normal.png"))
		const reflectionMap = textureLoader.load(assetPathShared("textures/black-leather-12/black_leather_12_reflection.png"))
		const textureMaps = [diffuseMap, glossinessMap, heightMap, normalMap, reflectionMap]
		return tileTextureMaps(textureMaps, props);
	});
	return <meshStandardMaterial
		ref={materialRef}
		map={diffuseMap}
		roughnessMap={glossinessMap}
		roughness={0.1}
		displacementMap={heightMap}
		displacementScale={.01}
		normalMap={normalMap}
		envMap={reflectionMap}
		roughness={-1} // invert roughness to get glossiness
	/>
}

// TODO
export function EmissiveMaterial({ materialRef, ...props }) {
	return <meshStandardMaterial
		{...props}
		ref={materialRef}
		lights
		receiveShadow
		castShadow
	/>
}