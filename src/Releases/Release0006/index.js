import React, {Component, Fragment} from 'react';
import {CONTENT} from "../../Main/Content";
import Footer from '../../Main/Footer/Footer';
import {loadGLTF} from "../../Utils/Loaders";
import * as THREE from "three";
import {assetPath} from "../../Utils/assets";
import GLTFLoader from "three-gltf-loader";
import {OrbitControls} from "../../Utils/OrbitControls";
import {Lensflare, LensflareElement} from 'three-full';

export const assetPath6 = (p) => {
  return assetPath("6/" + p);
}

class Release0006 extends Component {

  componentDidMount() {

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.scene.fog = false;
    this.scene.fog = new THREE.Fog(this.scene.background, 3500, 15000);
    this.clock = new THREE.Clock();
    this.manager = new THREE.LoadingManager();
    this.loader = new GLTFLoader(this.manager);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      // shadows: true,
      gammaInput: false,
      gammaOutput: true,
      toneMappingExposure: 2,
      // gammaFactor: 2.2
    });
    this.loadOctopusGLTF();
    this.setupCamera();
    this.setupLights();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // this.controls.maxDistance = 1500;
    this.container.appendChild(this.renderer.domElement);
    this.setRendererSize();
    window.addEventListener("resize", this.setRendererSize, false);
    this.renderScene();
  }


  loadOctopusGLTF = () => {
    const octopusPath = assetPath6("objects/octopus/25-dollar-octopus.glb");
    const renderOctopus = gltf => this.renderOctopusGLTF(gltf);
    const octopusLoadGLTFParams = {
      url: octopusPath,
      name: "octopus",
      position: [0, 0, 0],
      rotateX: 0.001,
      rotateY: -0.005,
      rotateZ: 0.01,
      relativeScale: 1,
      loader: this.loader,
      onSuccess: renderOctopus,
    }
    loadGLTF({...octopusLoadGLTFParams});
  }

  // TODO - all of this scene initialization shouldnt be in callback use promise
  renderOctopusGLTF = (gltf) => {
    gltf.scene.traverse(child => {
      if (child.name === "octopus") {
        child.receiveShadow = true;
        child.castShadow = true;
        this.octoMaterial = new THREE.MeshStandardMaterial( {
          // map: null,
          color: 0x4B0082,
          metalness: 0.5,
          roughness: 0.0,
          // envMapIntensity: 1.0
        } );
        this.octoMaterial.skinning = true;
        this.octoMaterial.fog = true; // TODO check if turning this on creates flare
        this.octoMaterial.side = THREE.DoubleSide;
        child.material = this.octoMaterial;
        child.material.needsUpdate = true;
      }
    });
    this.gltf = gltf;
    this.scene.add(this.gltf.scene);
    this.setupOctopusAnimation();
  }

  setupOctopusAnimation = () => {
    const {gltf} = this;
    // setup animations mixer
    this.mixer = new THREE.AnimationMixer(gltf.scene);
    for (let i = 0; i < gltf.animations.length; i++) {
      const animation = gltf.animations[i];
      this.mixer.clipAction(animation).play();
    }
  }

  setupLights = () => {
    const {scene} = this;
    let light = new THREE.SpotLight("#fff", 0.8);
    light.position.y = 100;
    light.angle = 1.05;
    light.decay = 2;
    light.penumbra = 1;
    light.shadow.camera.near = 10;
    light.shadow.camera.far = 1000;
    light.shadow.camera.fov = 30;
    scene.add(light);
    this.setupLensFlare();
  }

  setupLensFlare = () => {
    const {scene} = this;
    var dirLight = new THREE.DirectionalLight(0xffffff, 0.05);
    dirLight.position.set(-100, -1, -100).normalize();
    console.log(dirLight.position)
    dirLight.color.setHSL(0.1, 0.7, 0.5);
    scene.add(dirLight);
    // lensflares
    let textureLoader = new THREE.TextureLoader();
    this.textureFlare0 = textureLoader.load(assetPath6('textures/lensflare/lensflare0.png'));
    this.textureFlare3 = textureLoader.load(assetPath6('textures/lensflare/lensflare4.png'));
    this.addLensFlareLight(0.55, 0.9, 0.5, 5000, 0, -1000);
    this.addLensFlareLight(0.08, 0.8, 0.5, 0, 0, -1000);
    this.addLensFlareLight(0.995, 0.5, 0.9, 5000, 5000, -1000);
  }

  addLensFlareLight(h, s, l, x, y, z) {
    const {scene, textureFlare0, textureFlare3} = this;
    var light = new THREE.PointLight(0xffffff, 1.5, 2000);
    light.color.setHSL(h, s, l);
    light.position.set(x, y, z);
    scene.add(light);
    var lensflare = new Lensflare();
    lensflare.addElement(new LensflareElement(textureFlare0, 700, 0, light.color));
    lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
    lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
    lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
    lensflare.addElement(new LensflareElement(textureFlare3, 70, 1));
    light.add(lensflare);

  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(100, 0, 100);
    this.camera.lookAt(this.scene.position);
    this.scene.add(this.camera);
  }

  setRendererSize = () => {
    // On resize, get new width & height of window
    const ww = document.documentElement.clientWidth || document.body.clientWidth;
    const wh = window.innerHeight;
    // Update camera aspect
    this.camera.aspect = ww / wh;
    // Reset aspect of the camera
    this.camera.updateProjectionMatrix();
    // Update size of the canvas
    this.renderer.setSize(ww, wh);
  };

  renderScene() {
    this.controls.update();
    if (this.mixer) {
      this.mixer.update(this.clock.getDelta());
    }
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.renderScene.bind(this));
  }

  render() {
    return (
      <Fragment>
        <div ref={element => this.container = element}/>
        {/*<Footer*/}
        {/*content={CONTENT[window.location.pathname]}*/}
        {/*fillColor="white"*/}
        {/*audioRef={el => this.audioElement = el}*/}
        {/*/>*/}
      </Fragment>
    );
  }
}

export default Release0006;
