import * as THREE from "three";
import React, { useEffect, useRef, useContext, useMemo } from "react";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";
import { TerrainShader, NormalMapShader, ShaderTerrain } from "./shaders";
import * as C from "./constants";
import {  useFrame  } from "react-three-fiber";

///////////////////////
// INITALIZE VARIABLES
//////////////////////

export default function Murk(props) {
  let clock = new THREE.Clock();

  // HEIGHT + NORMAL MAPS
  let {
    rx = 256,
    ry = 256,
    planeSize = 1024,
    minFilter = THREE.LinearFilter,
    magFilter = THREE.LinearFilter,
    format = THREE.RGBFormat,
    noiseTime = 0.0,
    noiseScale = new THREE.Vector2(0.7, 0.7),
    noiseOffset = new THREE.Vector2(-1.3, -1.3),
    normalHeight = 0.1,
    normalScale = 0.25,
    diffuseHex = 0xffffff,
    specularHex = 0xffffff,
    ambientHex = 0x111111,
    shininess = 240,
    displacementScale = 375,
    gridSize = 4,
    enableDiffuse1 = true,
    enableDiffuse2 = true,
    enableSpecular = true,
    diffuseTexture1Url = C.MURK_DIFFUSE_TEXTURE_1_URL,
    diffuseTexture2Url = C.MURK_DIFFUSE_TEXTURE_2_URL,
    detailTextureUrl = C.MURK_DETAIL_TEXTURE_URL
  } = props;

  const mesh = useMemo(() => {
    // Shader Parameters
    let mlib = {};
    let sceneRenderTarget = new THREE.Scene();
    // setup render target
    let renderTargetParams = {
      rx,
      ry,
      minFilter,
      magFilter,
      format
    };
    let heightMap = new THREE.WebGLRenderTarget(renderTargetParams);
    heightMap.texture.generateMipmaps = false;
    let normalMap = new THREE.WebGLRenderTarget(renderTargetParams);
    normalMap.texture.generateMipmaps = false;

    let uniformsNoise = {
      time: { value: noiseTime },
      scale: { value: noiseScale },
      offset: { value: noiseOffset }
    };
    let uniformsNormal = THREE.UniformsUtils.clone(NormalMapShader.uniforms);
    uniformsNormal.height.value = normalHeight;
    uniformsNormal.resolution.value.set(rx, ry);
    uniformsNormal.heightMap.value = heightMap.texture;
    let vertexShader = TerrainShader["vertexShader"];

    // TEXTURES
    let loadingManager = new THREE.LoadingManager();

    let textureLoader = new THREE.TextureLoader(loadingManager);
    let specularMap = new THREE.WebGLRenderTarget(planeSize, planeSize, renderTargetParams);
    specularMap.texture.generateMipmaps = false;
    let diffuseTexture1 = textureLoader.load(diffuseTexture1Url);
    let diffuseTexture2 = textureLoader.load(diffuseTexture2Url);
    let detailTexture = textureLoader.load(detailTextureUrl);
    diffuseTexture1.wrapS = diffuseTexture1.wrapT = THREE.RepeatWrapping;
    diffuseTexture2.wrapS = diffuseTexture2.wrapT = THREE.RepeatWrapping;
    detailTexture.wrapS = detailTexture.wrapT = THREE.RepeatWrapping;
    specularMap.texture.wrapS = specularMap.texture.wrapT =
      THREE.RepeatWrapping;

    // TERRAIN SHADER
    let terrainShader = ShaderTerrain["terrain"];
    let uniformsTerrain = THREE.UniformsUtils.clone(terrainShader.uniforms);
    uniformsTerrain["tNormal"].value = normalMap.texture;
    uniformsTerrain["uNormalScale"].value = normalScale;
    uniformsTerrain["tDisplacement"].value = heightMap.texture;
    uniformsTerrain["tDiffuse1"].value = diffuseTexture1;
    uniformsTerrain["tDiffuse2"].value = diffuseTexture2;
    uniformsTerrain["tSpecular"].value = specularMap.texture;
    uniformsTerrain["tDetail"].value = detailTexture;
    uniformsTerrain["enableDiffuse1"].value = enableDiffuse1;
    uniformsTerrain["enableDiffuse2"].value = enableDiffuse2;
    uniformsTerrain["enableSpecular"].value = enableSpecular;
    uniformsTerrain["diffuse"].value.setHex(diffuseHex);
    uniformsTerrain["specular"].value.setHex(specularHex);
    uniformsTerrain["shininess"].value = shininess;
    uniformsTerrain["uDisplacementScale"].value = displacementScale;
    uniformsTerrain["uRepeatOverlay"].value.set(gridSize, gridSize);
    let params = [
      [
        "heightmap",
        TerrainShader["fragmentShaderNoise"],
        vertexShader,
        uniformsNoise,
        false
      ],
      [
        "normal",
        NormalMapShader.fragmentShader,
        NormalMapShader.vertexShader,
        uniformsNormal,
        false
      ],
      [
        "terrain",
        terrainShader.fragmentShader,
        terrainShader.vertexShader,
        uniformsTerrain,
        true
      ]
    ];
    for (var i = 0; i < params.length; i++) {
      var material = new THREE.ShaderMaterial({
        uniforms: params[i][3],
        vertexShader: params[i][2],
        fragmentShader: params[i][1],
        lights: params[i][4],
        fog: true
      });
      mlib[params[i][0]] = material;
    }
    let plane = new THREE.PlaneBufferGeometry(1200, 1200);
    let quadTarget = new THREE.Mesh(
      plane,
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    sceneRenderTarget.add(quadTarget);

    // TERRAIN MESH
    let geometryTerrain = new THREE.PlaneBufferGeometry(4500, 4500, 512, 512);
    BufferGeometryUtils.computeTangents(geometryTerrain);
    // geometryTerrain.computeFaceNormals();
    // geometryTerrain.computeVertexNormals();
    // geometryTerrain.computeTangents();

    let mesh = new THREE.Mesh(geometryTerrain, mlib["terrain"]);
    mesh.position.set(0, -125, 0);
    mesh.rotation.x = -Math.PI / 2;
    mesh.visible = false;
    return mesh;
  });
  // useFrame(() => {
  //   if (mesh) {
  //     let delta = clock.getDelta();
  //     if (mesh.visible) {
  //       let fLow = 0.1,
  //         fHigh = 0.8;
  //       let lightVal = 0,
  //         lightDir = 1;
  //       let animDelta = 0,
  //         animDeltaDir = -1;
  //       lightVal = THREE.Math.clamp(
  //         lightVal + 0.5 * delta * lightDir,
  //         fLow,
  //         fHigh
  //       );
  //       let valNorm = (lightVal - fLow) / (fHigh - fLow);
  //       directionalLight.intensity = THREE.Math.mapLinear(
  //         valNorm,
  //         0,
  //         1,
  //         0.1,
  //         1.15
  //       );
  //       pointLight.intensity = THREE.Math.mapLinear(valNorm, 0, 1, 0.9, 1.5);
  //       uniformsTerrain["uNormalScale"].value = THREE.Math.mapLinear(
  //         valNorm,
  //         0,
  //         1,
  //         0.6,
  //         3.5
  //       );
  //       if (updateNoise) {
  //         animDelta = THREE.Math.clamp(
  //           animDelta + 0.00075 * animDeltaDir,
  //           0,
  //           0.05
  //         );
  //         uniformsNoise["time"].value += delta * animDelta;
  //         uniformsNoise["offset"].value.x += delta * 0.05;
  //         uniformsTerrain["uOffset"].value.x =
  //           4 * uniformsNoise["offset"].value.x;
  //         quadTarget.material = mlib["heightmap"];
  //         renderer.render(sceneRenderTarget, cameraOrtho, heightMap, true);
  //         quadTarget.material = mlib["normal"];
  //         renderer.render(sceneRenderTarget, cameraOrtho, normalMap, true);
  //       }
  //     }
  //   }
  // });
  const group = useRef();
  return (
    <group ref={group} {...props}>
      <primitive name="Murk" object={mesh} />
    </group>
  );
}
