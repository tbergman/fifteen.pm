import React, { Component, Fragment } from 'react';
import * as THREE from 'three';
import { MarchingCubes, EffectComposer, ShaderPass, FXAAShader, HorizontalTiltShiftShader, VerticalTiltShiftShader, RenderPass } from 'three-full';
import { OrbitControls } from '../Utils/OrbitControls';
import '../Releases/Release.css';
import debounce from 'lodash/debounce';
import './HomeMobile.css';
import { assetPath } from "../Utils/assets";
import Menu from "../UI/Menu/Menu";


const MARGIN = 0;
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight - 2 * MARGIN;
let resolution = 50;
const numBlobs = 10;

class HomeMobile extends Component {
  state = {
    overlayOpen: false,
  }

  constructor(props, context) {
    super(props, context);
    this.clock = new THREE.Clock();
    this.camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050505);
    this.light = new THREE.DirectionalLight(0xffffff);
    this.pointLight = new THREE.PointLight(0xff3300);
    this.ambientLight = new THREE.AmbientLight(0xFFFFFF);

    // environment map
    let path = assetPath("0/images/example-map.jpg");
    let textureEquirec = new THREE.TextureLoader().load(path);
    textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
    textureEquirec.magFilter = THREE.LinearFilter;
    textureEquirec.minFilter = THREE.LinearMipMapLinearFilter;
    textureEquirec.encoding = THREE.sRGBEncoding;

