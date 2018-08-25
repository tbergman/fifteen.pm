import React, {PureComponent, Fragment} from 'react';
import * as THREE from "three";
import debounce from 'lodash/debounce';
import './Release.css';
import SoundcloudPlayer from '../SoundcloudPlayer';
import Purchase from '../Purchase';
import AudioStreamer from "../Utils/Audio/AudioStreamer";
import {OrbitControls} from "../Utils/OrbitControls";
import {isMobile} from "../Utils/BrowserDetection";
import {FBXLoader} from "../Utils/FBXLoader.js"
import * as CANNON from "cannon";
import {clothBody, clothPhysMaterial} from "../Utils/Cloth";
import {CannonDebugRenderer} from "../Utils/CannonDebugRenderer";

const BPM = 117;
const BEAT_TIME = (60 / BPM);
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const ROTATION_SPEED = 0.00475;
const A_CROSS_FADER_BUFFER = BEAT_TIME * 2;
const B_CROSS_FADER_BUFFER = BEAT_TIME * 2;

const MAX_VELOCITY = 50;
const MIN_VELOCITY = -50;


const SCENES = [
  {
    src: 'assets/straps-0.webm',
    geometry: new THREE.SphereBufferGeometry(500, 500, 500),
    // width: 1640,
    // height: 60,
    loop: true,
    muted: false,
    transparent: true,
    opacity: 0.7,
    color: 0xFFFFFF,
    playbackRate: 0.5,
    // target: new THREE.Vector3(4, -50, 1),
    camera_x: 1,
    camera_y: -90,
    camera_z: 6,
    scaleNotCalled: true
  },
  // {
  //   src: 'assets/straps-0.webm',
  //   geometry: new THREE.BoxBufferGeometry(500, 500, 500),
  //   width: 640,
  //   height: 360,
  //   loop: false,
  //   muted: true,
  //   transparent: true,
  //   opacity: 0.87,
  //   color: 0xFFFFFF,
  //   playbackRate: 0.5,
  //   target: new THREE.Vector3(4, -35, 1),
  //   camera_x: 1,
  //   camera_y: -45,
  //   camera_z: 10,
  //   scaleNotCalled: true
  // },
  // {
  //   src: 'assets/straps-0.webm',
  //   geometry: new THREE.SphereBufferGeometry(500, 60, 60),
  //   width: 640,
  //   height: 360,
  //   loop: false,
  //   muted: true,
  //   transparent: true,
  //   opacity: 0.87,
  //   color: 0xFFFFFF,
  //   playbackRate: 0.5,
  //   target: new THREE.Vector3(4, -35, 1),
  //   camera_x: 1,
  //   camera_y: -75,
  //   camera_z: 6,
  //   scaleNotCalled: true
  // },
  // {
  //   src: 'assets/straps-0.webm',
  //   geometry: new THREE.BoxBufferGeometry(250, 500, 750),
  //   width: 640,
  //   height: 360,
  //   loop: false,
  //   muted: true,
  //   transparent: true,
  //   opacity: 0.87,
  //   color: 0xFFFFFF,
  //   playbackRate: 0.5,
  //   target: new THREE.Vector3(4, -35, 1),
  //   camera_x: 1,
  //   camera_y: -45,
  //   camera_z: 10,
  //   scaleNotCalled: true
  // },
];

const FLOATING_OBJECTS = [
  {
    url: 'assets/releases/4/models/Doritos_01.fbx',
    object: undefined,
    physics: undefined,

  },
   {
     url: 'assets/releases/4/models/Doritos_02.fbx',
     object: undefined,
     physics: undefined,
   },
   {
     url: 'assets/releases/4/models/Doritos_03.fbx',
     object: undefined,
     physics: undefined,
   },
   {
     url: 'assets/releases/4/models/Doritos_04.fbx',
     object: undefined,
     physics: undefined,
   },
   {
     url: 'assets/releases/4/models/Doritos_05.fbx',
     object: undefined,
     physics: undefined,
   },
   {
     url: 'assets/releases/4/models/Doritos_06.fbx',
     object: undefined,
     physics: undefined,
   }

]

