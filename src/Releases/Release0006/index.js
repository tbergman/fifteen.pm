import React, {Component, Fragment} from 'react';
import {CONTENT} from "../../Main/Content";
import Footer from '../../Main/Footer/Footer';
import {loadGLTF} from "../../Utils/Loaders";
import * as THREE from "three";
import {assetPath} from "../../Utils/assets";
import GLTFLoader from "three-gltf-loader";
import {Lensflare, LensflareElement} from 'three-full';
import {FirstPersonControls} from "../../Utils/FirstPersonControls";
import {OrbitControls} from "../../Utils/OrbitControls";
import {CONSTANTS} from "../Release0006/constants";


export const assetPath6 = (p) => {
  return assetPath("6/" + p);
}

const RISING = "rising";
const UNDERNEATH = "underneath";
const ABOVE = "above";
const ORBITING = "orbiting";
const SECTION_1_START = 0;
const SECTION_2_START = 96;
const SECTION_3_START = 192;

class Release0006 extends Component {

  state = {
    mode: ORBITING,//UNDERNEATH,
    strobeOn: false,
    arePurbasShooting: false
  }

  componentDidMount() {

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.scene.fog = false;
    // this.scene.fog = new THREE.Fog(this.scene.background, 3500, 15000);
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
    this.phurbas = [];
    for (let i = 0; i < 3; i++) {
      this.loadPhurbaGLTF(i);
    }

    this.setupCamera();
    this.setupLights();


    // this.controls = new OrbitControls(this.camera);

     this.controls = new FirstPersonControls(this.camera);
     this.controls.lookSpeed = .05;
     this.controls.movementSpeed = 133;
     this.controls.enabled = true;
     this.controls.mouseMotionActive = false;


    this.container.appendChild(this.renderer.domElement);
    this.setRendererSize();
    window.addEventListener("resize", this.setRendererSize, false);

    // todo - put these in proper place
    this.rotationAngle = 0;
    this.rotationRadius = 1;
    this.orbitRadius = 300;
    // this.renderScene();
    this.startAnimation();

  }


