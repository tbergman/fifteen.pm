import * as THREE from "three";
import {OrbitControls} from "../../Utils/OrbitControls";
import {FirstPersonControls} from '../../Utils/FirstPersonControls';
import {BufferGeometryUtils} from "../../Utils/BufferGeometryUtils";
import {ShaderTerrain} from "../../Utils/ShaderTerrain";
import {NormalMapShader} from "../../Utils/NormalMapShader";
import {CONSTANTS} from "./constants";
import {SHADERS} from "./shaders"
import GLTFLoader from "three-gltf-loader";
import {loadGLTF} from "../../Utils/Loaders";
import {assetPath} from "../../Utils/assets";

const assetPath7 = (p) => {
  return assetPath("7/" + p);
}

let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;
let renderer, container, stats;
let camera, scene, controls;
let manager, loader;
let cameraOrtho, sceneRenderTarget;
let uniformsNoise, uniformsNormal, uniformsTerrain,
  heightMap, normalMap,
  quadTarget;
let directionalLight, pointLight;
let terrain;
let animDelta = 0, animDeltaDir = 1;
let lightVal = 0, lightDir = 1;
let clock = new THREE.Clock();
let updateNoise = true;
let hourglassAxis = new THREE.Vector3(0, 1, 0);
let hourglassRad = 0.02;
let gltfObjects = {};
let mlib = {};