class Release0004 extends PureComponent {
  constructor() {
    super();
    this.container = document.getElementById('container');
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    // this.camera.position.set(100, 200, 300);
    // this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
    // this.camera.target = new THREE.Vector3(0,0,0);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(WIDTH, HEIGHT);
    this.renderer.setClearColor(0xffffff, 0);
    this.controls = new OrbitControls(this.camera);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
    let light0 = new THREE.HemisphereLight(0xffffff, 0x444444);
    light0.position.set(0, 200, 0);
    this.scene.add(light0);

    this.lat = 0;
    this.lon = 0;
    this.onMouseDownLon = 0;
    this.texture_placeholder;
    this.isUserInteracting = false;
    this.onMouseDownMouseX = 0;
    this.onMouseDownMouseY = 0;
    this.onMouseDownLat = 0;
    this.phi = 0;
    this.theta = 0;
    this.distance = 50;
    this.onPointerDownPointerX = 0;
    this.onPointerDownPointerY = 0;
    this.onPointerDownLon = 0;
    this.onPointerDownLat = 0;
    this.idx = 0;
    this.AVideo = document.createElement('video');
    this.BVideo = document.createElement('video');
    this.BCrossFaderOn = false;
    this.ACrossFaderOn = false;
    this.AMesh = undefined;
    this.BMesh = undefined;
    // var size = 2000;
    // var divisions = 200;
    // var gridHelper = new THREE.GridHelper( size, divisions );
    // this.scene.add( gridHelper );
    this.tmpObjectsList = [];
  }


  componentDidMount() {
    window.addEventListener("resize", this.onWindowResize, false);
    window.addEventListener("mousemove", this.onMouseMove, false);
    window.addEventListener("touchstart", this.onTouch, false);
    window.addEventListener("touchend", this.onTouchEnd, false);
    window.addEventListener("load", this.onLoad, false);
    document.addEventListener('mousedown', this.onDocumentMouseDown, false);
    document.addEventListener('mousemove', this.onDocumentMouseMove, false);
    document.addEventListener('mouseup', this.onDocumentMouseUp, false);
    document.addEventListener('wheel', this.onDocumentMouseWheel, false);
    // this.AVideo.addEventListener('ended', this.removeSceneA, false);
    // this.AVideo.addEventListener('timeupdate', this.crossFaderA, false);
    // this.BVideo.addEventListener('ended', this.removeSceneB, false);
    // this.BVideo.addEventListener('timeupdate', this.crossFaderB, false);
    this.init();
    this.animate();
  }

  init = () => {
    this.initCannon();
    this.container.appendChild(this.renderer.domElement);
    this.swapScene({channel: 'A'});


    this.initRoomSurfaces();
    this.initFloatingObjects();
    // this.initContactMaterials();
  }

  initCannon = () => {
    this.timeStep = 1 / 20;
    this.world = new CANNON.World();
    this.world.gravity.set(0, 0, 0);
    this.world.broadphase = new CANNON.NaiveBroadphase();
    this.world.solver.iterations = 1;
    // this.world.add(clothBody);
    // this.hardMaterials.push(clothPhysMaterial);
    this.cannonDebugRenderer = new CannonDebugRenderer(this.scene, this.world);
  }

  initRoomSurfaces = () => {
    this.initRoomSurface()
  }