  loadOctopusGLTF = () => {
    const octopusPath = assetPath6("objects/octopus/25-dollar-octopus-test.glb");
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
        child.receiveShadow = false;
        child.castShadow = false;
        this.octoMaterial = new THREE.MeshStandardMaterial({
          // map: null,
          color: 0x4B0082,
          metalness: 0.5,
          roughness: 0.0,
          // envMapIntensity: 1.0
        });

        // BLACK MATTE OCTO
        // var envMap = new THREE.TextureLoader().load(assetPath6('images/envMap.png'));
        // envMap.mapping = THREE.SphericalReflectionMapping;
        // this.octoMaterial = new THREE.MeshPhongMaterial({
        //   color: 0x000000,
        //   roughness: 0.0,
        //   // specular: 0x050505,
        //   // specular: 0x0f0f0f,
        //   shininess: 100.0
        //   // metalness: 1
        // });
        // const roughnessMap = new THREE.TextureLoader().load(assetPath6('images/roughnessMap.png'));
        // roughnessMap.magFilter = THREE.NearestFilter;
        // this.octoMaterial.roughnessMap = roughnessMap;
        // END BLACK MATTE OCTO

        this.octoMaterial.skinning = true;
        this.octoMaterial.fog = true; // TODO check if turning this on creates flare
        this.octoMaterial.side = THREE.DoubleSide;
        child.material = this.octoMaterial;
        child.material.needsUpdate = true;
      }
    });
    this.octoGltf = gltf;
    this.scene.add(this.octoGltf.scene);

    this.setupOctopusAnimation();
  }
  loadPhurbaGLTF = (idx) => {
    const phurbaPath = assetPath6("objects/ritual-dagger/phurba.glb");
    const renderPhurba = gltf => this.renderPhurbaGLTF(gltf, idx);
    const phurbaLoadGLTFParams = {
      url: phurbaPath,
      name: "RitualDagger",
      position: [idx * 1.5 - 12, idx * 1.5 - 8, idx * 1.5 - 20],
      // position: [999999, 999999, 999999],
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      relativeScale: .02,
      loader: this.loader,
      onSuccess: renderPhurba,
    }
    loadGLTF({...phurbaLoadGLTFParams});
  }


  // TODO - all of this scene initialization shouldnt be in callback use promise
  renderPhurbaGLTF = (gltf, idx) => {
    gltf.scene.traverse(child => {
      if (child.name === "RitualDagger") {
        child.receiveShadow = false;
        child.castShadow = false;
        child.material.needsUpdate = true;
        child.userData.startPos = new THREE.Vector3();
        child.userData.endPos = new THREE.Vector3();
        child.userData.direction = new THREE.Vector3();
        child.position.set(99999, 99999, 999999)
        // BLACK MATTE
        var envMap = new THREE.TextureLoader().load(assetPath6('objects/ritual-dagger/RitualDagger_G_reduced.png'));
        envMap.mapping = THREE.SphericalReflectionMapping;

        let phurbaMaterial = new THREE.MeshStandardMaterial({
          map: envMap,
          color: 0xfa0060,
          metalness: 0.5,
          roughness: 0.0,
          // envMapIntensity: 1.0
        });
        // const roughnessMap = new THREE.TextureLoader().load(assetPath6('images/roughnessMap.png'));
        // roughnessMap.magFilter = THREE.NearestFilter;
        // phurbaMaterial.roughnessMap = roughnessMap;
        child.material = phurbaMaterial;
        // END BLACK MATTE

        this.phurbas.push(child);
      }
    });
    this.phurbaGltf = gltf;
    this.scene.add(this.phurbaGltf.scene);
    // this.setupOctopusAnimation();
  }


  setupOctopusAnimation = () => {
    const {octoGltf} = this;
    // setup animations mixer
    this.mixer = new THREE.AnimationMixer(octoGltf.scene);
    for (let i = 0; i < octoGltf.animations.length; i++) {
      const animation = octoGltf.animations[i];
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
    light.lookAt(scene);
    scene.add(light);

    //TMP
    let ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight)

    this.cameraLight = new THREE.SpotLight("#fff", .1);
    this.cameraLight.intensity = 1.0;
    this.cameraLight.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z)
    this.cameraLight.lookAt(this.scene.position);
    scene.add(this.cameraLight);

    this.setupLensFlare();
    this.setupStrobe();
  }

  setupLensFlare = () => {
    const {scene} = this;
    var dirLight = new THREE.DirectionalLight(0xffffff, 0.05);
    dirLight.position.set(-100, -1, -100).normalize();
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

  setupStrobe() {
    const {cameraLight} = this;
    setInterval(() => {
      if (this.state.strobeOn) {
        cameraLight.power = Math.random() > 0.5 ? .0001 : 10.0;
      } else {
        cameraLight.power = 0;
      }
    }, 10);
  }

  setupCamera() {
    this.cameraVector = new THREE.Vector3();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    this.camera.position.set(-12.5, -8, -30);
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

  forceRotate() {
    const {camera} = this;
    // forced rotation under tentacle
    camera.rotation.x = this.rotationRadius * Math.cos(this.rotationAngle);
    camera.rotation.z = this.rotationRadius * Math.sin(this.rotationAngle);
    this.rotationAngle += 0.01;
  }

  advanceOrbitRotation() {
    const {camera, scene} = this;
    // forced rotation under tentacle
    camera.position.x = this.orbitRadius * Math.cos(this.rotationAngle);
    camera.position.y = this.orbitRadius * Math.sin(this.rotationAngle);
    // camera.position.z = this.orbitRadius * Math.sin(this.rotationAngle);
    this.rotationAngle += 0.01;
    camera.lookAt(scene.position);
  }


  setSongState() {
    const {mode} = this.state;
    const curTime = this.audioElement.currentTime;
    if (curTime >= SECTION_1_START && curTime < SECTION_2_START && mode != UNDERNEATH) {
      this.state.mode = UNDERNEATH;
    } else if (curTime >= SECTION_2_START && curTime <= SECTION_3_START && mode != RISING && mode != ABOVE) {
      this.state.mode = RISING;
      this.state.strobeOn = true;
    } else if (curTime >= SECTION_3_START) {
      this.state.mode = ORBITING;
    }
  }

  lerp(a, b, t) {
    return a + (b - a) * t
  }

  ease(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }


  shootPhurbas(clockDelta) {
    const {camera, cameraVector} = this;
    camera.getWorldDirection(cameraVector);
    const combo = CONSTANTS.phurbaCombos[THREE.Math.randInt(0, CONSTANTS.phurbaCombos.length - 1)];
    for (let i = 0; i < this.phurbas.length; i++) {
      let phurba = this.phurbas[i];
      phurba.userData.startPos.copy(camera.position).add(combo.start).addScalar(i * 300);
      phurba.userData.endPos.copy(camera.position).add(combo.end).addScalar(i * 300);
      phurba.position.copy(phurba.userData.startPos);
      phurba.lookAt(phurba.userData.endPos);
    }
  }

  inView(pos) {
    const {camera} = this;
    camera.updateMatrix();
    camera.updateMatrixWorld();
    var frustum = new THREE.Frustum();
    frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));

    return frustum.containsPoint(pos);
  }

  phurbasHavePassed() {
    const {phurbas} = this;
    const phurbasPassed = Array(phurbas.length).fill(false);
    for (let i = 0; i < phurbas.length; i++) {
      const phurba = phurbas[i];
      const endPos = phurba.userData.endPos;
      if (phurba.position.distanceTo(endPos) < 100 && !this.inView(phurba.position)) {
        phurbasPassed[i] = true;
      }
    }
    return phurbasPassed.includes(true);
  }

  advancePhurbas() {
    let speed = .05;
    for (let i = 0; i < this.phurbas.length; i++) {
      let phurba = this.phurbas[i];
      let phurbaPos = phurba.position;
      let endPos = phurba.userData.endPos;
      let newX = this.lerp(phurbaPos.x, endPos.x, speed);//this.ease(clockDelta));
      let newY = this.lerp(phurbaPos.y, endPos.y, speed);//this.ease(clockDelta));
      let newZ = this.lerp(phurbaPos.z, endPos.z, speed);//this.ease(clockDelta));
      phurbaPos.set(newX, newY, newZ);
    }
  }

  shouldPhurbasShoot(clockDelta) {
    CONSTANTS.purbaShootTimes.forEach((t) => {
      if (!this.state.arePurbasShooting && Math.abs(this.audioElement.currentTime - t) < .1) {
        for (let i = 0; i < this.phurbas.length; i++) {
          this.phurbas[i].visible = true;
        }
        this.setState({
          arePurbasShooting: true,
          strobeOn: true
        }, () => {
          this.shootPhurbas(clockDelta);
        });
      } else if (!this.state.arePurbasShooting) {
        for (let i = 0; i < this.phurbas.length; i++) {
          this.phurbas[i].visible = false;
        }
      }
    });
  }

  startAnimation() {
    this.stop = false;
    this.frameCount = 0;
    this.fps = 25;
    this.fpsInterval = undefined;
    this.startTime = undefined;
    this.now = undefined;
    this.then = undefined;
    this.elapsed = undefined;


    this.fpsInterval = 1000 / this.fps;
    this.then = Date.now();
    this.startTime = this.then;
    this.animate();
  }

  animate = () => {
    // request another frame
    window.requestAnimationFrame(this.animate.bind(this));

    this.now = Date.now();
    this.elapsed = this.now - this.then;

    // if enough time has elapsed, draw the next frame
    if (this.elapsed > this.fpsInterval) {

      // Get ready for next frame by setting then=now, but also adjust for your
      // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
      this.then = this.now - (this.elapsed % this.fpsInterval);

      this.renderScene();
    }
  }


  renderScene() {
    const {scene, renderer, camera, mixer, clock, cameraLight} = this;
    const {mode, strobeOn, arePurbasShooting} = this.state;
    const clockDelta = clock.getDelta();

    // this.setSongState();

    // this.controls.update();
    this.controls.update(clockDelta);

    if (mixer) {
      mixer.update(clockDelta);
    }

    if (!arePurbasShooting) {
      this.shouldPhurbasShoot(clockDelta);
    } else {
      this.advancePhurbas(clockDelta);
      if (this.phurbasHavePassed()) {
        this.state.arePurbasShooting = false;
        this.state.strobeOn = false;
      }
    }

    if (mode === RISING) {
      // this.camera.position.set(-12.5, -8, -30);
      const step = .0636;
      if (camera.position.z > -100) { // goes 70
        camera.position.z -= step;
      } else if (camera.position.x < 3) { // goes 15.5
        camera.position.x += step;
      } else if (camera.position.y < 59) { // goes 67 // so in total, we go 152.5 units /1.59 units every second... 25 frames per second // .0636 steps an animation frame
        camera.position.y += step;
      } else {
        // camera.lookAt(scene.position)
        this.state.mode = ORBITING;
        this.state.strobeOn = false;
      }
    }

    if (mode === UNDERNEATH) {
      // this.forceRotate();
    }

    if (mode === ORBITING) {
      this.advanceOrbitRotation();
    }

    cameraLight.position.copy(camera.position)
    renderer.render(scene, camera);
  }

  render() {
    return (
      <Fragment>
        <div ref={element => this.container = element}/>
        <Footer
          content={CONTENT[window.location.pathname]}
          fillColor="white"
          audioRef={el => this.audioElement = el}
        />
      </Fragment>
    );
  }
}

export default Release0006;
