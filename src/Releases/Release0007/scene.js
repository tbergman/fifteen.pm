import * as THREE from "three";
import {OrbitControls} from "../../Utils/OrbitControls";
import {FirstPersonControls} from '../../Utils/FirstPersonControls';
import {BufferGeometryUtils} from "../../Utils/BufferGeometryUtils";
import {ShaderTerrain} from "../../Utils/ShaderTerrain";
import {NormalMapShader} from "../../Utils/NormalMapShader";
import {CONSTANTS} from "./constants";
import {SHADERS} from "./shaders"
import GLTFLoader from "three-gltf-loader";
import {loadGLTF, loadVideo, loadImage, loadOBJ} from "../../Utils/Loaders";
import {MTLLoader, OBJLoader} from 'three-obj-mtl-loader'
import {assetPath} from "../../Utils/assets";


///////////////////////
// INITALIZE VARIABLES
//////////////////////

let renderer, camera, scene, controls, manager, loader,
    cameraOrtho, sceneRenderTarget, uniformsNoise, objLoader,
    uniformsNormal, uniformsTerrain, heightMap,
    normalMap, quadTarget, directionalLight,
    pointLight, terrain, backgroundImage, lavaLampMixer;
let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;
let animDelta = 0, animDeltaDir = 1, lightVal = 0, lightDir = 1;
let clock = new THREE.Clock();
let updateNoise = true;
let hourglassAxis = new THREE.Vector3(0, 0, -1);
let hourglassRad = 0.013;
let backgroundAxis = new THREE.Vector3(0, -1, 0);
let backgroundRad = 0.00075;
let lavaLampAxis = new THREE.Vector3(0, -1, 0);
let lavaLampRad = 0.12;
let handMirrorAxis = new THREE.Vector3(0, 1, 0);
let handMirrorRad = 0.019;
let vaseAxis = new THREE.Vector3(1, 0, 0);
let vaseRad = 0.01;
let jupiterAxis = new THREE.Vector3(0, 1, 0);
let jupiterRad = 0.007;
let jupiterOrbitAxis = new THREE.Vector3(0, 0, -0.9);
let jupiterOrbitTheta = 0.03;
let balloonOrbitAxis = new THREE.Vector3(0, -1, 0);
let balloonOrbitTheta = 0.0075;
let balloonAxis = new THREE.Vector3(1, 0, 1);
let balloonRad = 0.01;
let numBalloons = 3;
let balloons = [];
let gltfObjects = {};
let mlib = {};

////////
// UTILS
////////

export const assetPath7 = (p) => {
  return assetPath("7/" + p);
}

///////////////////
// INITIALIZE SCENE
///////////////////

