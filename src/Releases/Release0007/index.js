import React, {Component, Fragment} from 'react';
import '../Release.css';
import * as THREE from "three";
import {OrbitControls} from "../../Utils/OrbitControls";
import {BufferGeometryUtils} from "../../Utils/BufferGeometryUtils";
import {ShaderTerrain} from "../../Utils/ShaderTerrain";
import {NormalMapShader} from "../../Utils/NormalMapShader";
import {CONSTANTS} from "./constants";
import {SHADERS} from "./shaders"
import Footer from '../../Footer';
import GLTFLoader from "three-gltf-loader";
import {loadGLTF} from "../../Utils/Loaders";
import {assetPath} from "../../Utils/assets";
import {CONTENT} from "../../Content";


export const assetPath7 = (p) => {
  return assetPath("7/" + p);
}

class Release0007 extends Component {
  state = {
    terrainVisible: false
  }

  init = () => {
    this.time = 0;
    this.startTime = Date.now();
    this.clock = new THREE.Clock();
    // this.manager = new THREE.LoadingManager();
    // this.loader = new GLTFLoader(this.manager);
    // this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color(0x000000);
    // // Store the position of the mouse
    // // Default is center of the screen
    // this.mouse = {
    //   position: new THREE.Vector2(0, 0),
    //   target: new THREE.Vector2(0, 0)
    // };

    // // Add Lights
    // const light1  = new THREE.AmbientLight(0x111111, 10);
    // light1.name = 'ambient_light';
    // this.scene.add( light1 );

    // const light2  = new THREE.DirectionalLight(0x111111, 10);
    // light2.position.set(0.5, 0, 0.866); // ~60º
    // light2.name = 'main_light';
    // this.scene.add( light2 );

    // this.createHourglass();
    // this.renderer = new THREE.WebGLRenderer({antialias: true});
    // this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.renderer.setPixelRatio(window.devicePixelRatio);
    // this.container.appendChild(this.renderer.domElement);
    // this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    // this.controls.maxDistance = 1500;
    // this.controls.autoRotate = false;
    // this.controls.autoRotateSpeed = -10;
    // this.controls.screenSpacePanning = true;

    // Parameters
    this.textureCounter = 0;
    this.animDelta = 0;
    this.animDeltaDir = -1;
    this.lightVal = 0;
    this.lightDir = 1;
    this.fLow = 0.1
    this.fHigh = 0.8;
    this.updateNoise = true;
    this.animateTerrain = false;
    this.mlib = {};

    // SCENE (RENDER TARGET)

    this.sceneRenderTarget = new THREE.Scene();
    this.cameraOrtho = new THREE.OrthographicCamera( CONSTANTS.ww / - 2, CONSTANTS.ww / 2, CONSTANTS.wh / 2, CONSTANTS.wh / - 2, -10000, 10000 );
    this.cameraOrtho.position.z = 100;
    this.sceneRenderTarget.add( this.cameraOrtho );

    // CAMERA

    this.camera = new THREE.PerspectiveCamera( 40, CONSTANTS.ww / CONSTANTS.wh, 2, 4000 );
    this.camera.position.set( -1200, 800, 1200 );
    this.controls = new OrbitControls( this.camera );
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.8;
    this.controls.keys = [ 65, 83, 68 ];

    // SCENE (FINAL)

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0x050505 );
    this.scene.fog = new THREE.Fog( 0x050505, 2000, 4000 );

    // LIGHTS

    this.scene.add( new THREE.AmbientLight( 0x111111 ) );
    this.directionalLight = new THREE.DirectionalLight( 0xffffff, 1.15 );
    this.directionalLight.position.set( 500, 2000, 0 );
    this.scene.add( this.directionalLight );
    this.pointLight = new THREE.PointLight( 0xff4400, 1.5 );
    this.pointLight.position.set( 0, 0, 0 );
    this.scene.add( this.pointLight );

    // HEIGHT + NORMAL MAPS

    this.normalShader = NormalMapShader;

