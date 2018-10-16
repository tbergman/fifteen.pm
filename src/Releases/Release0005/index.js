import React, {Component, Fragment} from 'react';
import '../Release.css';
import * as THREE from "three";
import {OrbitControls} from "../../Utils/OrbitControls";
import {CONSTANTS} from "./constants";
import {Reflector} from '../../Utils/Reflector';
import {Water} from '../../Utils/Water2';
import Footer from '../../Footer';
import GLTFLoader from "three-gltf-loader";
import {loadGLTF} from "../../Utils/Loaders";
import {assetPath} from "../../Utils/assets";
import {cameraViews} from "./Utils/cameraViews";
import {isMobile} from "../../Utils/BrowserDetection";
import {CONTENT} from "../../Content";
import {soundcloudTrackIdFromSrc} from "../../Utils/SoundcloudUtils";

export const assetPath5 = (p) => {
  return assetPath("5/" + p);
}

let statueDirection = 0.01;

class Release0005 extends Component {
  state = {
    inWormhole: true,
    inMirrorLand: false,
    justTwitiched: false
  }

  componentDidMount() {
    this.init();
    // When user resize window
    window.addEventListener("resize", this.onResize, false);
    // When user move the mouse
    this.renderScene();
  }

  init = () => {
    this.time = 0;
    this.clock = new THREE.Clock();
    this.manager = new THREE.LoadingManager();
    this.loader = new GLTFLoader(this.manager);
    this.cubeTextureLoader = new THREE.CubeTextureLoader();
    // Create an empty scene and define a fog for it
    this.scene = new THREE.Scene();
    // Store the position of the mouse
    // Default is center of the screen
    this.mouse = {
      position: new THREE.Vector2(0, 0),
      target: new THREE.Vector2(0, 0)
    };

    this.createCameras();
    this.createSkyBox();
    this.createMirror();
    this.createLights();
    this.createWater();
    this.createTunnelMesh();
    this.createStatue();
    this.createCoin();
    this.updateCameraView();
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(this.mirrorLandCamera, this.renderer.domElement);
    this.controls.maxDistance = 1500;
    this.container.appendChild(this.renderer.domElement);
  }

  createCameras() {
    this.mirrorLandCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.mirrorLandCamera.position.set(-16.5, 2.9, 14.7);
    this.mirrorLandCamera.lookAt(this.scene.position);
    this.inWormholeCamera = new THREE.PerspectiveCamera(84, window.innerWidth / window.innerHeight, 0.01, 1000);
    this.inWormholeCamera.name = "inWormholeCamera";
    this.scene.add(this.inWormholeCamera);
  }

  createLights() {
    const {scene} = this;

    this.cameraLight = new THREE.DirectionalLight(0x0000ff);
    scene.add(this.cameraLight);

    var mainLight = new THREE.PointLight(0xffffff, 1.5, 250);
    mainLight.position.y = 100;
    scene.add(mainLight);

    var greenLight = new THREE.PointLight(0x0000ff, 1.25, 1000);
    greenLight.position.set(550, 50, 0);
    scene.add(greenLight);

    var redLight = new THREE.PointLight(0xff0000, 0.25, 1000);
    redLight.position.set(-550, 50, 0);
    scene.add(redLight);

    var blueLight = new THREE.PointLight(0x0000ff, 0.25, 1000);
    blueLight.position.set(550, 50, 0);
    scene.add(blueLight);
  }

  createWater() {
    const {scene} = this;
    var params = {
      color: '#ffffff',
      scale: 4,
      flowX: 1,
      flowY: 1
    };
    var waterGeometry = new THREE.PlaneBufferGeometry(50, 50);
    this.water = new Water(waterGeometry, {
      color: params.color,
      scale: params.scale,
      flowDirection: new THREE.Vector2(params.flowX, params.flowY),
      textureWidth: 512,
      textureHeight: 512
    });
    this.water.position.y = .1;
    this.water.rotation.x = Math.PI * -0.5;
    scene.add(this.water);
  }