    // material
    this.shinyMaterial = new THREE.MeshStandardMaterial({
      color: 0x550000,
      roughness: 0.1,
      envMap: textureEquirec
    });
    this.marchingCubes = new MarchingCubes(resolution, this.shinyMaterial, true, true);
    this.renderer = new THREE.WebGLRenderer();
    this.renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
    this.renderTarget = new THREE.WebGLRenderTarget(SCREEN_WIDTH, SCREEN_HEIGHT, this.renderTargetParameters);
    this.effectFXAA = new ShaderPass(FXAAShader);
    this.hblur = new ShaderPass(HorizontalTiltShiftShader);
    this.vblur = new ShaderPass(VerticalTiltShiftShader);
    this.renderModel = new RenderPass(this.scene, this.camera);
    this.composer = new EffectComposer(this.renderer, this.renderTarget);
    this.controls = new OrbitControls(this.camera);
  }

  componentDidUpdate(prevProps, prevState) {
      // only update chart if the data has changed
      console.log(prevState);
  }

  componentDidMount() {
    // if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
    let hueDirection = 0.01;
    let marchingCubeProps = {
      speed: 0.5,
      numBlobs: 12,
      resolution: 50,
      isolation: 30,
      floor: false,
      wallx: false,
      wallz: false,
      hue: 0.0,
      saturation: 0.7,
      lightness: 0.3,
      lhue: 0.04,
      lsaturation: 1.0,
      llightness: 0.5,
      lx: -0.1,
      ly: -0.2,
      lz: -0.1,
    };

    let time = 0;

    const init = () => {
      const { container, camera, controls, ambientLight, light, scene, pointLight, marchingCubes, renderer, hblur, vblur, effectFXAA, composer } = this;

      // CAMERA
      camera.position.set(0, 10, 5);
      camera.rotation.x = 0.4;
      camera.rotation.z = 0.1;

      // CONTROLS
      controls.target.set(0, 2, 0);
      controls.update();

      // LIGHTS
      light.position.set(0.5, 0.5, 1);
      scene.add(light);

      pointLight.position.set(0, 0, 10);
      scene.add(pointLight);
      scene.add(ambientLight);

      marchingCubes.position.set(0, -10, 0);
      marchingCubes.scale.set(9, 9, 7);

      marchingCubes.enableUvs = false;
      marchingCubes.enableColors = false;
      marchingCubes.isolation = marchingCubeProps.isolation;
      scene.add(marchingCubes);

      // RENDERER
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
      container.appendChild(renderer.domElement);

      renderer.gammaInput = true;
      renderer.gammaOutput = true;
      renderer.autoClear = false;

      var bluriness = 3;
      hblur.uniforms['h'].value = bluriness / SCREEN_WIDTH;
      vblur.uniforms['v'].value = bluriness / SCREEN_HEIGHT;
      hblur.uniforms['r'].value = vblur.uniforms['r'].value = 0.5;
      effectFXAA.uniforms['resolution'].value.set(1 / SCREEN_WIDTH, 1 / SCREEN_HEIGHT);

      vblur.renderToScreen = true;
      effectFXAA.renderToScreen = true;

      composer.addPass(this.renderModel);
      composer.addPass(effectFXAA);
      composer.addPass(hblur);
      composer.addPass(vblur);

      // EVENTS
      window.addEventListener('resize', onWindowResize, false);
    }

    const onWindowResize = debounce((event) => {
      const SCREEN_WIDTH = window.innerWidth;
      const SCREEN_HEIGHT = window.innerHeight - 2 * MARGIN;

      const { camera, renderer, composer, hblur, vblur, effectFXAA } = this;
      camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
      camera.updateProjectionMatrix();

      renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
      composer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

      hblur.uniforms['h'].value = 4 / SCREEN_WIDTH;
      vblur.uniforms['v'].value = 4 / SCREEN_HEIGHT;

      effectFXAA.uniforms['resolution'].value.set(1 / SCREEN_WIDTH, 1 / SCREEN_HEIGHT);
    }, 100);

    const updateCubes = debounce((mCubes, time, numblobs) => {
      mCubes.reset();

      // fill the field with some metaballs
      var i, ballx, bally, ballz, subtract, strength;

      subtract = 1;
      strength = 1. / ((Math.sqrt(numblobs) - 1) / 4 + 1);

      for (i = 0; i < numblobs; i++) {
        ballx = Math.sin(i + 1.26 * time * (1.03 + 0.5 * Math.cos(0.21 * i))) * 0.27 + 0.5;
        bally = Math.abs(Math.cos(i + 1.12 * time * Math.cos(1.22 + 0.1424 * i))) * 0.77; // dip into the floor
        ballz = Math.cos(i + 1.32 * time * 0.1 * Math.sin((0.92 + 0.53 * i))) * 0.27 + 0.5;
        mCubes.addBall(ballx, bally, ballz, strength, subtract);
      }
    }, 10);

    const renderAnimation = () => {
      const { clock, camera, light, scene, pointLight, marchingCubes, renderer, composer, menuRef, state } = this;
      let delta = clock.getDelta();

      time += delta * marchingCubeProps.speed * 0.5;

      updateCubes(marchingCubes, time, marchingCubeProps.numBlobs);

      // materials
      marchingCubeProps.hue += hueDirection;
      scene.background.b += hueDirection;
      scene.background.g += hueDirection;

      if (marchingCubeProps.hue < 0.1) hueDirection = .001;
      if (marchingCubeProps.hue > 0.99) hueDirection = -.001;
      marchingCubes.material.color.setHSL(marchingCubeProps.hue, marchingCubeProps.saturation, marchingCubeProps.lightness);

      // lights
      light.position.set(marchingCubeProps.lx, marchingCubeProps.ly, marchingCubeProps.lz);
      light.position.normalize();
      pointLight.color.setHSL(marchingCubeProps.lhue, marchingCubeProps.lsaturation, marchingCubeProps.llightness);

      // render
      if (marchingCubeProps.postprocessing) {
        composer.render(delta);
      } else {
        renderer.clear();
        renderer.render(scene, camera);
      }

      // hacky to put this here...
      if (menuRef && menuRef.state.overlayOpen != state.overlayOpen) {
        this.setState({
          overlayOpen: menuRef.state.overlayOpen
        })
      }
    }

    const animate = () => {
      requestAnimationFrame(animate);
      renderAnimation();
    }

    init();
    animate();
  }

  renderReleaseas() {
    return (<div className="releases-list">
        <ul>
          <li> Releases </li>
          <li><a href="/1">Yahceph</a></li>
          <li><a href="/2">Year Unknown</a></li>
          <li><a href="/3">Othere</a></li>
          <li><a href="/4">Jon Cannon</a></li>
          <li><a href="/5">Plebeian</a></li>
          <li><a href="/6">vveiss</a></li>
          <li><a href="/7">Jon Fay</a></li>
        </ul>
    </div>);
  }

  render() {
    return (
      <Fragment>
        <Menu
          overlayOpen={false}
          renderPlayer={false}
          ref={element => this.menuRef = element}
        />
        {!this.state.overlayOpen && this.renderReleaseas()}
        <div ref={element => this.container = element} />
      </Fragment>
    );
  }
}

export default HomeMobile;