  initRoomSurface = () => {
    // let position, width, height, axis;
    // let angle = 1;
    //   // physics
    // let position = new CANNON.Vec3(0, 0, 0);
    // let physMaterial = new CANNON.Material({});
    // let body = new CANNON.Body({
    //   mass: 0,
    //   material: physMaterial,
    //   position: position
    // });
    // body.addShape(new CANNON.Sphere(500)); // found from boundingbox assignment/check
    // // body.quaternion.setFromAxisAngle(axis, angle);
    // this.world.addBody(body);
    //   // visual
    //   const geometry = new THREE.PlaneGeometry(width, height);
    //   geometry.faces.forEach(face => face.color = 0x000000);
    //   const material = new THREE.MeshStandardMaterial({
    //     emissive: 0x000000,
    //     emissiveIntensity: 1,
    //     //side: THREE.DoubleSide,
    //     // transparent: true,
    //     // alphaTest: 0.1,
    //     // opacity: 0.9,
    //     color: 0x000000
    //   });
    //   const mesh = new THREE.Mesh(geometry, material);
    //   // mesh.flipSided = false;
    //   mesh.receiveShadow = true;
    //   mesh.castShadow = false;
    //   this.scene.add(mesh);
    //   // combine
    //   mesh.position.copy(body.position);
    //   mesh.quaternion.copy(body.quaternion);
    //   return physMaterial;
    // }
  }

  initFloatingObjects = () => {

    for (let i = 0; i < FLOATING_OBJECTS.length; i++) {
      this.initFloatingObject(FLOATING_OBJECTS[i])
    }
  }

  initFloatingObject = (floatingObject) => {
    var loader = new FBXLoader();
    loader.load(floatingObject.url, object => {
      floatingObject.object = object;
      // this.chips1Graphics = object;
      // TODO SET POSITION
      floatingObject.object.children[0].position.set(0, 0, 0);
      this.scene.add(floatingObject.object);
      floatingObject.object.scale.set(10, 10, 10);
      // TODO TMP THIS CAUSES A BUG REMOVE
      this.camera.lookAt(floatingObject.object.children[0]);
      // this.chips1 = object;
      // this.chips1.position.set(1, 1, 10)
      this.ballRadius = 1; // TODO
      let shape = new CANNON.Sphere(this.ballRadius);
      let mass = 1;
      let material = new CANNON.Material();
      floatingObject.physics = new CANNON.Body({
        mass: mass,
        material: material,
        position: new CANNON.Vec3(0, 0, 0)
      });

      floatingObject.physics.addShape(shape);
      // this.chips1Physics.linearDamping = 0.01;
      floatingObject.physics.velocity.set(0, -30, -1);
      floatingObject.physics.angularVelocity.set(0, 0, -.01);
      // this.chips1Physics.angularDamping = 0.5;
      this.world.addBody(floatingObject.physics);

      // this.camera.lookAt(this.chips1);
    });
  }



  // initFloatingObject = (floatingObject) => {
  //   var loader = new FBXLoader();
  //   loader.load(floatingObject.url, object => {
  //     this.chips1Graphics = object;
  //     // TODO SET POSITION
  //     this.chips1Graphics.children[0].position.set(0, 0, 0);
  //     this.scene.add(this.chips1Graphics);
  //     this.chips1Graphics.scale.set(10, 10, 10);
  //     // TODO TMP THIS CAUSES A BUG REMOVE
  //     this.camera.lookAt(this.chips1Graphics.children[0]);
  //     // this.chips1 = object;
  //     // this.chips1.position.set(1, 1, 10)
  //     this.ballRadius = this.chips1Graphics;
  //     let shape = new CANNON.Sphere(this.ballRadius);
  //     let mass = 1;
  //     let material = new CANNON.Material();
  //     this.chips1Physics = new CANNON.Body({
  //       mass: mass,
  //       material: material,
  //       position: new CANNON.Vec3(0, 0, 0)
  //     });
  //
  //     this.chips1Physics.addShape(shape);
  //     // this.chips1Physics.linearDamping = 0.01;
  //     this.chips1Physics.velocity.set(0, -30, -1);
  //     this.chips1Physics.angularVelocity.set(0, 0, -.01);
  //     // this.chips1Physics.angularDamping = 0.5;
  //     this.world.addBody(this.chips1Physics);
  //
  //     // this.camera.lookAt(this.chips1);
  //   });
  // }