  createSkyBox() {
    const {scene} = this;
    // sky box
    var cubeTextureLoader = new THREE.CubeTextureLoader();
    cubeTextureLoader.setPath('assets/releases/5/images/');
    var cubeTexture = cubeTextureLoader.load([
      '4.jpg', '5.jpg',
      '6.jpg', '4.jpg',
      '4.jpg', '4.jpg',
    ]);
    var cubeShader = THREE.ShaderLib['cube'];
    cubeShader.uniforms['tCube'].value = cubeTexture;
    var skyBoxMaterial = new THREE.ShaderMaterial({
      fragmentShader: cubeShader.fragmentShader,
      vertexShader: cubeShader.vertexShader,
      uniforms: cubeShader.uniforms,
      side: THREE.BackSide
    });
    var skyBox = new THREE.Mesh(new THREE.BoxBufferGeometry(1000, 1000, 1000), skyBoxMaterial);
    scene.add(skyBox);
  }

  createMirror() {
    const mirrorGeometry = new THREE.CircleBufferGeometry(5, 64);
    const mirror = new Reflector(mirrorGeometry, {
      clipBias: 0.3,
      textureWidth: CONSTANTS.ww * window.devicePixelRatio,
      textureHeight: CONSTANTS.wh * window.devicePixelRatio,
      color: 0xffffff,
      recursion: 1
    });

    mirror.position.y = 0;
    mirror.rotateY(-Math.PI / 2);

    this.mirror = mirror;
    this.scene.add(this.mirror);
  }

