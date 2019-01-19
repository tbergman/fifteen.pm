import React, {Component, Fragment} from 'react';
import {CONTENT} from "../../Main/Content";
import Footer from '../../Main/Footer/Footer';
import {loadGLTF, loadVideo} from "../../Utils/Loaders";
import {assetPath} from "../../Utils/assets";
import {DRACOLoader} from "three-full";//gltf-loader";
import {CONSTANTS} from "../Release0008/constants";
import {assetPath4Videos, makeSphere} from "../Release0004/utils";

const THREE = window.THREE = require('three');
require('three/examples/js/loaders/GLTFLoader');
require('three/examples/js/controls/OrbitControls');
export const assetPath8 = (p) => {
  return assetPath("8/" + p);
}

export const multiSourceVideo = (path) => ([
  {type: 'video/mp4', src: assetPath8(`videos/${path}.mp4`)},
  {type: 'video/webm', src: assetPath8(`videos/${path}.webm`)}
]);

class Release0008 extends Component {
  componentDidMount() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xff0000); //debug color
    // this.scene.background = new THREE.Color(0x000000); // prod color
    this.scene.fog = false;
    // this.scene.fog = new THREE.Fog(this.scene.background, 3500, 15000);
    this.clock = new THREE.Clock();
    this.camera = this.loadCamera();
    this.scene.add(this.camera);
    this.manager = new THREE.LoadingManager();
    this.loader = new THREE.GLTFLoader(this.manager);
    this.loader.setDRACOLoader(new DRACOLoader());
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      // shadows: true,
      gammaInput: false,
      gammaOutput: true,
      toneMappingExposure: 2,
      // gammaFactor: 2.2
    });
    this.renderer.shadowMap.enabled = true;


    // example of loading multiple models
    this.mixers = [];
    this.dancers = [];

    const sheriParams = {
      url: assetPath8("objects/sheri/scene.gltf"),
      name: "sheri",
      position: [80, -250, -50],
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      relativeScale: 1,
      loader: this.loader,
      onSuccess: gltf => this.setupDancer(gltf)
    }
    loadGLTF({...sheriParams});

    const samParams = {
      url: assetPath8("objects/sam/scene.gltf"),
      name: "sam",
      position: [180, -250, 100],
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      relativeScale: 1,
      loader: this.loader,
      onSuccess: gltf => this.setupDancer(gltf)
    }
    loadGLTF({...samParams});

    const athenaParams = {
      url: assetPath8("objects/athena/scene.gltf"),
      name: "athena",
      position: [-100, -250, 150],
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      relativeScale: 1.25,
      loader: this.loader,
      onSuccess: gltf => this.setupDancer(gltf)
    }
    loadGLTF({...athenaParams});

    const televisionParams = {
      url: assetPath8("objects/television/scene.gltf"),
      name: "television",
      position: [-350, -180, 250],
      rotateX: 0,
      rotateY: 150,
      // rotateY: CONSTANTS.televisionRotateY,
      rotateZ: 0,
      relativeScale: CONSTANTS.televisionScale,
      loader: this.loader,
      onSuccess: gltf => this.setupTV(gltf)
    }
    loadGLTF({...televisionParams});

    const roomParams = {
      url: assetPath8("objects/room/greem-room.glb"),
      name: "room",
      position: [0,10,0],
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      relativeScale: 200,
      loader: this.loader,
      onSuccess: gltf => this.setupRoom(gltf)
    }
    loadGLTF({...roomParams})
    //
    // const testCubeParams = {
    //   url: assetPath8("objects/test-cube/ok.glb"),
    //   name: "cube",
    //   position: [0,10,0],
    //   rotateX: 0,
    //   rotateY: 0,
    //   rotateZ: 0,
    //   relativeScale: 1,
    //   loader: this.loader,
    //   onSuccess: gltf => this.setupTestCube(gltf)
    // }
    this.setupCameraLight() // TODO this isnt working

    const light = new THREE.AmbientLight( 0x404040, 5.5 ); // soft white light

    // light.position.set(0, 10, 0);
    // let light = new THREE.RectAreaLight( 0xffffbb, 1.0, 15, 15 );

    // const helper = new THREE.RectAreaLightHelper( light );

    this.scene.add( light );
    // this.scene.add( helper );

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enabled = true;
    this.controls.zoomSpeed = 0.5;

    this.container.appendChild(this.renderer.domElement);
    this.setRendererSize();
    window.addEventListener("resize", this.setRendererSize, false);
    this.startAnimation();
  }


  setupTV(gltf) {
    this.scene.add(gltf.scene);
    // console.log("TV", gltf.scene)

    const tvScene = gltf.scene.getObjectByName("Collada_visual_scene_group");
    // console.log(tvScene);
    // tvScene.computeBoundingBox();
    // console.log(tvScene);
    const tvScreen = gltf.scene.getObjectByName("Screen_LowB", true).children[0].geometry;
    const lowerPanel = gltf.scene.getObjectByName("Panel_1_Low", true).children[0].geometry;
    lowerPanel.computeBoundingBox();
    tvScreen.computeBoundingBox();
    const panelBbox = lowerPanel.boundingBox;
    const screenBbox = tvScreen.boundingBox;
    const tvCenter = gltf.scene.getWorldPosition();
    // console.log(tvScreen.boundingBox);
    // console.log(panelBbox)
    // console.log(panelBbox.getSize())
    const scale = CONSTANTS.televisionScale;
    let obj = {
      type: 'video',
      mimetype: 'video/mp4',
      name: 'scratch-video',
      sources: multiSourceVideo('scratch-video'),
      // geometry: tvScreen,
      // this works
      geometry: new THREE.PlaneBufferGeometry(
        (screenBbox.max.x - screenBbox.min.x) * scale,
        (screenBbox.max.y - panelBbox.max.y) * scale),
      position: [
        tvCenter.x + 15,

        tvCenter.y + (panelBbox.getSize().y * 1.5 * scale), // if the scale changes this MIGHT look weird
        tvCenter.z - 48
        // tvCenter.z + (screenBbox.getSize().x / 2 * scale)
      ],
      playbackRate: 1,
      loop: true,
      // invert: true,
      volume: 0.01,
      muted: true,
      // rotateY: CONSTANTS.televisionRotateY
      // axis: new THREE.Vector3(0, 1, 0).normalize(),
      // angle: 0.003,
    }
    obj.rotateY = 150;
    let output = loadVideo({...obj, computeBoundingSphere: true});
    output.userData.video.play();
    // output.scale.set(scale, scale, scale);
    // console.log(output);
    this.scene.add(output);
    // this.objects[obj.name] = output;
  }


  // TODO - all of this scene initialization shouldnt be in callback use promise
  setupDancer(gltf) {
    this.scene.add(gltf.scene);
    this.setupModelAnimation(gltf);
    this.dancers.push(gltf);
  }


  // TODO delme
  setupTestCube(gltf){
    this.scene.add(gltf.scene);
  }

  setupRoom(gltf){
    const {scene} = this;
    console.log("SCENE", scene);
    // // for (let i=0; i<gltf.scene.children)
    // let underlinedSign = gltf.scene.getObjectByName("greem-underlined-sign");
    // underlinedSign.receiveShadow = true;
    // // TODO
    // underlinedSign.material.emissive = {r: 1, g: 0, b: 0};
    //
    // let nonUnderlinedSign = gltf.scene.getObjectByName("greem-non-underlined-sign");
    // nonUnderlinedSign.receiveShadow = true;
    // nonUnderlinedSign.material.emissive = {r: 1, g: 0, b: 0};


    // let walls = gltf.scene.getObjectByName("walls");
    // walls.children[0].receiveShadow = true;
    // let guillotine = gltf.scene.getObjectByName("guillotine");
    // console.log(guillotine);
    // guillotine.children[0].material = new THREE.MeshStandardMaterial({
    //   // map: null,
    //   color: 0x4B0082,
    //   metalness: 0.5,
    //   roughness: 0.0,
    //   // envMapIntensity: 1.0
    // });
    // this.octoMaterial.skinning = true;
    // this.octoMaterial.fog = true; // TODO check if turning this on creates flare
    // this.octoMaterial.side = THREE.DoubleSide;
    // child.material = this.octoMaterial;
    // guillotine.children[0].receiveShadow = true;
    // guillotine.children[0].material.emissive = {r: 0, g: 0, b: 0.1};
    // guillotine.receiveShadow= true;
    // guillotine.castShadow = true;
    // guillotine.children[0].receiveShadow = true;
    // guillotine.children[0].castShadow = true;
    // guillotine
    // console.log('GUILLOTINE', guillotine);
    // gltf.scene.receiveShadow = true;
    // this.guillotineLight = new THREE.PointLight(0xffffff, 2.5); //PointLight()
    // this.guillotineLight.position.set(guillotine.position);

    // this.guillotineLight.intensity = 3.85;
    // this.guillotineLight.castShadow = true;
    // this.guillotineLight.shadow.radius =8;
    // console.log("GUILLOTINE LIGHT", this.guillotineLight);
    // scene.add(this.guillotineLight);
    // var sphereSize = 10;
    // var guillotineLightHelper = new THREE.PointLightHelper( this.guillotineLight, sphereSize );
    // scene.add( guillotineLightHelper );

    this.setupModelAnimation(gltf);
    scene.add(gltf.scene);
  }

  setupModelAnimation(gltf) {
    let mixer = new THREE.AnimationMixer(gltf.scene);
    for (let i = 0; i < gltf.animations.length; i++) {
      const animation = gltf.animations[i];
      mixer.clipAction(animation).play();
    }
    this.mixers.push(mixer)
  }

  setupCameraLight() {
    const {scene, camera} = this;
    let ambientLight = new THREE.AmbientLight(0xaaaaaa);//ffffff);
    scene.add(ambientLight)
    // this.cameraLight = new THREE.PointLight("#fff");
    // this.cameraLight.intensity = 1;
    // this.cameraLight.position.set(this.camera.position);
    // this.camera.add(this.cameraLight);
    // this.cameraLight.lookAt(this.scene.position);


    // scene.add(this.cameraLight);
    // this.greemSignLight = new THREE.PointLight();
    // this.greemSignLight.position.set(-250, 0, -200); // TODO get position of object itself with offset
    // scene.add(this.greemSignLight);
    //
    // // TMP DEBUG
    // var sphereSize = 10;
    // var greemSignPointLightHelper = new THREE.PointLightHelper( this.greemSignLight, sphereSize );
    // scene.add( greemSignPointLightHelper );
    // const guillotinePointLightHelper = new THREE.SpotLightHelper(this.guillotineLight );
    // scene.add( guillotinePointLightHelper );

  }

  loadCamera() {
    const cameraVector = new THREE.Vector3();
    let camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.z = 350;
    camera.rotateY -= 50;
    return camera;
    // DEBUG
    // var helper = new THREE.CameraHelper( this.camera );
    // this.scene.add( helper );
  }

  setRendererSize() {
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

  startAnimation() {
    this.stop = false;
    this.frameCount = 0;
    this.fps = CONSTANTS.frameRate;
    this.fpsInterval = undefined;
    this.startTime = undefined;
    this.now = undefined;
    this.then = undefined;
    this.elapsed = undefined;
    this.fpsInterval = 1000 / this.fps;
    this.then = Date.now();
    this.startTime = this.then;
    // TODO - where to set this (ensuring that it's initialized and not constantly being set -- we used to be able to pass this as arg
    // this.audioElement.loop = true;

    this.animate();
  }

  animate() {
    // request another frame
    window.requestAnimationFrame(this.animate.bind(this));
    this.renderScene();
  }

  renderScene() {
    const {scene, renderer, camera, mixer, clock} = this; //cameraLight} = this;
    const clockDelta = clock.getDelta();
    this.controls.update(clockDelta);

    // check all animation mixers
    for (let i = 0; i < this.mixers.length; i++) {
      if (this.mixers[i]) {
        this.mixers[i].update(clockDelta);
      }
    }


    camera.position.applyQuaternion(
      new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3( 0, 1, 0 ), // The positive y-axis
        1 / 5 * clockDelta // The amount of rotation to apply this time
    ));
    camera.lookAt( scene.position );


    // for (let i=0; i<this.dancers.length; i++){
    //   let d  = this.dancers[i];
    //   if (d.name === "sheri"){
    //     d.scene.children[0].rotateY = 100;
    //   }
    // }

    // cameraLight.position.copy(camera.position);
    renderer.render(scene, camera);
  }

  render() {
    console.log('rendering');
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

export default Release0008;