  crossFaderA = () => {
    this.AEnd = this.AVideo.duration - A_CROSS_FADER_BUFFER;
    if (this.AVideo.currentTime >= this.AEnd && this.AEnd !== NaN) {
      if (!this.ACrossFaderOn) {
        this.swapScene({channel: 'B'});
        this.ACrossFaderOn = true;
        this.scene.remove(this.AMesh);
        this.isUserInteracting = false;
      }
    }
  }

  crossFaderB = () => {
    this.BEnd = (this.BVideo.duration - B_CROSS_FADER_BUFFER);
    if (this.BVideo.currentTime >= this.BEnd && this.BEnd !== NaN) {
      if (!this.BCrossFaderOn) {
        this.swapScene({channel: 'A'});
        this.BCrossFaderOn = true;
        this.scene.remove(this.BMesh);
        this.isUserInteracting = false;
      }

    }
  }
  removeSceneA = () => {
    this.BCrossFaderOn = false;
    this.scene.remove(this.AMesh);
  }

  removeSceneB = () => {
    this.ACrossFaderOn = false;
    this.scene.remove(this.BMesh);
    // this.swapScene();

  }
  addAVideo = (props) => {
    this.AVideo.src = props.src;
    this.AVideo.crossOrigin = 'anonymous';
    // this.AVideo.width = props.width;
    // this.AVideo.height = props.height;
    this.AVideo.loop = props.loop;
    this.AVideo.muted = props.muted;
    this.AVideo.autoplay = true;
    this.AVideo.playbackRate = props.playbackRate;
    this.AVideo.play();
    this.activeChannel = 'A';
    let texture = new THREE.VideoTexture(this.AVideo);
    texture.minFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;
    let material = new THREE.MeshBasicMaterial({map: texture, transparent: props.transparent, opacity: props.opacity});
    let mesh = new THREE.Mesh(props.geometry, material);
    this.camera.position.x = props.camera_x;
    this.camera.position.y = props.camera_y;
    this.camera.position.z = props.camera_z;
    this.camera.target = props.target;
    // this.camera.lookAt(this.camera.target);
    this.AMesh = mesh;
    this.AMesh.renderOrder = 1;
    this.videoABasicBoundingBox = new THREE.Box3().setFromObject(this.AMesh);

    this.scene.add(this.AMesh);
  }

  addBVideo = (props) => {
    this.BVideo.src = props.src;
    this.BVideo.crossOrigin = 'anonymous';
    /*this.BVideo.width = props.width;*/
    // this.BVideo.height = props.height;
    this.BVideo.loop = props.loop;
    this.BVideo.muted = props.muted;
    this.BVideo.autoplay = true;
    this.BVideo.playbackRate = props.playbackRate;
    this.BVideo.play();
    this.activeChannel = 'B';
    let texture = new THREE.VideoTexture(this.BVideo);
    texture.minFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;
    let material = new THREE.MeshBasicMaterial(
      {map: texture, transparent: props.transparent, opacity: props.opacity});
    let mesh = new THREE.Mesh(props.geometry, material);
    this.camera.position.x = props.camera_x;
    this.camera.position.y = props.camera_y;
    this.camera.position.z = props.camera_z;
    this.camera.target = props.target;
    // this.camera.lookAt(this.camera.target);
    this.BMesh = mesh;
    this.BMesh.renderOrder = 1;
    this.scene.add(this.BMesh);
  }

  swapScene = (opts) => {
    if (this.idx >= SCENES.length) {
      this.idx = 0;
    }
    let props = SCENES[this.idx];
    if (props.scaleNotCalled) {
      props.geometry.scale(-1, 1, 1);
      props.scaleNotCalled = false;
    }
    // this.renderer.setPixelRatio(window.devicePixelRatio);
    if (opts.channel === 'A') {
      this.addAVideo(props);
    } else {
      this.addBVideo(props);
    }

    this.idx += 1;

  }