    let rx = 256, ry = 256;
    let pars = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat
    };

    this.heightMap  = new THREE.WebGLRenderTarget( rx, ry, pars );
    this.heightMap.texture.generateMipmaps = false;
    this.normalMap = new THREE.WebGLRenderTarget( rx, ry, pars );
    this.normalMap.texture.generateMipmaps = false;
    this.uniformsNoise = {
      time:   { value: 1.0 },
      scale:  { value: new THREE.Vector2( 1.5, 1.5 ) },
      offset: { value: new THREE.Vector2( 0, 0 ) }
    };
    this.uniformsNormal = THREE.UniformsUtils.clone( this.normalShader.uniforms );
    this.uniformsNormal.height.value = 0.05;
    this.uniformsNormal.resolution.value.set( rx, ry );
    this.uniformsNormal.heightMap.value = this.heightMap.texture;
    this.vertexShader = SHADERS.vertexShader;

    // TEXTURES

    this.loadingManager = new THREE.LoadingManager();
    this.loadingManager.onLoad = () => {
      this.setState({terrainVisible: true});
    };
    this.textureLoader = new THREE.TextureLoader( this.loadingManager );

    this.specularMap = new THREE.WebGLRenderTarget( 2048, 2048, pars );
    this.specularMap.texture.generateMipmaps = false;

    this.diffuseTexture1 = this.textureLoader.load(assetPath7("textures/terrain/grasslight-big.jpg"));
    this.diffuseTexture2 = this.textureLoader.load(assetPath7("textures/terrain/backgrounddetailed6.jpg" ));
    this.detailTexture = this.textureLoader.load(assetPath7("textures/terrain/grasslight-big-nm.jpg" ));

    this.diffuseTexture1.wrapS = this.diffuseTexture1.wrapT = THREE.RepeatWrapping;
    this.diffuseTexture2.wrapS = this.diffuseTexture2.wrapT = THREE.RepeatWrapping;
    this.detailTexture.wrapS = this.detailTexture.wrapT = THREE.RepeatWrapping;
    this.specularMap.texture.wrapS = this.specularMap.texture.wrapT = THREE.RepeatWrapping;

    // TERRAIN SHADER

    this.terrainShader = ShaderTerrain[ "terrain" ];
    this.uniformsTerrain = THREE.UniformsUtils.clone( this.terrainShader.uniforms );
    this.uniformsTerrain[ 'tNormal' ].value = this.normalMap.texture;
    this.uniformsTerrain[ 'uNormalScale' ].value = 3.5;
    this.uniformsTerrain[ 'tDisplacement' ].value = this.heightMap.texture;
    this.uniformsTerrain[ 'tDiffuse1' ].value = this.diffuseTexture1;
    this.uniformsTerrain[ 'tDiffuse2' ].value = this.diffuseTexture2;
    this.uniformsTerrain[ 'tSpecular' ].value = this.specularMap.texture;
    this.uniformsTerrain[ 'tDetail' ].value = this.detailTexture;
    this.uniformsTerrain[ 'enableDiffuse1' ].value = true;
    this.uniformsTerrain[ 'enableDiffuse2' ].value = true;
    this.uniformsTerrain[ 'enableSpecular' ].value = true;
    this.uniformsTerrain[ 'diffuse' ].value.setHex( 0xffffff );
    this.uniformsTerrain[ 'specular' ].value.setHex( 0xffffff );
    this.uniformsTerrain[ 'shininess' ].value = 30;
    this.uniformsTerrain[ 'uDisplacementScale' ].value = 375;
    this.uniformsTerrain[ 'uRepeatOverlay' ].value.set( 6, 6 );

    // TERRAIN SHADER MATERIALS

    this.materialParams = [
      [ 'heightmap',  SHADERS.fragmentShaderNoise,   this.vertexShader, this.uniformsNoise, false ],
      [ 'normal',   this.normalShader.fragmentShader,  this.normalShader.vertexShader, this.uniformsNormal, false ],
      [ 'terrain',  this.terrainShader.fragmentShader, this.terrainShader.vertexShader, this.uniformsTerrain, true ]
     ];

    for ( let i = 0; i < this.materialParams.length; i ++ ) {
      let material = new THREE.ShaderMaterial( {
        uniforms:     this.materialParams[ i ][ 3 ],
        vertexShader:   this.materialParams[ i ][ 2 ],
        fragmentShader: this.materialParams[ i ][ 1 ],
        lights:     this.materialParams[ i ][ 4 ],
        fog:      true
        } );
      this.mlib[ this.materialParams[ i ][ 0 ] ] = material;
    }

    this.plane = new THREE.PlaneBufferGeometry( CONSTANTS.ww, CONSTANTS.wh );
    this.quadTarget = new THREE.Mesh( this.plane, new THREE.MeshBasicMaterial( { color: 0x000000 } ) );
    this.quadTarget.position.z = -500;
    this.sceneRenderTarget.add( this.quadTarget );

    // TERRAIN MESH

    this.geometryTerrain = new THREE.PlaneBufferGeometry( 6000, 6000, 256, 256 );
    BufferGeometryUtils.computeTangents( this.geometryTerrain );
    this.terrain = new THREE.Mesh( this.geometryTerrain, this.mlib[ 'terrain' ] );
    this.terrain.position.set( 0, -125, 0 );
    this.terrain.rotation.x = -Math.PI / 2;
    this.terrain.visible = false;
    this.scene.add( this.terrain );

    console.log(this.terrain);

    // RENDERER

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio( CONSTANTS.pxr );
    this.renderer.setSize( CONSTANTS.ww, CONSTANTS.wh );
    this.container.appendChild( this.renderer.domElement );

  }

  createHourglass() {
    const hourglassPath = assetPath7("objects/hourglass_and_stars.gltf");
    const renderHourglass = gltfObj => this.renderHourglass(gltfObj);
    this.hourglassGroup = new THREE.Group();

    const hourglassLoadGLTFParams = {
      url: hourglassPath,
      name: "hourglass",
      position: [0, 0, 0],
      rotateX: 0,
      rotateY: -33,
      rotateZ: 0,
      relativeScale: 1,
      loader: this.loader,
      onSuccess: renderHourglass,
    }
    loadGLTF({...hourglassLoadGLTFParams});
  }

  renderHourglass = (gltfObj) => {
    gltfObj.scene.updateMatrixWorld();
    this.scene.add(gltfObj.scene);
    return gltfObj;
  }

  onResize = () => {
    // Update camera aspect
    this.camera.aspect = CONSTANTS.ww / CONSTANTS.wh;
    // Reset aspect of the camera
    this.camera.updateProjectionMatrix();
    // Update size of the canvas
    this.renderer.setSize(CONSTANTS.ww, CONSTANTS.wh);
  };

  animate = () => {
    this.frameId = window.requestAnimationFrame(this.animate);
    let time = Date.now();
    let delta = time - this.startTime;
    this.controls.update(delta);
    this.renderScene();
  }

  renderScene = () => {
    let delta = this.clock.getDelta();
    if ( this.state.terrainVisible ) {
      this.lightVal = THREE.Math.clamp( this.lightVal + 0.5 * delta * this.lightDir, this.fLow, this.fHigh );
      let valNorm = ( this.lightVal - this.fLow ) / ( this.fHigh - this.fLow );
      this.scene.background.setHSL( 0.1, 0.5, this.lightVal );
      this.scene.fog.color.setHSL( 0.1, 0.5, this.lightVal );
      this.directionalLight.intensity = THREE.Math.mapLinear( valNorm, 0, 1, 0.1, 1.15 );
      this.pointLight.intensity = THREE.Math.mapLinear( valNorm, 0, 1, 0.9, 1.5 );
      this.uniformsTerrain[ 'uNormalScale' ].value = THREE.Math.mapLinear( valNorm, 0, 1, 0.6, 3.5 );
      if ( this.updateNoise ) {
        this.animDelta = THREE.Math.clamp( this.animDelta + 0.00075 * this.animDeltaDir, 0, 0.05 );
        this.uniformsNoise[ 'time' ].value += delta * this.animDelta;
        this.uniformsNoise[ 'offset' ].value.x += delta * 0.05;
        this.uniformsTerrain[ 'uOffset' ].value.x = 4 * this.uniformsNoise[ 'offset' ].value.x;
        this.quadTarget.material = this.mlib[ 'heightmap' ];
        this.renderer.render( this.sceneRenderTarget, this.cameraOrtho, this.heightMap, true );
        this.quadTarget.material = this.mlib[ 'normal' ];
        this.renderer.render( this.sceneRenderTarget, this.cameraOrtho, this.normalMap, true );
      }
      this.renderer.render( this.scene, this.camera );
    }
  }

  componentDidMount = () => {
    this.init();
    window.addEventListener("resize", this.onResize, false);
    window.addEventListener("resize", this.onResize, false);
    this.animate();
  }

  render = () => {
    return (
    <div>
      <Fragment>
        <div ref={element => this.container = element}/>
        <Footer
          content={CONTENT[window.location.pathname]}
          fillColor="white"
          audioRef={el => this.audioElement = el}
        />
      </Fragment>
    </div>
    );
  }
}

export default Release0007;