const init = (container) => {

  // SCENE (RENDER TARGET)
  sceneRenderTarget = new THREE.Scene();
  cameraOrtho = new THREE.OrthographicCamera( SCREEN_WIDTH / - 2, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, SCREEN_HEIGHT / - 2, - 10000, 10000 );
  cameraOrtho.position.z = 50;
  cameraOrtho.position.y = 40;
  sceneRenderTarget.add( cameraOrtho );

  // CAMERA
  camera = new THREE.PerspectiveCamera( 40, SCREEN_WIDTH / SCREEN_HEIGHT, 2, 4000 );
  camera.position.set( -1262, 260, 313);
  controls = new FirstPersonControls(camera);
  controls.lookSpeed = 0.065;
  controls.movementSpeed = 66;
  controls.enabled = true;
  controls.mouseMotionActive = false;

  // SCENE (FINAL)
  scene = new THREE.Scene();
  // scene.background = new THREE.Color(0x191970)
  manager = new THREE.LoadingManager();
  loader = new GLTFLoader(manager);
  objLoader = new OBJLoader();

  // LIGHTS
  scene.add( new THREE.AmbientLight( 0x111111, 5 ) );
  directionalLight = new THREE.DirectionalLight( 0xffffff, 1.15 );
  directionalLight.position.set( 500, 2000, 0 );
  scene.add( directionalLight );
  pointLight = new THREE.PointLight( 0xff4400, 1.5 );
  pointLight.position.set( 0, 0, 0 );
  scene.add( pointLight );

  // HEIGHT + NORMAL MAPS
  let normalShader = NormalMapShader;
  let rx = 256, ry = 256;
  let pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat };
  heightMap = new THREE.WebGLRenderTarget( rx, ry, pars );
  heightMap.texture.generateMipmaps = false;
  normalMap = new THREE.WebGLRenderTarget( rx, ry, pars );
  normalMap.texture.generateMipmaps = false;
  uniformsNoise = {
    time: { value: 0.0 },
    scale: { value: new THREE.Vector2( 0.7, 0.7 ) },
    offset: { value: new THREE.Vector2( -1.3, -1.3 ) }
  };
  uniformsNormal = THREE.UniformsUtils.clone( normalShader.uniforms );
  uniformsNormal.height.value = 0.1;
  uniformsNormal.resolution.value.set( rx, ry );
  uniformsNormal.heightMap.value = heightMap.texture;
  let vertexShader = SHADERS[ 'vertexShader' ];

  // TEXTURES
  let loadingManager = new THREE.LoadingManager( function () {
    terrain.visible = true;
  });
  let textureLoader = new THREE.TextureLoader( loadingManager );
  let specularMap = new THREE.WebGLRenderTarget( 1024, 1024, pars );
  specularMap.texture.generateMipmaps = false;
  let diffuseTexture1 = textureLoader.load( assetPath7("textures/terrain/sand-big-saturated-purple.jpg") );
  let diffuseTexture2 = textureLoader.load( assetPath7("textures/terrain/backgrounddetailed6.jpg") );
  let detailTexture = textureLoader.load( assetPath7("textures/terrain/TexturesCom_DesertSand3_2x2_512_normal.jpg") );
  diffuseTexture1.wrapS = diffuseTexture1.wrapT = THREE.RepeatWrapping;
  diffuseTexture2.wrapS = diffuseTexture2.wrapT = THREE.RepeatWrapping;
  detailTexture.wrapS = detailTexture.wrapT = THREE.RepeatWrapping;
  specularMap.texture.wrapS = specularMap.texture.wrapT = THREE.RepeatWrapping;

  // TERRAIN SHADER
  let terrainShader = ShaderTerrain[ "terrain" ];
  uniformsTerrain = THREE.UniformsUtils.clone( terrainShader.uniforms );
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
  for ( var i = 0; i < params.length; i ++ ) {
    var material = new THREE.ShaderMaterial( {
      uniforms: params[ i ][ 3 ],
      vertexShader: params[ i ][ 2 ],
      fragmentShader: params[ i ][ 1 ],
      lights: params[ i ][ 4 ],
      fog: true
    } );
    mlib[ params[ i ][ 0 ] ] = material;
  }
  let plane = new THREE.PlaneBufferGeometry( SCREEN_WIDTH, SCREEN_HEIGHT );
  quadTarget = new THREE.Mesh( plane, new THREE.MeshBasicMaterial( { color: 0x000000 } ) );
  quadTarget.position.z = - 500;
  sceneRenderTarget.add( quadTarget );

  // TERRAIN MESH
  let geometryTerrain = new THREE.PlaneBufferGeometry( 4500, 4500, 512, 512 );
  BufferGeometryUtils.computeTangents( geometryTerrain );
  terrain = new THREE.Mesh( geometryTerrain, mlib[ 'terrain' ] );
  terrain.position.set( -600, -125, 0 );
  terrain.rotation.x = - Math.PI / 2;
  terrain.visible = false;
  scene.add( terrain );

  // UNIVERSE
  backgroundImage = loadImage({
    geometry: new THREE.SphereBufferGeometry(3000, 32, 32),
    url: assetPath7('images/background-okeefe-edited-long.jpg'),
    name: 'background',
    position: [ -1262, 260, 313],
    invert: true,
    rotateY: 180,
    transparent: true,
    opacity: 0.1
  })
  backgroundImage.material.map.repeat.set(3, 1);
  scene.add( backgroundImage );


  const renderGLTF = (gltfObj) => {
    gltfObj.scene.updateMatrixWorld();
    gltfObjects[gltfObj.name] = gltfObj;
    scene.add(gltfObj.scene);
    return gltfObj;
  }

  const renderBalloon = (obj) => {
    obj.updateMatrixWorld();
    balloons.push(obj);
    scene.add(obj);
    return obj;
  }

  // HOURGLASS
  loadGLTF({
    url: assetPath7("objects/hourglass_and_stars.gltf"),
    name: "hourglass",
    position: [0, 420, 340],
    rotateX: 0,
    rotateY: 3,
    rotateZ: 0,
    relativeScale: 20,
    loader: loader,
    onSuccess: renderGLTF,
  });

  // Lava Lamp
  loadGLTF({
    url: assetPath7("objects/lava_lamp2.gltf"),
    name: "lava_lamp",
    position: [-200, 285, 700],
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    relativeScale: 20,
    loader: loader,
    onSuccess: renderGLTF,
  });


  // HAND MIRROR
  loadGLTF({
    url: assetPath7("objects/enchanted_mirror/scene.gltf"),
    name: "hand_mirror",
    position: [-175, 1000, 340],
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    relativeScale: 0.45,
    loader: loader,
    onSuccess: renderGLTF
  });


  // RUBINS VASE
  loadGLTF({
    url: assetPath7('objects/rubins_vase.gltf'),
    name: 'rubins_vase',
    position: [-175, 330, -50],
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    relativeScale: 23,
    loader: loader,
    onSuccess: renderGLTF,
  });

  // BALLOONS
  for (let i=0; i < numBalloons; i++) {
    loadOBJ({
      url: assetPath7('objects/red_balloon/Red_Balloon_with_Ribbon_convert.obj'),
      name: `balloon_${i}`,
      position: [ -3200 + i * 50, 500 + i * 50 , 313 + i * 50],
      rotateX: 90,
      rotateY: 0,
      rotateZ: 0,
      relativeScale: 0.75,
      loader: objLoader,
      onSuccess: renderBalloon
    })
  }

  // RENDERER
  renderer = new THREE.WebGLRenderer( { alpha:true } );
  renderer.setClearColor( 0x000000, 0 );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
  container.appendChild( renderer.domElement );

  // EVENTS
  onWindowResize();
  window.addEventListener( 'resize', onWindowResize, false );
}