  componentWillUnmount() {
    this.stop();
    window.removeEventListener("resize", this.onWindowResize, false);
    window.removeEventListener("mousemove", this.onMouseMove, false);
    window.removeEventListener("touchstart", this.onTouch, false);
    window.removeEventListener("touchend", this.onTouchEnd, false);
    window.removeEventListener("load", this.onLoad, false);
    this.AVideo.removeEventListener('ended', this.removeSceneA, false);
    this.AVideo.removeEventListener('timeupdate', this.crossFaderA, false);
    this.BVideo.removeEventListener('ended', this.removeSceneB, false);
    this.BVideo.removeEventListener('timeupdate', this.crossFaderB, false);
    this.container.removeChild(this.renderer.domElement);
  }

  onDocumentMouseDown = (event) => {
    event.preventDefault();
    this.isUserInteracting = true;
    this.onPointerDownPointerX = event.clientX;
    this.onPointerDownPointerY = event.clientY;
    this.onPointerDownLon = this.lon;
    this.onPointerDownLat = this.lat;
    this.isUserInteracting = true;
  }

  onDocumentMouseMove = (event) => {
    if (this.isUserInteracting === true) {
      this.lon = (this.onPointerDownPointerX - event.clientX) * 0.1 + this.onPointerDownLon;
      this.lat = (event.clientY - this.onPointerDownPointerY) * 0.1 + this.onPointerDownLat;
      this.isUserInteracting = true;
    }
  }

  onDocumentMouseUp = () => {
    this.isUserInteracting = false;
  }

  onDocumentMouseWheel = (event) => {
    this.isUserInteracting = true;
    this.distance += event.deltaY * 0.05;
    this.distance = THREE.Math.clamp(this.distance, 1, 50);
  }

  onWindowResize = debounce(() => {
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;
    this.renderer.setSize(WIDTH, HEIGHT);
    this.camera.aspect = WIDTH / HEIGHT;
    this.camera.updateProjectionMatrix();
  }, 50);


  onLoad = (event) => {
    // this.audioStream.connect();
  }

  stop = () => {
    cancelAnimationFrame(this.frameId);
  }

  updatePhysics = () => {
    // Step the physics world
    this.world.step(this.timeStep);
    this.updateFloatingObjects();
  }

  updateFloatingObjects = () => {
    for (let i = 0; i < FLOATING_OBJECTS.length; i++) {
      this.updateFloatingObject(FLOATING_OBJECTS[i]);
    }
  }

  updateFloatingObject = (floatingObject) => {
    if (floatingObject.object !== undefined) {
      this.checkRoomCollisions(floatingObject);
      this.clampVelocity(floatingObject.physics);
      // Copy coordinates from Cannon.js to Three.js
      floatingObject.object.position.copy(floatingObject.physics.position);
      floatingObject.object.quaternion.copy(floatingObject.physics.quaternion);
    }
  }


  clampVelocity = (body) => {
    if (body.velocity.x > MAX_VELOCITY) {
      body.velocity.x = MAX_VELOCITY
    }
    if (body.velocity.x < MIN_VELOCITY) {
      body.velocity.x = MIN_VELOCITY
    }
    if (body.velocity.y > MAX_VELOCITY) {
      body.velocity.y = MAX_VELOCITY
    }
    if (body.velocity.y < MIN_VELOCITY) {
      body.velocity.y = MIN_VELOCITY
    }
    if (body.velocity.z > MAX_VELOCITY) {
      body.velocity.z = MAX_VELOCITY
    }
    if (body.velocity.z < MIN_VELOCITY) {
      body.velocity.z = MIN_VELOCITY
    }
  }

  checkObjVelocity = () => {

  }

