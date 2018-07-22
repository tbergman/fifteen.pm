import React, {PureComponent, Fragment} from 'react';
import * as THREE from "three";
import {SimplexNoise} from '../Utils/SimplexNoise';
import {GPUComputationRenderer} from "../Utils/GPUComputationRenderer";
import debounce from 'lodash/debounce';
import './Release.css';
import Player from '../Player';
import Purchase from '../Purchase';
import {isFirefox, isChrome} from '../Utils/BrowserDetection';
/* eslint import/no-webpack-loader-syntax: off */
// import heightMapFragmentShader from '../Utils/Shaders/heightMapFragmentShader.glsl'

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const WATER_WIDTH = 128;
const WATER_BOUNDS = 512;
const lightColor1 = 0xFDB813;
const lightIntensity1 = 0.9;
const lightColor2 = 0xFFFFFF;
const lightIntensity2 = 0.6;
const clearColor = 0xFFFFFF;
const ambientLightColor = 0xFFFFFF;
const waterColor = 0x0f5e9c;
const waterSpecularColor = 0x111111;

class Release0001 extends PureComponent {
  constructor() {
    super();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 1, 3000);
    this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    // this.meshBasicMaterial = new THREE.MeshBasicMaterial({color: 0xff00ff});
    this.mouseCoords = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.shaderMaterial = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([
        THREE.ShaderLib['phong'].uniforms,
        {
          heightmap: {value: null}
        }
      ]),
      vertexShader: document.getElementById('waterVertexShader').textContent,
      fragmentShader: THREE.ShaderChunk['meshphong_frag'],
      transparent: true,
    });
    this.shaderMaterial.color = new THREE.Color(waterColor);
    this.shaderMaterial.specular = new THREE.Color(waterSpecularColor);
    this.geometry = new THREE.PlaneBufferGeometry(WATER_BOUNDS, WATER_BOUNDS, WATER_WIDTH - 1, WATER_WIDTH - 1);
    this.waterMesh = new THREE.Mesh(this.geometry, this.shaderMaterial);
    this.geometryRay = new THREE.PlaneBufferGeometry(WATER_BOUNDS, WATER_BOUNDS, 1, 1);
    this.meshRay = new THREE.Mesh(this.geometryRay, new THREE.MeshBasicMaterial({color: 0xFFFFFF, visible: false}));

    this.gpuCompute = new GPUComputationRenderer(WATER_WIDTH, WATER_WIDTH, this.renderer);
    this.mousePos = new THREE.Vector2(10000, 10000);
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.audioAnalyser = this.audioCtx.createAnalyser();
    this.freqArray = new Uint8Array(this.audioAnalyser.frequencyBinCount);
    this.light = new THREE.PointLight(0xff0000, 4, 100);
    this.sun = new THREE.DirectionalLight(lightColor1, lightIntensity1);
    this.sun2 = new THREE.DirectionalLight(lightColor2, lightIntensity2);
    this.ambientLight = new THREE.AmbientLight(ambientLightColor);
    this.heightmap0 = this.gpuCompute.createTexture();
    //this.smoothShader = this.gpuCompute.createShaderMaterial(document.getElementById('smoothFragmentShader').textContent, {texture: {value: null}});
    this.simplex = new SimplexNoise();
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.onDocumentMouseMove, false);
    window.addEventListener("touchstart", this.onDocumentMouseMove, false);
    window.addEventListener("touchmove", this.onDocumentMouseMove, false);
    window.addEventListener('resize', this.onWindowResize, false);
    this.init();
    this.animate();
  }

  componentWillUnmount() {
    this.stop();
    window.removeEventListener('mousemove', this.onDocumentMouseMove, false);
    window.removeEventListener('resize', this.onWindowResize, false);
    window.removeEventListener("touchstart", this.onDocumentMouseMove, false);
    window.removeEventListener("touchmove", this.onDocumentMouseMove, false);
    this.mount.removeChild(this.renderer.domElement);
  }

  onWindowResize = debounce(() => {
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;
    this.renderer.setSize(WIDTH, HEIGHT);
  }, 100);

  setMouseCoords = (x, y) => {
    this.mouseCoords.set((x / this.renderer.domElement.clientWidth) * 2 - 1, -(y / this.renderer.domElement.clientHeight) * 2 + 1);
    this.mouseMoved = true;
  }

  onDocumentMouseMove = (event) => {
    if (event.touches) {
        this.setMouseCoords(event.touches[0].clientX, event.touches[0].clientY);
    } else {
        this.setMouseCoords(event.clientX, event.clientY);
    }
  };

  init = () => {
    const {camera, renderer} = this;

    camera.position.set(0, 150, 0);
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(clearColor, 1); // the default
    renderer.setPixelRatio(window.devicePixelRatio);

    this.addSun();
    this.addAmbientLight();
    this.addWater();
    this.addLight();
    this.addAudio();

    this.mount.appendChild(this.renderer.domElement);
  }

  stop = () => {
    cancelAnimationFrame(this.frameId);
  }

  addWater = () => {
    const {shaderMaterial, waterMesh, gpuCompute, scene, meshRay, mousePos, heightmap0} = this;
    const waterShininess = 60;
    const waterOpacity = 0.5;

    // material: make a ShaderMaterial clone of MeshPhongMaterial, with customized vertex shader
    shaderMaterial.lights = true;
    shaderMaterial.shininess = waterShininess;

    // Sets the uniforms with the material values
    shaderMaterial.uniforms.diffuse.value = shaderMaterial.color;
    shaderMaterial.uniforms.specular.value = shaderMaterial.specular;
    shaderMaterial.uniforms.shininess.value = Math.max(shaderMaterial.shininess, 1e-4);
    shaderMaterial.uniforms.transparency = true;
    shaderMaterial.uniforms.opacity.value = waterOpacity;//material.opacity;

    // Defines
    shaderMaterial.defines.WIDTH = WATER_WIDTH.toFixed(1);
    shaderMaterial.defines.BOUNDS = WATER_BOUNDS.toFixed(1);

    this.waterUniforms = shaderMaterial.uniforms;

    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.matrixAutoUpdate = false;
    waterMesh.updateMatrix();
    scene.add(waterMesh);

    // Mesh just for mouse raycasting
    meshRay.rotation.x = -Math.PI / 2;
    meshRay.matrixAutoUpdate = false;
    meshRay.updateMatrix();
    scene.add(meshRay);

    this.fillTexture(heightmap0);

    this.heightmapVariable = this.gpuCompute.addVariable("heightmap", document.getElementById('heightmapFragmentShader').textContent, heightmap0);

    // this.heightmapVariable = this.gpuCompute.addVariable("heightmap",heightMapFragmentShader, heightmap0);

    this.gpuCompute.setVariableDependencies(this.heightmapVariable, [this.heightmapVariable]);

    this.heightmapVariable.material.uniforms.mousePos = {value: mousePos};
    this.heightmapVariable.material.uniforms.mouseSize = {value: 20.0};
    this.heightmapVariable.material.uniforms.viscosityConstant = {value: 0.03};
    this.heightmapVariable.material.defines.BOUNDS = WATER_BOUNDS.toFixed(1);

    var error = gpuCompute.init();
    if (error !== null) {
      console.error(error);
    }
  }

  addAudio = () => {
    window.onload = () => {
      if (isFirefox === true) {
        this.audioStream = this.audioElement.mozCaptureStream();
      } else if (isChrome) {
        this.audioStream = this.audioElement.captureStream();
      }

      if (this.audioStream !== undefined) {
        if (isChrome) {
            this.audioStream.onactive = () => {
                this.createAudioSource();
            };
        }
        else {
            this.createAudioSource();
        }
      }
    }
  }

  createAudioSource = () => {
    let source = this.audioCtx.createMediaStreamSource(this.audioStream);
    source.connect(this.audioAnalyser);
    source.connect(this.audioCtx.destination);
  }

  addSun = () => {
    const {sun, sun2, scene} = this;
    sun.position.set(300, 400, 175);
    scene.add(sun);

    sun2.position.set(-100, 350, -200);
    scene.add(sun2);
  }

  addAmbientLight = () => {
    const {ambientLight, scene} = this;
    // two lights, an ambient to mimic reflected light
    // on the back side of the box as it passes in front of the light
    ambientLight.position.set(20, -1, 0);
    scene.add(ambientLight);
  }

  addLight = () => {
    const {light, scene, camera} = this;
    light.position.set(0, 10, 0);
    scene.add(light);
    camera.lookAt(light.position);
  }

  fillTexture(texture) {
    const {simplex} = this;
    const waterMaxHeight = 19;
    const waveRippleFactor = 0.95;
    const TEXTURE_WIDTH = WATER_WIDTH / 2;

    function noise(x, y, z) {
      var multR = waterMaxHeight;
      var mult = 0.025;
      var r = 0;
      for (var i = 0; i < 15; i++) {
        r += multR * simplex.noise(x * mult, y * mult);
        multR *= 0.53 + 0.025 * i;
        mult *= waveRippleFactor;
      }
      return r;
    }

    var pixels = texture.image.data;

    var p = 0;
    for (var j = 0; j < TEXTURE_WIDTH; j++) {
      for (var i = 0; i < TEXTURE_WIDTH; i++) {

        var x = i * 128 / TEXTURE_WIDTH;
        var y = j * 128 / TEXTURE_WIDTH;

        pixels[p + 0] = noise(x, y, 123.4);
        pixels[p + 1] = 0;
        pixels[p + 2] = 0;
        pixels[p + 3] = 1;

        p += 4;
      }
    }
  }

  animate = () => {
    this.frameId = window.requestAnimationFrame(this.animate);
    this.renderScene();
  }


  renderScene = () => {
    const {gpuCompute, renderer, camera, mouseCoords, meshRay, raycaster, audioAnalyser, freqArray, scene} = this;
    const uniforms = this.heightmapVariable.material.uniforms;

    if (this.mouseMoved) {
      raycaster.setFromCamera(mouseCoords, camera);
      let intersects = raycaster.intersectObject(meshRay);

      if (intersects.length > 0) {
        let point = intersects[0].point;
        uniforms.mousePos.value.set(point.x, point.z);
      }
      else {
        uniforms.mousePos.value.set(10000, 10000);
      }
      this.mouseMoved = false;
    }
    else {
      if (this.audioStream !== undefined) {
        this.audioAnalyser.getByteFrequencyData(freqArray);
        let x = this.freqArray[600];
        let y = this.freqArray[100] - 100;
        uniforms.mousePos.value.set(x, y)
      } else {
        let randX = THREE.Math.randInt(20, 40);
        let randY = THREE.Math.randInt(-50, 50);
        uniforms.mousePos.value.set(randX, randY)
      }
    }

    // Do the gpu computation
    gpuCompute.compute();

    // Get compute output in custom uniform
    this.waterUniforms.heightmap.value = gpuCompute.getCurrentRenderTarget(this.heightmapVariable).texture;

    renderer.render(scene, camera);
  }

  render() {
    return (
      <Fragment>
        <div
          className="release"
          id="release001"
          ref={(mount) => {
            this.mount = mount
          }}
        />
        <Player
          src='assets/0001-yahceph.mp3'
          type='audio/mpeg'
          message='YAHCEPH'
          inputRef={el => this.audioElement = el}/>
        <Purchase/>
      </Fragment>
    );
  }
}

export default Release0001;