const rotateAboutPoint = (obj, point, axis, theta, pointIsWorld) => {
  pointIsWorld = (pointIsWorld === undefined) ? false : pointIsWorld;
  if (pointIsWorld) {
    obj.parent.localToWorld(obj.position); // compensate for world coordinate
  }
  obj.position.sub(point); // remove the offset
  obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
  obj.position.add(point); // re-add the offset
  if (pointIsWorld) {
    obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
  }
  obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}

const updateBalloons = () => {
  balloons.forEach( balloon => {
    if (balloon !== undefined) {
      let point = new THREE.Vector3( -1262, 260, 313);
      balloon.rotateOnAxis(balloonAxis, balloonRad);
      rotateAboutPoint(
        balloon,
        point,
        balloonOrbitAxis,
        balloonOrbitTheta,
        true);
    }
  });
}

const updateJupiter = () => {
  if (gltfObjects['jupiter'] !== undefined) {
    let point = new THREE.Vector3( -1262, 260, 313);
    rotateAboutPoint(
      gltfObjects['jupiter'].scene,
      point,
      jupiterOrbitAxis,
      jupiterOrbitTheta,
      false);
  }
}

//
const onWindowResize = () => {
  SCREEN_WIDTH = window.innerWidth;
  SCREEN_HEIGHT = window.innerHeight;
  renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
  camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
  camera.updateProjectionMatrix();
}

//
const animate = () => {
  requestAnimationFrame( animate );
  render();
}

const render = () => {
  let delta = clock.getDelta();
  if ( terrain.visible ) {
    let fLow = 0.1, fHigh = 0.8;
    lightVal = THREE.Math.clamp( lightVal + 0.5 * delta * lightDir, fLow, fHigh );
    let valNorm = ( lightVal - fLow ) / ( fHigh - fLow );
    directionalLight.intensity = THREE.Math.mapLinear( valNorm, 0, 1, 0.1, 1.15 );
    pointLight.intensity = THREE.Math.mapLinear( valNorm, 0, 1, 0.9, 1.5 );
    uniformsTerrain[ 'uNormalScale' ].value = THREE.Math.mapLinear( valNorm, 0, 1, 0.6, 3.5 );
    if ( updateNoise ) {
      animDelta = THREE.Math.clamp( animDelta + 0.00075 * animDeltaDir, 0, 0.05 );
      uniformsNoise[ 'time' ].value += delta * animDelta;
      uniformsNoise[ 'offset' ].value.x += delta * 0.05;
      uniformsTerrain[ 'uOffset' ].value.x = 4 * uniformsNoise[ 'offset' ].value.x;
      quadTarget.material = mlib[ 'heightmap' ];
      renderer.render( sceneRenderTarget, cameraOrtho, heightMap, true );
      quadTarget.material = mlib[ 'normal' ];
      renderer.render( sceneRenderTarget, cameraOrtho, normalMap, true );
    }
    if (gltfObjects['hourglass'] !== undefined) {
      gltfObjects['hourglass'].scene.rotateOnAxis(hourglassAxis, hourglassRad);
    }
    if (gltfObjects['lava_lamp'] !== undefined) {
      gltfObjects['lava_lamp'].scene.rotateOnAxis(lavaLampAxis, lavaLampRad);
    }
      if (gltfObjects['hand_mirror'] !== undefined) {
      gltfObjects['hand_mirror'].scene.rotateOnAxis(handMirrorAxis, handMirrorRad);
    }
    if (gltfObjects['rubins_vase'] !== undefined) {
      gltfObjects['rubins_vase'].scene.rotateOnAxis(vaseAxis, vaseRad);
    }
    if (gltfObjects['lava_lamp'] !== undefined) {
      gltfObjects['lava_lamp'].scene.rotateOnAxis(lavaLampAxis, lavaLampRad);
    }
    if (backgroundImage !== undefined ) {
      backgroundImage.rotateOnAxis(backgroundAxis, backgroundRad);
    }
    if (lavaLampMixer !== undefined) {
      lavaLampMixer.update(delta);
    }
    updateBalloons();
    // updateJupiter();
    controls.update(delta);
    renderer.render( scene, camera );
  }
}

export const renderScene = (container) => {
  init(container);
  animate();
}