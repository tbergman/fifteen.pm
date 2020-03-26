import * as THREE from "three";
import React, { useEffect, useState, Component} from "react";

import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";
import { ShaderTerrain } from "../../Common/Utils/ShaderTerrain";
import { NormalMapShader } from "../../Common/Utils/NormalMapShader";
import { SHADERS } from "./terrainShader";
import {
  loadImage,
} from "../../Common/Utils/LegacyLoaders";
import { assetPath } from "../../Common/Utils/assets";
import { useThree, useFrame, useMemo } from "react-three-fiber";
import { assetPathJV } from './utils';


///////////////////
// INITIALIZE SCENE
let animDelta = 0, animDeltaDir = 1, lightVal = 0, lightDir = 1;

export default function Terrain(props) {
  const {scene, camera, gl, size} = useThree();
  let clock = new THREE.Clock();
  gl.setClearColor( 0x000000, 0 );
  gl.setPixelRatio( window.devicePixelRatio );
  gl.setSize( size.width, size.height );
  
  // TEXTURES
  let loadingManager = new THREE.LoadingManager( function () {
    terrain.visible = true;
  });

  // SCENE (RENDER TARGET)
  const renderTarget = new THREE.WebGLRenderTarget(size.width, size.width);
  let sceneRenderTarget = new THREE.Scene();
  let cameraOrtho = new THREE.OrthographicCamera( size.width / - 2, size.width / 2, size.height / 2, size.height / - 2, - 10000, 10000 );
  cameraOrtho.position.z = 50;
  cameraOrtho.position.y = 40;
  sceneRenderTarget.add( cameraOrtho );

  // LIGHTS
  scene.add( new THREE.AmbientLight( 0x111111, 5 ) );
  let directionalLight = new THREE.DirectionalLight( 0xffffff, 1.15 );
  directionalLight.position.set( 500, 2000, 0 );
  scene.add( directionalLight );
  let pointLight = new THREE.PointLight( 0xff4400, 1.5 );
  pointLight.position.set( 0, 0, 0 );
  scene.add( pointLight );

  // Terrain shader parameters
  let normalShader = NormalMapShader
  let rx = 256, ry = 256;
  let pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat };
  let heightMap = new THREE.WebGLRenderTarget( rx, ry, pars );
  heightMap.texture.generateMipmaps = false;
  let normalMap = new THREE.WebGLRenderTarget( rx, ry, pars );
  normalMap.texture.generateMipmaps = false;
  let uniformsNoise = {
    time: { value: 0.0 },
    scale: { value: new THREE.Vector2( 0.7, 0.7 ) },
    offset: { value: new THREE.Vector2( -1.3, -1.3 ) }
  };

  let uniformsNormal = THREE.UniformsUtils.clone( NormalMapShader.uniforms );
  uniformsNormal.height.value = 0.1;
  uniformsNormal.resolution.value.set( rx, ry );
  uniformsNormal.heightMap.value = heightMap.texture;
  let vertexShader = SHADERS[ 'vertexShader' ];
  let textureLoader = new THREE.TextureLoader( loadingManager );

  let terrainShader = ShaderTerrain[ "terrain" ];
  let uniformsTerrain = THREE.UniformsUtils.clone( terrainShader.uniforms );
  let updateNoise = true;
  // // construct the terrain
  // const [terrain, shaderLib] = useMemo(()=> {
  
  let shaderLib = {};
  
  let specularMap = new THREE.WebGLRenderTarget( 1024, 1024, pars );
  specularMap.texture.generateMipmaps = false;  
  let diffuseTexture1 = textureLoader.load( assetPathJV("textures/terrain/sand-big-saturated-purple.jpg") );
  let diffuseTexture2 = textureLoader.load( assetPathJV("textures/terrain/backgrounddetailed6.jpg") );
  let detailTexture = textureLoader.load( assetPathJV("textures/terrain/TexturesCom_DesertSand3_2x2_512_normal.jpg") );
  diffuseTexture1.wrapS = diffuseTexture1.wrapT = THREE.RepeatWrapping;
  diffuseTexture2.wrapS = diffuseTexture2.wrapT = THREE.RepeatWrapping;
  detailTexture.wrapS = detailTexture.wrapT = THREE.RepeatWrapping;
  specularMap.texture.wrapS = specularMap.texture.wrapT = THREE.RepeatWrapping;

  // TERRAIN SHADER uniform settings.

  uniformsTerrain[ 'tNormal' ].value = normalMap.texture;
  uniformsTerrain[ 'uNormalScale' ].value = 0.25;
  uniformsTerrain[ 'tDisplacement' ].value = heightMap.texture;
  uniformsTerrain[ 'tDiffuse1' ].value = diffuseTexture1;
  uniformsTerrain[ 'tDiffuse2' ].value = diffuseTexture2;
  uniformsTerrain[ 'tSpecular' ].value = specularMap.texture;
  uniformsTerrain[ 'tDetail' ].value = detailTexture;
  uniformsTerrain[ 'enableDiffuse1' ].value = true;
  uniformsTerrain[ 'enableDiffuse2' ].value = true;
  uniformsTerrain[ 'enableSpecular' ].value = true;
  uniformsTerrain[ 'diffuse' ].value.setHex( 0xffffff );
  uniformsTerrain[ 'specular' ].value.setHex( 0xffffff );
  uniformsTerrain[ 'shininess' ].value = 240;
  uniformsTerrain[ 'uDisplacementScale' ].value = 375;
  uniformsTerrain[ 'uRepeatOverlay' ].value.set( 4, 4 );
  let params = [
    [ 'heightmap',  SHADERS[ 'fragmentShaderNoise' ],   vertexShader, uniformsNoise, false ],
    [ 'normal',   normalShader.fragmentShader, normalShader.vertexShader, uniformsNormal, false ],
    [ 'terrain',  terrainShader.fragmentShader, terrainShader.vertexShader, uniformsTerrain, true ]
    ];
  // build up shaders
  for ( var i = 0; i < params.length; i ++ ) {
    var material = new THREE.ShaderMaterial( {
      uniforms: params[ i ][ 3 ],
      vertexShader: params[ i ][ 2 ],
      fragmentShader: params[ i ][ 1 ],
      lights: params[ i ][ 4 ],
      fog: true
    } );
    shaderLib[ params[ i ][ 0 ] ] = material;
  }

  let plane = new THREE.PlaneBufferGeometry( size.width, size.height );
  let quadTarget = new THREE.Mesh( plane, new THREE.MeshBasicMaterial( { color: 0x000000 } ) );
  quadTarget.position.z = - 500;
  sceneRenderTarget.add( quadTarget );

  // TERRAIN MESH
  let geometryTerrain = new THREE.PlaneBufferGeometry(4000, 4000, 512, 512 );
  BufferGeometryUtils.computeTangents( geometryTerrain );
  
  let terrain = new THREE.Mesh( geometryTerrain, shaderLib[ 'terrain' ] );
  terrain.position.set( -600, -125, 0 );
  terrain.rotation.x = - Math.PI / 2;
  terrain.visible = false;

  // return [terrain, shaderLib];
  // })

  // scene.add( terrain );

  let fLow = 0.1, fHigh = 0.8;
  // terrain animation
  useFrame(()=> {
    let delta = clock.getDelta();
    if ( terrain.visible) {
      lightVal = THREE.Math.clamp( lightVal + 0.5 * delta * lightDir, fLow, fHigh );
      let valNorm = ( lightVal - fLow ) / ( fHigh - fLow );
      uniformsTerrain[ 'uNormalScale' ].value = THREE.Math.mapLinear( valNorm, 0, 1, 0.6, 3.5 );
      animDelta = THREE.Math.clamp( animDelta + 0.00075 * animDeltaDir, 0, 0.05 );
      uniformsNoise[ 'time' ].value += delta * animDelta * Math.tan(delta);
      uniformsNoise[ 'offset' ].value.x += delta * 0.05;
      uniformsTerrain[ 'uOffset' ].value.x = 4 * uniformsNoise[ 'offset' ].value.x;
      uniformsTerrain[ 'uNormalScale' ].value = Math.random();
      uniformsTerrain[ 'shininess' ].value = 240 *  Math.sin(delta);
      quadTarget.material = shaderLib[ 'heightmap' ]
      gl.setRenderTarget(renderTarget);
      gl.render( sceneRenderTarget, cameraOrtho, heightMap, true );
      quadTarget.material = shaderLib[ 'normal' ];
      gl.render( sceneRenderTarget, cameraOrtho, normalMap, true );
      gl.setRenderTarget(null);
    }
  });

  return <primitive object={terrain}/>;
}