  createTunnelMesh() {
    this.binormal = new THREE.Vector3();
    this.normal = new THREE.Vector3();
    this.numTubeSegments = 500;
    // complex demo tube
    this.curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 10, -10), new THREE.Vector3(10, 0, -10),
      new THREE.Vector3(20, 0, 0), new THREE.Vector3(30, 0, 10),
      new THREE.Vector3(30, 0, 20), new THREE.Vector3(20, 0, 30),
      new THREE.Vector3(10, 0, 30), new THREE.Vector3(0, 0, 30),
      new THREE.Vector3(-10, 10, 30), new THREE.Vector3(-10, 20, 30),
      new THREE.Vector3(0, 30, 30), new THREE.Vector3(10, 30, 30),
      new THREE.Vector3(20, 30, 15), new THREE.Vector3(10, 30, 10),
      new THREE.Vector3(0, 30, 10), new THREE.Vector3(-10, 20, 10),
      new THREE.Vector3(-10, 10, 10), new THREE.Vector3(0, 0, 10),
      new THREE.Vector3(10, -10, 10), new THREE.Vector3(20, -15, 10),
      new THREE.Vector3(30, -15, 10), new THREE.Vector3(40, -15, 10),
      new THREE.Vector3(50, -15, 10), new THREE.Vector3(60, 0, 10),
      new THREE.Vector3(70, 0, 0), new THREE.Vector3(80, 0, 0),
      new THREE.Vector3(90, 0, 0), new THREE.Vector3(100, 0, 0),
      new THREE.Vector3(100, 0, 0), new THREE.Vector3(100, 0, 0)
    ]);
    var geometry = new THREE.Geometry();
    geometry.vertices = this.curve.getPoints(this.numTubeSegments);
    this.splineMesh = new THREE.Line(geometry, new THREE.LineBasicMaterial());
    this.textureLoader = new THREE.TextureLoader();
    const textures = {
      "galaxy": {
        url: "./assets/releases/5/images/blue_purple.jpg"
      },
      "galaxy2": {
        url: "./assets/releases/5/images/light_purple.jpg"
      }
    };
    textures.galaxy.texture = this.textureLoader.load(textures.galaxy.url, function (texture) {
      return texture;
    });
    this.tubeMaterial = new THREE.MeshStandardMaterial({
      side: THREE.BackSide,
      map: textures.galaxy.texture
    });
    this.tubeMaterial.map.wrapS = THREE.RepeatWrapping;
    this.tubeMaterial.map.wrapT = THREE.RepeatWrapping;
    const radiusSegments = 12
    this.tubeGeometry = new THREE.TubeGeometry(this.curve, this.numTubeSegments, 2, radiusSegments, false);
    this.tubeMesh = new THREE.Mesh(this.tubeGeometry, this.tubeMaterial);
    this.scale = 10;
    this.tubeMesh.scale.set(this.scale, this.scale, this.scale);
    this.scene.add(this.tubeMesh);
  };

  createStatue = () => {
    const statuePath = assetPath5("objects/discus-thrower/scene.gltf");
    const renderStatue = gltfObj => this.renderStatueGltfObj(gltfObj);
    const statueLoadGLTFParams = {
      url: statuePath,
      name: "discus-thrower",
      position: [0, 0, 0],
      rotateX: 0.001,
      rotateY: -0.005,
      rotateZ: 0.01,
      relativeScale: .1,
      loader: this.loader,
      onSuccess: renderStatue,
    }
    loadGLTF({...statueLoadGLTFParams});
  }

  renderStatueGltfObj = (gltfObj) => {
    var cubeTextureLoader = new THREE.CubeTextureLoader();
    cubeTextureLoader.setPath('assets/releases/5/images/');
    var cubeTexture = cubeTextureLoader.load([
      '4.jpg', '5.jpg',
      '6.jpg', '4.jpg',
      '5.jpg', '6.jpg',
    ]);
    const statueObj = gltfObj.scene.children[0].children[0];
    const updatedStatueMaterial = new THREE.MeshBasicMaterial({
      color: 0x555555,
      envMap: cubeTexture
    });
    statueObj.material = updatedStatueMaterial;
    statueObj.scale.set(.01, .01, .01);
    statueObj.position.set(-2, -4.5, 0);

    this.statueObj = statueObj;
    this.scene.add(statueObj);
    return gltfObj;
  }

  animateSceneObjects(rotationSpeed = 0.01) {
    const {position} = this.statueObj;
    if (position.y > Math.random() * -0.9 + 0.1) statueDirection = -1 * 0.01;
    if (position.y < Math.random() * -5.5 + -4) statueDirection = 0.01;
    const newPos = position.y + statueDirection;
    position.setY(newPos);
    this.statueObj.rotateY(rotationSpeed);
    const newMirrorXPos = this.mirror.position.x + rotationSpeed;
    this.mirror.rotateY(newMirrorXPos);
    if (this.coinObj !== undefined) {
      this.coinObj.position.y = this.coinObj.position.y + statueDirection;
      this.coinObj.rotateY(-1 * rotationSpeed);
    }
  }

  createCoin() {
    const coinPath = assetPath5("objects/old_coin/scene.gltf");
    const renderCoin = gltfObj => this.renderCoin(gltfObj);

    const coinLoadGLTFParams = {
      url: coinPath,
      name: "old_coin",
      position: [0, 0, 0],
      rotateX: 0.001,
      rotateY: -0.005,
      rotateZ: 0.01,
      relativeScale: .1,
      loader: this.loader,
      onSuccess: renderCoin,
    }

    loadGLTF({...coinLoadGLTFParams});
  }

  renderCoin = (gltfObj) => {
    this.cubeTextureLoader.setPath('assets/releases/5/objects/old_coin/textures/Material_25_normal.png/');
    var cubeTexture = this.cubeTextureLoader.load([
      '4.jpg', '5.jpg',
      '6.jpg', '4.jpg',
      '5.jpg', '6.jpg',
    ]);

    const coinObj = gltfObj.scene.children[0].children[0];
    const updatedCoinMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      envMap: cubeTexture
    });
    coinObj.material = updatedCoinMaterial;
    coinObj.scale.set(0.06, 0.06, 0.06);
    coinObj.position.set(-15, 0, 10);

    this.coinObj = coinObj;
    this.scene.add(coinObj);
    return gltfObj;
  }

  updateCameraView() {
    let count = 0;
    setInterval(() => {
      if (count >= cameraViews.length - 1) {
        count = 0;
      } else {
        count += 1;
      }
      this.mirrorLandCamera = cameraViews[count](this.mirrorLandCamera);
    }, 60 / CONSTANTS.trackTimes[this.currentTrack()].bpm * 10000);
  }

  onMouseMove = (e) => {
    // Save mouse X & Y position
    this.mouse.target.x = (e.clientX - (CONSTANTS.ww * 0.5)) / (CONSTANTS.ww * 0.5);
    this.mouse.target.y = ((CONSTANTS.wh * 0.5) - e.clientY) / (CONSTANTS.wh * 0.5);
  };

  onResize = () => {
    // On resize, get new width & height of window
    const ww = document.documentElement.clientWidth || document.body.clientWidth;
    const wh = window.innerHeight;
    // Update camera aspect
    this.mirrorLandCamera.aspect = ww / wh;
    // Reset aspect of the camera
    this.mirrorLandCamera.updateProjectionMatrix();
    // Update size of the canvas
    this.renderer.setSize(ww, wh);
  };

  updateWormholeTravel() {
    const {scale, normal, binormal, tubeGeometry, inWormholeCamera} = this;
    // animate camera along spline
    this.cameraLight.intensity = THREE.Math.randFloat(.9, 1.0);
    var time = Date.now();
    var looptime = 20 * 1000;
    var t = (time % looptime) / looptime;
    // let t = 0;
    var pos = tubeGeometry.parameters.path.getPointAt(t);
    pos.multiplyScalar(scale);
    // interpolation
    var segments = tubeGeometry.tangents.length;
    var pickt = t * segments;
    var pick = Math.floor(pickt);
    var pickNext = (pick + 1) % segments;
    if (t > .97) {
      this.setState({
        inWormhole: false, // TODO there are two states because at first I was working with three... obviously could do this with one boolean switch
        inMirrorLand: true
      })
    }
    binormal.subVectors(tubeGeometry.binormals[pickNext], tubeGeometry.binormals[pick]);
    binormal.multiplyScalar(pickt - pick).add(tubeGeometry.binormals[pick]);
    var dir = tubeGeometry.parameters.path.getTangentAt(t);
    var offset = 15;
    normal.copy(binormal).cross(dir);
    // we move on a offset on its binormal
    pos.add(normal.clone().multiplyScalar(offset));
    inWormholeCamera.position.copy(pos);
    // using arclength for stablization in look ahead
    var lookAt = tubeGeometry.parameters.path.getPointAt((t + 10 / tubeGeometry.parameters.path.getLength()) % 1).multiplyScalar(scale);
    inWormholeCamera.matrix.lookAt(inWormholeCamera.position, lookAt, normal);
    inWormholeCamera.rotation.setFromRotationMatrix(inWormholeCamera.matrix, inWormholeCamera.rotation.order);
  }

  currentCamera = () => {
    return this.state.inWormhole
      ? this.inWormholeCamera
      : this.mirrorLandCamera
  }

  currentTrack = () => {
    if (!this.audioElement.currentSrc) {
      return 'Heaven';
    }
    const trackId = soundcloudTrackIdFromSrc(this.audioElement.currentSrc);
    const track = CONTENT[window.location.pathname].tracks.filter(track => track.id === trackId)[0];
    return track.title
  }

  shouldPivotStatue() {
    const statuePivotTimes = CONSTANTS.trackTimes[this.currentTrack()].pivotStatue;
    statuePivotTimes.forEach((t) => {
      if (this.state.inMirrorLand && Math.abs(this.audioElement.currentTime - t) < .1) {
        if (!this.state.isStatuePivoting) {
          this.setState({
            isStatuePivoting: true
          }, () => {
            this.statueObj && this.animateSceneObjects(-1);
          });
        }
      } else {
        this.setState({
          isStatuePivoting: false
        })
      }
    });
  }

  shouldEnterWormhole() {
    const enterWormholeTimes = CONSTANTS.trackTimes[this.currentTrack()].enterWormhole;
    enterWormholeTimes.forEach((t) => {
      if (this.state.inMirrorLand && Math.abs(this.audioElement.currentTime - t) < .1) {
        this.setState({
          inWormhole: true,
          inMirrorLand: false
        });
      }
    })
  }

  renderScene() {
    let delta = this.clock.getDelta();
    this.time += delta * 0.5;
    if (this.currentTrack() === "Heaven") {
      if (this.audioElement.currentTime) {
        this.shouldPivotStatue()
      }
    }

    this.shouldEnterWormhole();

    let camera = this.currentCamera();
    this.cameraLight.position.copy(camera.position);

    if (this.state.inWormhole) {
      this.updateWormholeTravel();
    } else {
      this.statueObj && this.animateSceneObjects();
    }

    this.renderer.render(this.scene, camera);
    window.requestAnimationFrame(this.renderScene.bind(this));
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

export default Release0005;