  checkRoomCollisions = (floatingObject) => {
    // still haven't figured out how you would add a physics object to the 'room' as a single object like a sphere or a cube and handle collisions no the interior of the cube. it seems like it should be easy but i think that primitive objects like spheres and cubes are solid.

    // TODO use the logic here to create hollowed out geometries
    if (floatingObject.object.position.y <= this.videoABasicBoundingBox.min.y) {
      console.log("THE OBJ IS Y LESS THAN THE VIDEO")
      floatingObject.physics.position.y = this.videoABasicBoundingBox.min.y + 1;
      floatingObject.physics.velocity.y *= -1;
    }
    if (floatingObject.object.position.y >= this.videoABasicBoundingBox.max.y) {
      console.log("THE OBJ IS Y GREATER THAN THE VIDEO")
      floatingObject.physics.position.y = this.videoABasicBoundingBox.max.y - 1;
      floatingObject.physics.velocity.y *= -1;
    }
    if (floatingObject.object.position.x <= this.videoABasicBoundingBox.min.x) {
      console.log("THE OBJ IS X LESS THAN THE VIDEO")
      floatingObject.physics.position.x = this.videoABasicBoundingBox.min.x + 1;
      floatingObject.physics.velocity.x *= -1;
    }
    if (floatingObject.object.position.x >= this.videoABasicBoundingBox.max.x) {
      console.log("THE OBJ IS X GREATER THAN THE VIDEO")
      floatingObject.physics.position.x = this.videoABasicBoundingBox.max.x - 1;
      floatingObject.physics.velocity.x *= -1;
    }
    if (floatingObject.object.position.z <= this.videoABasicBoundingBox.min.z) {
      console.log("THE OBJ IS Z GREATER THAN THE VIDEO")
      floatingObject.physics.position.z = this.videoABasicBoundingBox.min.z + 1;
      floatingObject.physics.velocity.z *= -1;
    }
    if (floatingObject.object.position.z >= this.videoABasicBoundingBox.max.z) {
      console.log("THE OBJ IS Z LESS THAN THE VIDEO")
      floatingObject.physics.position.z = this.videoABasicBoundingBox.max.z - 1;
      floatingObject.physics.velocity.z *= -1;
    }
    // console.log("CHIPS POS", this.chips1Graphics.position);
  }

  animate = () => {
    this.frameId = window.requestAnimationFrame(this.animate);
    this.renderScene();
  }

  renderScene = () => {

    // if (this.isUserInteracting) {
    //   this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
    //   this.phi = THREE.Math.degToRad( 90 - this.lat );
    //   this.theta = THREE.Math.degToRad( this.lon );
    //   this.camera.position.x = this.distance * Math.sin( this.phi ) * Math.cos( this.theta );
    //   this.camera.position.y = this.distance * Math.cos( this.phi );
    //   this.camera.position.z = this.distance * Math.sin( this.phi ) * Math.sin( this.theta );
    // } else {
    // let x = this.camera.position.x;
    // let z = this.camera.position.z;
    // this.camera.position.x = x * Math.cos(ROTATION_SPEED) + z * Math.sin(ROTATION_SPEED);
    // this.camera.position.z = z * Math.cos(ROTATION_SPEED) - x * Math.sin(ROTATION_SPEED);
    // }
    // this.camera.lookAt(this.camera.target);
    this.renderer.render(this.scene, this.camera);
    this.updatePhysics();
  }

  render() {
    return (

      <Fragment>
        <div className="release">
          <div ref={element => this.container = element}/>
          <SoundcloudPlayer
            trackId='267037220'
            message='BODEGA CHILL'
            inputRef={el => this.audioElement = el}
            fillColor="red"
          />
          <Purchase fillColor="red" href='https://gltd.bandcamp.com/track/lets-beach'/>
        </div>
      </Fragment>
    );
  }
}


export default Release0004;