export const renderScene = (container) => {

  init();
  animate();

  function init() {
    // SCENE (RENDER TARGET)
    sceneRenderTarget = new THREE.Scene();
    cameraOrtho = new THREE.OrthographicCamera( SCREEN_WIDTH / - 2, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, SCREEN_HEIGHT / - 2, - 10000, 10000 );
    cameraOrtho.position.z = 50;
    cameraOrtho.position.y = 40;
    sceneRenderTarget.add( cameraOrtho );
    // CAMERA
    camera = new THREE.PerspectiveCamera( 40, SCREEN_WIDTH / SCREEN_HEIGHT, 2, 4000 );
    camera.position.set( -1462, 252, 313);
    controls = new FirstPersonControls(camera);
    controls.lookSpeed = 0.13;
    controls.movementSpeed = 133;
    controls.enabled = true;
    controls.mouseMotionActive = false;

    // SCENE (FINAL)
    scene = new THREE.Scene();
    manager = new THREE.LoadingManager();
    loader = new GLTFLoader(manager);
    scene.background = new THREE.Color( 0x000000 );
    scene.fog = new THREE.Fog( 0x000000, 2000, 4000 );

    // LIGHTS
    scene.add( new THREE.AmbientLight( 0x111111, 5 ) );
    directionalLight = new THREE.DirectionalLight( 0xffffff, 1.15 );
    directionalLight.position.set( 500, 2000, 0 );
    scene.add( directionalLight );
    pointLight = new THREE.PointLight( 0xff4400, 1.5 );
    pointLight.position.set( 0, 0, 0 );
    scene.add( pointLight );

    // HEIGHT + NORMAL MAPS
    var normalShader = NormalMapShader;
    var rx = 256, ry = 256;
    var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat };
    heightMap = new THREE.WebGLRenderTarget( rx, ry, pars );
    heightMap.texture.generateMipmaps = false;
    normalMap = new THREE.WebGLRenderTarget( rx, ry, pars );
    normalMap.texture.generateMipmaps = false;
    uniformsNoise = {
      time: { value: 1.0 },
      scale: { value: new THREE.Vector2( 1.5, 1.5 ) },
      offset: { value: new THREE.Vector2( 0, 0 ) }
    };
    uniformsNormal = THREE.UniformsUtils.clone( normalShader.uniforms );
    uniformsNormal.height.value = 0.05;
    uniformsNormal.resolution.value.set( rx, ry );
    uniformsNormal.heightMap.value = heightMap.texture;
    var vertexShader = SHADERS[ 'vertexShader' ];
    // TEXTURES
    var loadingManager = new THREE.LoadingManager( function () {
      terrain.visible = true;
    } );
    var textureLoader = new THREE.TextureLoader( loadingManager );
    var specularMap = new THREE.WebGLRenderTarget( 2048, 2048, pars );
    specularMap.texture.generateMipmaps = false;
    var diffuseTexture1 = textureLoader.load( assetPath7("textures/terrain/sand-big.jpg"));
    var diffuseTexture2 = textureLoader.load( assetPath7("textures/terrain/backgrounddetailed6.jpg"));
    var detailTexture = textureLoader.load( assetPath7("textures/terrain/grasslight-big-nm.jpg"));
    diffuseTexture1.wrapS = diffuseTexture1.wrapT = THREE.RepeatWrapping;
    diffuseTexture2.wrapS = diffuseTexture2.wrapT = THREE.RepeatWrapping;
    detailTexture.wrapS = detailTexture.wrapT = THREE.RepeatWrapping;
    specularMap.texture.wrapS = specularMap.texture.wrapT = THREE.RepeatWrapping;
    // TERRAIN SHADER
    var terrainShader = ShaderTerrain[ "terrain" ];
    uniformsTerrain = THREE.UniformsUtils.clone( terrainShader.uniforms );
    uniformsTerrain[ 'tNormal' ].value = normalMap.texture;
    uniformsTerrain[ 'uNormalScale' ].value = 3.5;
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
    uniformsTerrain[ 'shininess' ].value = 30;
    uniformsTerrain[ 'uDisplacementScale' ].value = 375;
    uniformsTerrain[ 'uRepeatOverlay' ].value.set( 6, 6 );
    var params = [
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
    var plane = new THREE.PlaneBufferGeometry( SCREEN_WIDTH, SCREEN_HEIGHT );
    quadTarget = new THREE.Mesh( plane, new THREE.MeshBasicMaterial( { color: 0x000000 } ) );
    quadTarget.position.z = - 500;
    sceneRenderTarget.add( quadTarget );
    // TERRAIN MESH
    var geometryTerrain = new THREE.PlaneBufferGeometry( 6000, 6000, 256, 256 );
    BufferGeometryUtils.computeTangents( geometryTerrain );
    terrain = new THREE.Mesh( geometryTerrain, mlib[ 'terrain' ] );
    terrain.position.set( 0, - 125, 0 );
    terrain.rotation.x = - Math.PI / 2;
    terrain.visible = false;
    scene.add( terrain );

    // HOURGLASS

    let hourglassPath = assetPath7("objects/hourglass_and_stars.gltf");

    function renderHourglass(gltfObj) {
      gltfObj.scene.updateMatrixWorld();
      gltfObj.scene.position
      gltfObjects['hourglass'] = gltfObj;
      scene.add(gltfObj.scene);
      return gltfObj;
    }

    let hourglassLoadGLTFParams = {
      url: hourglassPath,
      name: "hourglass",
      position: [-400, 290, 150],
      rotateX: 0,
      rotateY: -33,
      rotateZ: 0,
      relativeScale: 19,
      loader: loader,
      onSuccess: renderHourglass,
    }
    loadGLTF(hourglassLoadGLTFParams);

    // RENDERER
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    container.appendChild( renderer.domElement );

    // EVENTS
    onWindowResize();
    window.addEventListener( 'resize', onWindowResize, false );
  }
  //
  function onWindowResize() {
    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;
    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    camera.updateProjectionMatrix();
  }
  //
  function animate() {
    requestAnimationFrame( animate );
    render();
  }
  function render() {
    var delta = clock.getDelta();
    if ( terrain.visible ) {
      var fLow = 0.1, fHigh = 0.8;
      lightVal = THREE.Math.clamp( lightVal + 0.5 * delta * lightDir, fLow, fHigh );
      var valNorm = ( lightVal - fLow ) / ( fHigh - fLow );
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
        gltfObjects['hourglass'].scene.rotateOnAxis(hourglassAxis, hourglassRad)
      }
      controls.update(delta);
      renderer.render( scene, camera );
    }
  }

}