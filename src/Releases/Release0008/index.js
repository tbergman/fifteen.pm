import React, { Component, Fragment } from 'react';
import { loadGLTF, loadVideo } from "../../Utils/Loaders";
import { assetPath } from "../../Utils/assets";
import { DRACOLoader } from "three-full";//gltf-loader";
import { CONSTANTS } from "../Release0008/constants";
import { CONTENT } from "../../Main/Content";
import Menu from '../../Main/Menu/Menu';

const THREE = window.THREE = require('three');
require('three/examples/js/loaders/GLTFLoader');
require('three/examples/js/controls/OrbitControls');

export const assetPath8 = (p) => {
  return assetPath("8/" + p);
}


// TODO These are both essentially being used in release 4 as 'utils' for that release
export const multiSourceVideo = (path) => ([
  { type: 'video/mp4', src: assetPath8(`videos/${path}.mp4`) },
  { type: 'video/webm', src: assetPath8(`videos/${path}.webm`) }
]);

export const makeSphere = (x) => {
  return new THREE.SphereBufferGeometry(x, 24, 24);
};


class Release0008 extends Component {
  componentDidMount() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
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

    // TODO add dancers back in/refactor
    // const sheriParams = {
    //   url: assetPath8("objects/sheri/scene.gltf"),
    //   name: "sheri",
    //   position: [80, -250, -50],
    //   rotateX: 0,
    //   rotateY: 0,
    //   rotateZ: 0,
    //   relativeScale: 1,
    //   loader: this.loader,
    //   onSuccess: gltf => this.setupDancer(gltf)
    // }
    // loadGLTF({...sheriParams});

    // const samParams = {
    //   url: assetPath8("objects/sam/scene.gltf"),
    //   name: "sam",
    //   position: [180, -250, 100],
    //   rotateX: 0,
    //   rotateY: 0,
    //   rotateZ: 0,
    //   relativeScale: 1,
    //   loader: this.loader,
    //   onSuccess: gltf => this.setupDancer(gltf)
    // }
    // loadGLTF({...samParams});

    // const athenaParams = {
    //   url: assetPath8("objects/athena/scene.gltf"),
    //   name: "athena",
    //   position: [-100, -250, 150],
    //   rotateX: 0,
    //   rotateY: 0,
    //   rotateZ: 0,
    //   relativeScale: 1.25,
    //   loader: this.loader,
    //   onSuccess: gltf => this.setupDancer(gltf)
    // }
    // loadGLTF({...athenaParams});

    // TODO - how to randomize this animation (can create extra versions of file)?
    const waterParams = {
      url: assetPath8("objects/room/wave.gltf"), //greem-room.glb"),
      name: "room",
      position: [0, 10, 0],
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      relativeScale: 200,
      loader: this.loader,
      onSuccess: gltf => this.setupWater(gltf)
    }
    loadGLTF({ ...waterParams })

    // TODO - this will randomize a choice from a selection of mashed-up videos (and be refactored)
    let obj = {
      type: 'video',
      mimetype: 'video/mp4',
      name: 'test-vid',
      sources: multiSourceVideo('output-trimmed-780wide-360_0372-tranquil-stream'), //black-bag-light-er'),
      geometry: makeSphere(360),
      position: [0, 0, 0],
      playbackRate: 1,
      loop: true,
      invert: true,
      volume: 0,
      muted: true,
      axis: new THREE.Vector3(0, 0, 0).normalize(),
      angle: 0.0,
      scale: 10
    }
    let videoMesh = loadVideo({ ...obj, computeBoundingSphere: false });
    videoMesh.material.transparent = true; // TODO -- this wont work on all browsers:  https://discourse.threejs.org/t/transparent-channel-on-video-texture/1200
    videoMesh.material.opacity = 0.5;
    console.log(videoMesh.material);
    this.scene.add(videoMesh);

    // TODO - background video - randomized/similar mashup
    let flatVid = {
      type: 'video',
      mimetype: 'video/mp4',
      name: 'scratch-video',
      sources: multiSourceVideo('scratch-video'),
      geometry: new THREE.PlaneBufferGeometry(100, 100), // TODO -- extra args to reduce size?
      position: [150, 150, 200], // TODO randomize
      playbackRate: 1,
      loop: true,
      invert: true,
      volume: 0.01,
      muted: true,
      // rotateY: CONSTANTS.televisionRotateY
      // axis: new THREE.Vector3(0, 1, 0).normalize(),
      // angle: 0.003,
    }
    // obj.rotateY = 150; // TO DO rotate on x/raise y? to give it a slanted looking down from above feel
    flatVid.rotateX = -20;
    let flatVidMesh = loadVideo({ ...flatVid, computeBoundingSphere: true });
    flatVidMesh.material.transparent = true; // TODO -- this wont work on all browsers:  https://discourse.threejs.org/t/transparent-channel-on-video-texture/1200
    flatVidMesh.material.opacity = 0.05;
    flatVidMesh.userData.video.play();
    this.scene.add(flatVidMesh);


    // TODO clean up/organize lights
    const light = new THREE.AmbientLight(0x404040, 5.5); // soft white light
    // light.position.set(0, 10, 0);
    // let light = new THREE.RectAreaLight( 0xffffbb, 1.0, 15, 15 );
    // const helper = new THREE.RectAreaLightHelper( light );
    this.scene.add(light);
    // this.scene.add( helper );

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enabled = true;
    this.controls.zoomSpeed = 0.5;

    this.container.appendChild(this.renderer.domElement);
    this.setRendererSize();
    window.addEventListener("resize", this.setRendererSize, false);
    this.animate()
  }

  // TODO - all of this scene initialization shouldnt be in callback use promise
  setupDancer(gltf) {
    this.scene.add(gltf.scene);
    this.setupModelAnimation(gltf);
    this.dancers.push(gltf);
  }
 
  setupWater(gltf) {
    const { scene } = this;
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

  loadCamera() {
    let camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.z = -100;
    camera.rotateY -= 50;
    camera.lookAt(this.scene.position);
    console.log(camera.position);
    
    // DEBUG
    var helper = new THREE.CameraHelper( camera );
    this.scene.add( helper );
    return camera;
  }

  setRendererSize() {
    // TODO BUGGY
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

  animate() {
    // request another frame
    window.requestAnimationFrame(this.animate.bind(this));
    this.renderScene();
  }

  renderScene() {
    const { scene, renderer, camera, mixer, clock } = this;
    const clockDelta = clock.getDelta();
    this.controls.update(clockDelta);
    // check all animation mixers
    for (let i = 0; i < this.mixers.length; i++) {
      if (this.mixers[i]) {
        this.mixers[i].update(clockDelta);
      }
    }
    // camera.position.applyQuaternion(
    //   new THREE.Quaternion().setFromAxisAngle(
    //     new THREE.Vector3(0, 1, 0), // The positive y-axis
    //     1 / 5 * clockDelta // The amount of rotation to apply this time
    //   ));
    // camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }

  render() {
    return (
      <Fragment>
        <div ref={element => this.container = element} />
        {/* <Menu
          content={CONTENT[window.location.pathname]}
          menuIconFillColor="white"
          didEnterWorld={() => {
            this.setState({ hasEntered: true });
          }}
          /> */}
      </Fragment>
    );
  }
}

export default Release0008;
