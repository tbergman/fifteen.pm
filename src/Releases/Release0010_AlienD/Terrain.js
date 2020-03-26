import * as THREE from "three";
import React, { useEffect, useState, Component } from "react";

import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";
import { ShaderTerrain } from "../../Common/Utils/ShaderTerrain";
import { NormalMapShader } from "../../Common/Utils/NormalMapShader";
import { SHADERS } from "./terrainShader";
import { useThree, useFrame, useMemo } from "react-three-fiber";
import { assetPathJV, scaleTo } from "./utils";
import * as C from "./constants";

///////////////////
// INITIALIZE SCENE

const genRenderTargetMap = ({
  x,
  y,
  minFilter,
  magFilter,
  format,
  generateMipmaps = false
}) => {
  let target = new THREE.WebGLRenderTarget(x, y, {
    minFilter,
    magFilter,
    format
  });
  target.texture.generateMipmaps = generateMipmaps;
  return target;
};

export default function Terrain(props) {
  const {
    cameraOrthoPosition = [0, 40, 50],
    cameraOrthoNear = -10000,
    cameraOrthoFar = 10000,
    specularMapSize = 1024,
    heightMapUniformsNoiseTime = 0.0,
    heightMapUniformsNoiseScale = 0.7,
    heightMapUniformsNoiseOffset = -1.3,
    heightMapUniformsNoiseOffsetFactor = 0.05,
    normalUniformsHeight = 0.2,
    terrainPosition = [0, 0, 0],
    terrainSize = 4000,
    terrainResolution = 512,
    terrainUniformsNormalScale = 0.25,
    terrainUniformsNoiseOffsetFactor = 4,
    terrainUniformsEnableDiffuse1 = true,
    terrainUniformsEnableDiffuse2 = true,
    terrainUniformsEnableSpecular = true,
    terrainUniformsDiffuseHex = 0xffffff,
    terrainUniformsSpecularHex = 0xffffff,
    terrainUniformsShininess = 240,
    terrainUniformsDisplacementScale = 375,
    terrainUniformsRepeat = 4,
    terrainDiffuseTexture1URL = assetPathJV(
      "textures/terrain/sand-big-saturated-purple.jpg"
    ),
    terrainDiffuseTexture2URL = assetPathJV(
      "textures/terrain/backgrounddetailed6.jpg"
    ),
    terrainDetailTextureURL = assetPathJV(
      "textures/terrain/TexturesCom_DesertSand3_2x2_512_normal.jpg"
    ),
    terrainRotationX = -Math.PI / 2,
    terrainAnimDir = 1,
    terrainAnimDeltaNormalFactor = 0.5,
    terrainAnimDeltaHeightMapTimeFactor = 0.00075,
    terrainAnimDeltaHeightMapTimeClamp = [0, 0.05],
    terrainAnimUniformNormalLinearScaleRangeA = [0, 1],
    terrainAnimUniformNormalLinearScaleRangeB = [0.6, 3.5],
    terrainUniformsNormalScaleRange = [0.1, 0.8],
    terrainAnimUniformNormalScale = 0.25,
    terrainQuadTargetPositionZ = -500,
    terrainQuadTargetMeshHex = 0x000000,
    renderTargetX = 256,
    renderTargetY = 256,
    renderTargetMinFilter = THREE.LinearFilter,
    renderTargetMagFilter = THREE.LinearFilter,
    renderTargetFormat = THREE.RGBFormat
  } = props;
  const { scene, camera, gl, size } = useThree();

  // setup
  let clock = new THREE.Clock();
  gl.setClearColor(0x000000, 0);
  gl.setPixelRatio(window.devicePixelRatio);
  gl.setSize(size.width, size.height);

  // TODO: remove (LIGHTS)
  scene.add(new THREE.AmbientLight(0x111111, 5));
  let directionalLight = new THREE.DirectionalLight(0xffffff, 1.15);
  directionalLight.position.set(500, 2000, 0);
  scene.add(directionalLight);
  let pointLight = new THREE.PointLight(0xff4400, 1.5);
  pointLight.position.set(0, 0, 0);
  scene.add(pointLight);

  // TEXTURE LOADER
  // TODO: move to useLoader
  let loadingManager = new THREE.LoadingManager(function() {
    terrain.visible = true;
  });
  let textureLoader = new THREE.TextureLoader(loadingManager);

  // SCENE (RENDER TARGET)
  const renderTarget = new THREE.WebGLRenderTarget(size.width, size.width);
  let sceneRenderTarget = new THREE.Scene();

  // TODO: is this camera necessary?
  let cameraOrtho = new THREE.OrthographicCamera(
    size.width / -2,
    size.width / 2,
    size.height / 2,
    size.height / -2,
    cameraOrthoNear,
    cameraOrthoFar
  );
  cameraOrtho.position.set(cameraOrthoPosition[0], cameraOrthoPosition[1], cameraOrthoPosition[2]);
  sceneRenderTarget.add(cameraOrtho);

  // setup height map
  let heightMap = genRenderTargetMap(
    renderTargetX,
    renderTargetY,
    renderTargetMinFilter,
    renderTargetMagFilter,
    renderTargetFormat
  );
  let heightMapUniformsNoise = {
    time: { value: heightMapUniformsNoiseTime },
    scale: {
      value: new THREE.Vector2(
        heightMapUniformsNoiseScale,
        heightMapUniformsNoiseScale
      )
    },
    offset: {
      value: new THREE.Vector2(
        heightMapUniformsNoiseOffset,
        heightMapUniformsNoiseOffset
      )
    }
  };

  // setup normal map
  let normalMap = genRenderTargetMap(
    renderTargetX,
    renderTargetY,
    renderTargetMinFilter,
    renderTargetMagFilter,
    renderTargetFormat
  );
  let normalMapUniforms = THREE.UniformsUtils.clone(NormalMapShader.uniforms);
  normalMapUniforms.height.value = normalUniformsHeight;
  normalMapUniforms.resolution.value.set(renderTargetX, renderTargetY);
  normalMapUniforms.heightMap.value = heightMap.texture;

  // setup specular map
  let specularMap = genRenderTargetMap(
    specularMapSize,
    specularMapSize,
    renderTargetMinFilter,
    renderTargetMagFilter,
    renderTargetFormat
  );
  specularMap.texture.wrapS = specularMap.texture.wrapT = THREE.RepeatWrapping;

  // TERRAIN SHADER uniform settings.
  let terrainUniforms = THREE.UniformsUtils.clone(
    ShaderTerrain["terrain"].uniforms
  );
  let terrainDiffuseTexture1 = textureLoader.load(terrainDiffuseTexture1URL);
  terrainDiffuseTexture1.wrapS = terrainDiffuseTexture1.wrapT =
    THREE.RepeatWrapping;
  let terrainDiffuseTexture2 = textureLoader.load(terrainDiffuseTexture2URL);
  terrainDiffuseTexture2.wrapS = terrainDiffuseTexture2.wrapT =
    THREE.RepeatWrapping;
  let terrainDetailTexture = textureLoader.load(terrainDetailTextureURL);
  terrainDetailTexture.wrapS = terrainDetailTexture.wrapT =
    THREE.RepeatWrapping;
  terrainUniforms["tNormal"].value = normalMap.texture;
  terrainUniforms["uNormalScale"].value = terrainUniformsNormalScale;
  terrainUniforms["tDisplacement"].value = heightMap.texture;
  terrainUniforms["tDiffuse1"].value = terrainDiffuseTexture1;
  terrainUniforms["tDiffuse2"].value = terrainDiffuseTexture2;
  terrainUniforms["tSpecular"].value = specularMap.texture;
  terrainUniforms["tDetail"].value = terrainDetailTexture;
  terrainUniforms["enableDiffuse1"].value = terrainUniformsEnableDiffuse1;
  terrainUniforms["enableDiffuse2"].value = terrainUniformsEnableDiffuse2;
  terrainUniforms["enableSpecular"].value = terrainUniformsEnableSpecular;
  terrainUniforms["diffuse"].value.setHex(terrainUniformsDiffuseHex);
  terrainUniforms["specular"].value.setHex(terrainUniformsSpecularHex);
  terrainUniforms["shininess"].value = terrainUniformsShininess;
  terrainUniforms[
    "uDisplacementScale"
  ].value = terrainUniformsDisplacementScale;
  terrainUniforms["uRepeatOverlay"].value.set(
    terrainUniformsRepeat,
    terrainUniformsRepeat
  );

  // CREATE SHADERS
  let shaderLib = {};
  let params = [
    [
      "heightmap",
      SHADERS["fragmentShaderNoise"],
      SHADERS["vertexShader"],
      heightMapUniformsNoise,
      false
    ],
    [
      "normal",
      NormalMapShader.fragmentShader,
      NormalMapShader.vertexShader,
      normalMapUniforms,
      false
    ],
    [
      "terrain",
      ShaderTerrain["terrain"].fragmentShader,
      ShaderTerrain["terrain"].vertexShader,
      terrainUniforms,
      true
    ]
  ];
  // build up shaders
  for (var i = 0; i < params.length; i++) {
    var material = new THREE.ShaderMaterial({
      uniforms: params[i][3],
      vertexShader: params[i][2],
      fragmentShader: params[i][1],
      lights: params[i][4],
      fog: true
    });
    shaderLib[params[i][0]] = material;
  }

  let terrainQuadTarget = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(size.width, size.height),
    new THREE.MeshBasicMaterial({ color: terrainQuadTargetMeshHex })
  );
  terrainQuadTarget.position.z = terrainQuadTargetPositionZ;
  sceneRenderTarget.add(terrainQuadTarget);

  // TERRAIN MESH
  let geometryTerrain = new THREE.PlaneBufferGeometry(
    terrainSize,
    terrainSize,
    terrainResolution,
    terrainResolution
  );
  BufferGeometryUtils.computeTangents(geometryTerrain);

  let terrain = new THREE.Mesh(geometryTerrain, shaderLib["terrain"]);
  terrain.position.set(
    terrainPosition[0],
    terrainPosition[1],
    terrainPosition[2]
  );
  terrain.rotation.x = terrainRotationX;
  terrain.visible = false;

  // terrain animation
  let animVal = 0;
  let animDelta = 0;
  let [animLo, animHi] = terrainUniformsNormalScaleRange;
  let animDir = terrainAnimDir
  useFrame(() => {
    let dx = clock.getDelta();
    if (terrain.visible) {
      animVal = THREE.Math.clamp(
        animVal + terrainAnimDeltaNormalFactor * dx * animDir,
        animLo,
        animHi
      );
      let animValNorm = scaleTo(animVal, animLo, animHi)
      terrainUniforms["uNormalScale"].value = THREE.Math.mapLinear(
        animValNorm,
        terrainAnimUniformNormalLinearScaleRangeA[0],
        terrainAnimUniformNormalLinearScaleRangeA[1],
        terrainAnimUniformNormalLinearScaleRangeB[0],
        terrainAnimUniformNormalLinearScaleRangeB[1]
      );
      let [hmLo, hmHi] = terrainAnimDeltaHeightMapTimeClamp;
      animDelta = THREE.Math.clamp(
        animDelta + terrainAnimDeltaHeightMapTimeFactor * animDir,
        hmLo[0],
        hmHi[1]
      );
      heightMapUniformsNoise["time"].value += dx * animDelta;
      heightMapUniformsNoise["offset"].value.x += dx * heightMapUniformsNoiseOffsetFactor;
      terrainUniforms["uOffset"].value.x =
        terrainUniformsNoiseOffsetFactor *
        heightMapUniformsNoise["offset"].value.x;
      terrainUniforms["uNormalScale"].value = terrainAnimUniformNormalScale;
      terrainQuadTarget.material = shaderLib["heightmap"];
      gl.setRenderTarget(renderTarget);
      gl.render(sceneRenderTarget, cameraOrtho, heightMap, true);
      terrainQuadTarget.material = shaderLib["normal"];
      gl.render(sceneRenderTarget, cameraOrtho, normalMap, true);
      gl.setRenderTarget(null);
    }
  });

  return <primitive object={terrain} />;
}
