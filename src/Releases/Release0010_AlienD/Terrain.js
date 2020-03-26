import * as THREE from "three";
import React from "react";

import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";
import { ShaderTerrain } from "../../Common/Utils/ShaderTerrain";
import { NormalMapShader } from "../../Common/Utils/NormalMapShader";
import { SHADERS } from "./terrainShader";
import { useThree, useFrame, useMemo } from "react-three-fiber";
import { assetPathJV } from "./utils";

export default function Terrain(props) {
  const {

    // render target settings
    cameraOrthoPosition = [0, 40, 50],
    cameraOrthoNear = -1000,
    cameraOrthoFar = 1000,
    specularMapSize = 1024,
    heightMapUniformsTime = 0.0,
    heightMapUniformsScale = 0.7,
    heightMapUniformsOffset = -1.3,
    normalUniformsHeight = 0.1,

    // terrain settings
    terrainPosition = [-100, -520, -250],
    terrainSize = 16000,
    terrainResolution = 512,
    terrainRotationX = -Math.PI / 2,
    terrainUniformsNormalScale = 0.25,
    terrainUniformsEnableDiffuse1 = true,
    terrainUniformsEnableDiffuse2 = true,
    terrainUniformsEnableSpecular = true,
    terrainUniformsDiffuseHex = 0xffffff,
    terrainUniformsSpecularHex = 0xffffff,
    terrainUniformsShininess = 240,
    terrainUniformsDisplacementScale = 375,
    terrainUniformsRepeat = 8,
    terrainDiffuseTexture1URL = assetPathJV(
      "textures/terrain/sand-big-saturated-purple.jpg"
    ),
    terrainDiffuseTexture2URL = assetPathJV(
      "textures/terrain/backgrounddetailed6.jpg"
    ),
    terrainDetailTextureURL = assetPathJV(
      "textures/terrain/TexturesCom_DesertSand3_2x2_512_normal.jpg"
    ),

    // Animation Settings
    dDir = 1,
    dDeltaDir = 1,
    dHeightMapTimeFactor = 0.00075,
    dHeightMapTimeClamp = [0, 0.05],
    dTerrainOffsetFactor = 4,
    dNormalScaleFactor = 0.5,
    dNormalLinearScale = [0, 1, 0.6, 3.5],
    dScaleRange = [0.1, 0.8],
    dHeightMapOffsetFactor = 0.05,
    dNormalScale = 0.25,
    terrainQuadTargetPositionZ = -500,
    terrainQuadTargetMeshHex = 0x000000,
    renderTargetX = 256,
    renderTargetY = 256,
    renderTargetMinFilter = THREE.LinearFilter,
    renderTargetMagFilter = THREE.LinearFilter,
    renderTargetFormat = THREE.RGBFormat,
    mapTargetParams = {
      minFilter: renderTargetMinFilter,
      magFilter: renderTargetMagFilter,
      format: renderTargetFormat
    }
  } = props;

  // 
  const { scene, camera, gl, size } = useThree();
 
  // LIGHTS
  // TODO: REMOVE THESE
  scene.add(new THREE.AmbientLight(0x111111, 5));
  let directionalLight = new THREE.DirectionalLight(0xffffff, 1.15);
  directionalLight.position.set(500, 2000, 0);
  scene.add(directionalLight);
  let pointLight = new THREE.PointLight(0xff4400, 1.5);
  pointLight.position.set(0, 0, 0);
  scene.add(pointLight);
  
  
  let clock = new THREE.Clock();
  gl.setClearColor(0x000000, 0);
  gl.setPixelRatio(window.devicePixelRatio);
  gl.setSize(size.width, size.height);

  // SCENE (RENDER TARGET)
  const renderTarget = new THREE.WebGLRenderTarget(size.width, size.width);
  let sceneRenderTarget = new THREE.Scene();
  let cameraOrtho = new THREE.OrthographicCamera(
    size.width / -2,
    size.width / 2,
    size.height / 2,
    size.height / -2,
    cameraOrthoNear,
    cameraOrthoFar
  );
  cameraOrtho.position.set(...cameraOrthoPosition);
  sceneRenderTarget.add(cameraOrtho);

  // RENDER PLANE
  let plane = new THREE.PlaneBufferGeometry(size.width, size.height);
  let terrainQuadTarget = new THREE.Mesh(
    plane,
    new THREE.MeshBasicMaterial({ color: terrainQuadTargetMeshHex })
  );
  terrainQuadTarget.position.z = terrainQuadTargetPositionZ;
  sceneRenderTarget.add(terrainQuadTarget);


  // HEIGHT MAP TARGET
  let heightMap = new THREE.WebGLRenderTarget(
    renderTargetX,
    renderTargetY,
    mapTargetParams
  );
  heightMap.texture.generateMipmaps = false;
  let heightMapUniforms = {
    time: { value: heightMapUniformsTime },
    scale: {
      value: new THREE.Vector2(heightMapUniformsScale, heightMapUniformsScale)
    },
    offset: {
      value: new THREE.Vector2(heightMapUniformsOffset, heightMapUniformsOffset)
    }
  };

  // NORMAL MAP TARGET
  let normalMap = new THREE.WebGLRenderTarget(
    renderTargetX,
    renderTargetY,
    mapTargetParams
  );
  normalMap.texture.generateMipmaps = false;
  let normalUniforms = THREE.UniformsUtils.clone(NormalMapShader.uniforms);
  normalUniforms.height.value = normalUniformsHeight;
  normalUniforms.resolution.value.set(renderTargetX, renderTargetY);
  normalUniforms.heightMap.value = heightMap.texture;

  // SPECULAR MAP TARGET
  let specularMap = new THREE.WebGLRenderTarget(
    specularMapSize,
    specularMapSize,
    mapTargetParams
  );
  specularMap.texture.generateMipmaps = false;
  specularMap.texture.wrapS = specularMap.texture.wrapT = THREE.RepeatWrapping;

  // TERRAIN TEXTURE LOADING
  let loadingManager = new THREE.LoadingManager(function() {
    terrain.visible = true;
  });
  let textureLoader = new THREE.TextureLoader(loadingManager);
  let diffuseTexture1 = textureLoader.load(terrainDiffuseTexture1URL);
  let diffuseTexture2 = textureLoader.load(terrainDiffuseTexture2URL);
  let detailTexture = textureLoader.load(terrainDetailTextureURL);
  diffuseTexture1.wrapS = diffuseTexture1.wrapT = THREE.RepeatWrapping;
  diffuseTexture2.wrapS = diffuseTexture2.wrapT = THREE.RepeatWrapping;
  detailTexture.wrapS = detailTexture.wrapT = THREE.RepeatWrapping;

  // TERRAIN TEXTURE UNIFORMS
  let terrainUniforms = THREE.UniformsUtils.clone(
    ShaderTerrain["terrain"].uniforms
  );
  terrainUniforms["tNormal"].value = normalMap.texture;
  terrainUniforms["uNormalScale"].value = terrainUniformsNormalScale;
  terrainUniforms["tDisplacement"].value = heightMap.texture;
  terrainUniforms["tDiffuse1"].value = diffuseTexture1;
  terrainUniforms["tDiffuse2"].value = diffuseTexture2;
  terrainUniforms["tSpecular"].value = specularMap.texture;
  terrainUniforms["tDetail"].value = detailTexture;
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

  // TERRAIN MATERIALS
  let materialParams = [
    [
      "heightmap",
      SHADERS["fragmentShaderNoise"],
      SHADERS["vertexShader"],
      heightMapUniforms,
      false
    ],
    [
      "normal",
      NormalMapShader.fragmentShader,
      NormalMapShader.vertexShader,
      normalUniforms,
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

  let materials = {};
  for (var i = 0; i < materialParams.length; i++) {
    materials[materialParams[i][0]] = new THREE.ShaderMaterial({
      uniforms: materialParams[i][3],
      vertexShader: materialParams[i][2],
      fragmentShader: materialParams[i][1],
      lights: materialParams[i][4],
      fog: true
    });
  }

  // TERRAIN MESH
  let geometryTerrain = new THREE.PlaneBufferGeometry(
    terrainSize,
    terrainSize,
    terrainResolution,
    terrainResolution
  );
  BufferGeometryUtils.computeTangents(geometryTerrain);
  let terrain = new THREE.Mesh(geometryTerrain, materials["terrain"]);
  terrain.rotation.x = terrainRotationX;
  terrain.visible = false;

  // ANIMATIONS
  let dDelta = 0,
    dVal = 0;
  useFrame(() => {
    let dt = clock.getDelta();
    if (terrain.visible) {
      // update terrain uniform values
      dVal = THREE.Math.clamp(
        dVal + dNormalScaleFactor * dt * dDir,
        ...dScaleRange
      );
      let valNorm = (dVal - dScaleRange[0]) / (dScaleRange[1] - dScaleRange[0]);
      terrainUniforms["uNormalScale"].value = THREE.Math.mapLinear(
        valNorm,
        ...dNormalLinearScale
      );
      terrainUniforms["uOffset"].value.x =
        dTerrainOffsetFactor * heightMapUniforms["offset"].value.x;
      terrainUniforms["uNormalScale"].value = dNormalScale;
      terrainUniforms["shininess"].value =
        terrainUniforms["shininess"].value * Math.sin(dt);

      // render terrain height map
      dDelta = THREE.Math.clamp(
        dDelta + dHeightMapTimeFactor * dDeltaDir,
        ...dHeightMapTimeClamp
      );
      heightMapUniforms["time"].value += dt * dDelta * Math.tan(dt);
      heightMapUniforms["offset"].value.x += dt * dHeightMapOffsetFactor;
      terrainQuadTarget.material = materials["heightmap"];
      gl.setRenderTarget(renderTarget);
      gl.render(sceneRenderTarget, cameraOrtho, heightMap);
      gl.setRenderTarget(null); // TODO: FIGURE OUT WARNING

      // render terrain normal map
      gl.setRenderTarget(renderTarget);
      terrainQuadTarget.material = materials["normal"];
      gl.render(sceneRenderTarget, cameraOrtho, normalMap);
      gl.setRenderTarget(null); // TODO: FIGURE OUT WARNING
    }
  });

  return <primitive object={terrain} position={terrainPosition} />;
}
