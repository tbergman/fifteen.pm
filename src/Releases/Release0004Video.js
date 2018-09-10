import React, {PureComponent, Fragment} from 'react';
import * as THREE from "three";
import './Release.css';
import SoundcloudPlayer from '../SoundcloudPlayer';
import Purchase from '../Purchase';
import debounce from "lodash/debounce";
import {assetPath} from "../Utils/assets";
import {FirstPersonControls} from '../Utils/FirstPersonControls';
import GLTFLoader from 'three-gltf-loader';

const BPM = 130;
const RANGE = 1000;
const BEAT_TIME = (60 / BPM);
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
const VIDEO_STATE_PLAYING = 'playing';
const VIDEO_STATE_PAUSED = 'paused';
const MIND_STATE_CHILLIN = 'chillin';
const MIND_STATE_EXITING = 'exiting';
const MIND_STATE_FLYING = 'flying';
const MIND_STATE_ENTERING = 'entering';

const assetPath4 = (p) => {
  return assetPath("4/" + p);
}

const assetPath4Videos = (p) => {
  return assetPath4("videos/" + p);
}

const assetPath4Models = (p) => {
  return assetPath4("models/" + p);
}

const assetPath4Images = (p) => {
  return assetPath4("images/" + p)
}

const makeSphere = (x) => {
  return new THREE.SphereBufferGeometry(
    x,
    x,
    x
  )
};

const WORLD_UNIT = 500;
const MAX_VELOCITY = 10;
const MIN_VELOCITY = -10;

const BODEGAS = [
  // 1
  {
    src: assetPath4Videos('myrtle-central-girl-notices-cat-er.webm'),
    geometry: makeSphere(25),
    position: [WORLD_UNIT, 0, 0],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.01,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  // 2
  {
    src: assetPath4Videos('er-broadway-bongs.webm'),
    geometry: makeSphere(25),
    position: [-250, 0, 0],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.01,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  // 3
  {
    src: assetPath4Videos('evergreen-bike-passing-newport-sign-er.webm'),
    geometry: makeSphere(25),
    position: [WORLD_UNIT, 0, 0],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.01,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  // 4
  {
    src: assetPath4Videos('er-eric-mini-market-central-ave.webm'),
    geometry: makeSphere(25),
    position: [WORLD_UNIT, 0, 0],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.01,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  // 5
  {
    src: assetPath4Videos('myrtle-red-bull-fridge-er.webm'),
    geometry: makeSphere(25),
    position: [WORLD_UNIT, 0, 0],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.01,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  // 6
  {
    src: assetPath4Videos('myrtle-door-close-er.webm'),
    geometry: makeSphere(25),
    position: [WORLD_UNIT, 0, 0],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.01,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  // 7
  {
    src: assetPath4Videos('myrtle-omg-er.webm'),
    geometry: makeSphere(25),
    position: [WORLD_UNIT, 0, 0],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.01,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  // 8
  {
    src: assetPath4Videos('er-pomegranite-ice-box.webm'),
    geometry: makeSphere(25),
    position: [0, -500, 0],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.01,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  // 9
  {
    src: assetPath4Videos('er-pomegranite-deli.webm'),
    geometry: makeSphere(25),
    position: [-250, -250, 0],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.01,
    visible: false,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  // 10
  {
    src: assetPath4Videos('broadway-big-boi-bitcoin-er.webm'),
    geometry: makeSphere(25),
    position: [WORLD_UNIT, 0, 0],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.01,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  // 11
  {
    src: assetPath4Videos('er-day-and-night-pringles.webm'),
    geometry: makeSphere(25),
    position: [0, -250, 0],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.01,
    visible: false,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  // 12
  {
    src: assetPath4Videos('er-broadway-tvs-n-elbows.webm'),
    geometry: makeSphere(25),
    position: [0, 0, -500],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.01,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  // 13
  {
    src: assetPath4Videos('er-cholulita-bite.webm'),
    geometry: makeSphere(25),
    position: [0, 0, 500],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.01,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  // 14
  {
    src: assetPath4Videos('er-99-cts-broadway-1.webm'),
    geometry: makeSphere(25),
    position: [-250, -250, 0],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.01,
    visible: false,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  // 15
  {
    src: assetPath4Videos('er-99-cts-broadway-5.webm'),
    geometry: makeSphere(25),
    position: [-250, -250, 0],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.01,
    visible: false,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  // 16
  {
    src: assetPath4Videos('food-bazaar-parking-lot-er.webm'),
    geometry: makeSphere(25),
    position: [WORLD_UNIT, 0, 0],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.01,
    color: 0xFFFFFF,
    playbackRate: 1
  },
  // 17
  {
    src: assetPath4Videos('johnson-roof-jon-phone-er.webm'),
    geometry: makeSphere(25),
    position: [WORLD_UNIT, 0, 0],
    transparent: false,
    opacity: 1,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.01,
    color: 0xFFFFFF,
    playbackRate: 1
  }
];

const FLOATERS = [
  {
    url: assetPath4Models('green_lighter.gltf'),
    mass: 1,
    relativeScale: .1,
    object: undefined,
    physics: undefined,
    bbox: undefined,
  },
  // remove
  {
    url: assetPath4Models('half_sub.gltf'),
    mass: 1,
    relativeScale: 1,
    object: undefined,
    physics: undefined,
    bbox: undefined,
  },
  {
    url: assetPath4Models('doritos_spicy_nacho.gltf'),
    mass: 1,
    relativeScale: 1,
    object: undefined,
    physics: undefined,
    bbox: undefined,
  },
  {
    url: assetPath4Models('doritos_cool_ranch.gltf'),
    mass: 1,
    relativeScale: 1,
    object: undefined,
    physics: undefined,
    bbox: undefined,
  },
  {
    url: assetPath4Models('doritos_spicy_sweet_chili.gltf'),
    mass: 1,
    relativeScale: 1,
    object: undefined,
    physics: undefined,
    bbox: undefined,
  },
  {
    url: assetPath4Models('doritos_salsa_verde.gltf'),
    mass: 1,
    relativeScale: 1,
    object: undefined,
    physics: undefined,
    bbox: undefined,
  },
  {
    url: assetPath4Models('doritos_nacho_cheese.gltf'),
    mass: 1,
    relativeScale: 1,
    object: undefined,
    physics: undefined,
    bbox: undefined,
  },
  {
    url: assetPath4Models('half_sub.gltf'),
    mass: 1,
    relativeScale: 100,
    object: undefined,
    physics: undefined,
    bbox: undefined,
  },
];

class Release0004Video extends PureComponent {
  constructor() {
    super();
    this.startTime = new Date();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.camera = new THREE.PerspectiveCamera(80, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 3000);
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = -30;
    this.camera.lookAt(new THREE.Vector3());
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.quaternion = new THREE.Quaternion();

    this.clock = new THREE.Clock();
    let light0 = new THREE.HemisphereLight(0xffffff, 0x444444);
    light0.position.set(0, 200, 0);
    this.scene.add(light0);


    this.controls = new FirstPersonControls(this.camera);
    this.controls.lookSpeed = 0.08;
    this.controls.movementSpeed = 180;
    this.controls.enabled = true;
    this.controls.mouseMotionActive = false;

    // this.raycaster = new THREE.Raycaster();
    // this.mouse = new THREE.Vector3();
    this.wormholePath = undefined;
    this.cameraRadians = 0;
    // var size = 2000;
    // var divisions = 200;
    // var gridHelper = new THREE.GridHelper( size, divisions );
    // this.scene.add( gridHelper );
    this.bodegas = new THREE.Object3D();
  }

  state = {
    curBodegaIdx: 0,
    prevBodegaIdx: 0,
    curVideoState: VIDEO_STATE_PAUSED,
    mindState: MIND_STATE_CHILLIN
  }

  componentDidMount() {
    window.addEventListener("resize", this.onWindowResize, false);
    window.addEventListener('click', this.onClick, false);
    window.addEventListener("load", this.onLoad, false);
    this.init();
    this.animate();
  }

  componentWillUnmount() {
    this.stop();
    window.removeEventListener("resize", this.onWindowResize, false);
    window.removeEventListener('click', this.onClick, false);
    window.removeEventListener("load", this.onLoad, false);
    this.container.removeChild(this.renderer.domElement);
  }

  init = () => {
    // this.initCannon();
    this.initWormholePath();
    this.initFloaters();
    this.initBodegas();
    this.container.appendChild(this.renderer.domElement);
    this.playCurrentBodega();
  }

  onWindowResize = debounce(() => {
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;
    this.renderer.setSize(WIDTH, HEIGHT);
    this.camera.aspect = WIDTH / HEIGHT;
    this.camera.updateProjectionMatrix();
  }, 50);

  onClick = (e) => {
    console.log("MOSUE DOWN", this.state.mindState, MIND_STATE_CHILLIN)
    e.preventDefault();
    if (this.state.mindState === MIND_STATE_CHILLIN) {
      this.enterWormhole();
    }
  }

  onLoad = (event) => {
    console.log('loaded!')
  }

  stop = () => {
    cancelAnimationFrame(this.frameId);
    this.deallocate();
  }

  // initCannon = () => {
  //   this.timeStep = 1 / 30;
  //   this.world = new CANNON.World();
  //   this.world.gravity.set(0, 0, 0);
  //   this.world.broadphase = new CANNON.NaiveBroadphase();
  //   this.world.solver.iterations = 1;
  //   this.cannonDebugRenderer = new CannonDebugRenderer(this.scene, this.world);
  // }

  initFloaters = () => {
    let floaterPositions = this.wormholePath.getPoints(FLOATERS.length);
    for (let i = 0; i < FLOATERS.length; i++) {
      this.initFloater(FLOATERS[i], floaterPositions[i]);
    }
  }


  initFloater = (floater, floaterPos) => {
    // let loader = new FBXLoader();
    const loader = new GLTFLoader();
    loader.load(floater.url, object => {
      floater.object = object.scene;
      floater.object.scale.multiplyScalar(floater.relativeScale);
      floater.object.position.set(floaterPos.x, floaterPos.y, floaterPos.z);
      this.scene.add(floater.object);
      let floaterChild = floater.object.children[0];
      // floaterChild.geometry.computeBoundingBox();
      floaterChild.position.set(0, 0, 0);//floaterPos.x, floaterPos.y, floaterPos.z);
      // let floaterSize = floaterChild.geometry.boundingBox.getSize();
      // let physicsSize = new CANNON.Vec3(floaterSize.x / 2.0, floaterSize.y / 2.0, floaterSize.z / 2.0);
      // let shape = new CANNON.Box(physicsSize);
      // let mass = floater.mass;
      // let material = new CANNON.Material();
      // floater.physics = new CANNON.Body({
      //   mass: mass,
      //   material: material,
      //   position: new CANNON.Vec3(floaterPos.x, floaterPos.y, floaterPos.z)
      // });
      // floater.physics.addShape(shape);
      // let polarity = THREE.Math.randInt(-1, 1) > 0 ? 1 : -1;
      // let velocityUnit = 1;
      // let velocity = polarity * velocityUnit;
      // floater.physics.velocity.set(velocity, velocity, velocity);
      // floater.physics.linearDamping = 0.01;
      // floater.physics.angularVelocity.set(velocity, velocity, velocity );
      // floater.physics.angularDamping = 0.5;
      // this.world.addBody(floater.physics);
      // create physics bounding box
      // let pos = floater.object.position;
      // let boxSize = 30;
      // floater.bbox = new THREE.Box3(
      //   new THREE.Vector3(
      //     -Math.abs(pos.x - boxSize),
      //     -Math.abs(pos.y - boxSize),
      //     -Math.abs(pos.z - boxSize)
      //   ),
      //   new THREE.Vector3(
      //     Math.abs(pos.x + boxSize),
      //     Math.abs(pos.y + boxSize),
      //     Math.abs(pos.z + boxSize)
      //   )
      // )
    });
  }

  initWormholePath = () => {
    let pathVertices = [];
    let numPathVertices = 30;
    let maxVertexDistance = 160;
    pathVertices.push(new THREE.Vector3(0, 0, 0));
    for (let i = 1; i < numPathVertices; i++) {
      let prevPos = pathVertices[i - 1];
      let randVect3 = new THREE.Vector3(
        THREE.Math.randInt(prevPos.x - maxVertexDistance, prevPos.x + maxVertexDistance),
        THREE.Math.randInt(prevPos.y - maxVertexDistance, prevPos.y + maxVertexDistance),
        THREE.Math.randInt(prevPos.z - maxVertexDistance, prevPos.z + maxVertexDistance)
      );
      pathVertices.push(randVect3)
    }
    this.wormholePath = new THREE.CatmullRomCurve3(pathVertices);
    this.wormholePath.closed = true;
    this.wormholePath.arcLengthDivisions = numPathVertices;
    // this.visualizeWormhole(); // for devving
  }

  visualizeWormhole = () => {
    // let points = this.wormholePath.getPoints(this.wormholePath.arcLengthDivisions);
    let geometry = new THREE.Geometry();
    // let texture = new THREE.TextureLoader().load(assetPath4Images('kitkat.png'));
    // let material = new THREE.MeshBasicMaterial( { map: texture } );
    // console.log(material);
    geometry.vertices = this.wormholePath.getSpacedPoints(100);//this.wormholePath.arcLengthDivisions);
    let material = new THREE.LineBasicMaterial({color: 0xff0000});
    let curveObject = new THREE.Line(geometry, material);
    this.scene.add(curveObject);
  };

  initBodegas = () => {
    let bodegaPositions = this.wormholePath.getPoints(BODEGAS.length);
    for (let i = 0; i < BODEGAS.length; i++) {
      let props = BODEGAS[i];
      props.geometry.scale(-1, 1, 1);
      props.geometry.computeBoundingBox();
      let videoMesh = this.initBodegaMesh(props);
      let videoPos = bodegaPositions[i];
      videoMesh.position.set(videoPos.x, videoPos.y, videoPos.z);
      this.bodegas.add(videoMesh);
    }
    this.scene.add(this.bodegas);
    this.computeBodegaBBoxes();
  }

  initBodegaMesh = (props) => {
    let video = document.createElement('video');
    video.src = props.src;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playbackRate = props.playbackRate;
    let texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;
    let material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: props.transparent,
      opacity: props.opacity
    });
    let bodegaMesh = new THREE.Mesh(props.geometry, material);
    bodegaMesh.renderOrder = 1;
    bodegaMesh.rotation.y = Math.sin(0.6);
    bodegaMesh.userData.video = video;
    bodegaMesh.userData.props = props;
    bodegaMesh.userData.texture = texture;
    return bodegaMesh;
  }

  computeBodegaBBoxes = () => {
    for (let i = 0; i < this.bodegas.children.length; i++) {
      this.bodegas.children[i].userData.bbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
      this.bodegas.children[i].userData.bbox.setFromObject(this.bodegas.children[i]);
    }
  }

  rotateBodegas = () => {
    for (let i = 0; i < this.bodegas.children.length; i++) {
      this.quaternion.setFromAxisAngle(
        this.bodegas.children[i].userData.props.axis,
        this.bodegas.children[i].userData.props.angle);
      this.bodegas.children[i].applyQuaternion(this.quaternion);
    }
  }

  pauseBodegas = () => {
    for (var i = 0; i < this.bodegas.children.length; i++) {
      this.bodegas.children[i].userData.video.pause();
    }
  }

  deallocate = () => {
    // RE: https://stackoverflow.com/questions/20997669/memory-leak-in-three-js
    for (let i = 0; i < this.scene.children.length; i++) {
      this.scene.remove(this.scene.children[i]);
      this.renderer.deallocateObject(this.scene.children[i]);
    }
  }
  setCameraAtCurrentBodega = () => {
    this.camera.position.set(this.bodegas.children[this.state.curBodegaIdx].position);
  }

  playCurrentBodega = () => {
    let {video, texture, props} = this.bodegas.children[this.state.curBodegaIdx].userData;
    video.play();
    // update the video at 24 fps or pre-process in ffmpeg
    // https://github.com/mrdoob/three.js/issues/13379
    // let interval = setInterval( function () {
    //   if ( video.readyState >= video.HAVE_CURRENT_DATA ) {
    //     texture.needsUpdate = true;
    //   }
    // }, 1000 / 24 );
    // this.bodegas.children[this.state.curBodegaIdx].userData.interval = interval;

  }

  pausePreviousBodega = () => {
    let {video, interval} = this.bodegas.children[this.state.prevBodegaIdx].userData;
    video.pause();
    // clear frame update interval
    // clearInterval(interval);
  }

  randomBodega = () => {
    return this.bodegas.children[Math.floor(Math.random() * this.bodegas.children.length)];
  }

  enterWormhole = () => {
    // console.log('exiting')
    this.setState({
      mindState: MIND_STATE_EXITING,
      prevBodegaIdx: this.state.curBodegaIdx,
      curBodegaIdx: this.state.curBodegaIdx + 1 === this.bodegas.children.length ? 0 : this.state.curBodegaIdx + 1
    })
    this.pauseBodegas();

  };

  updateOrbitControls = () => {
    let time = Date.now();
    this.controls.update(time - this.startTime);
  }

  animate = () => {
    this.time = Date.now();
    this.frameId = window.requestAnimationFrame(this.animate);
    this.renderScene();
  }

  updateCameraPos = () => {
    let curBodega = this.bodegas.children[this.state.curBodegaIdx];
    let prevBodega = this.bodegas.children[this.state.prevBodegaIdx];
    let distanceFromBodega = this.camera.position.distanceTo(curBodega.position);

    // have we arrived at the next bodega?
    // todo: fix this constant
    if (distanceFromBodega < 7 &&
      this.state.mindState !== MIND_STATE_EXITING &&
      this.state.mindState !== MIND_STATE_CHILLIN) {
      // console.log('chillin')
      this.setState({mindState: MIND_STATE_CHILLIN});
    }
    // are we in transit ?
    if (this.state.mindState !== MIND_STATE_CHILLIN) {

      this.cameraRadians += .0003;
      let holePos = this.wormholePath.getPoint(this.cameraRadians);
      this.camera.position.set(holePos.x, holePos.y, holePos.z);

      // check if we're exiting the previous bodega
      if (this.state.mindState !== MIND_STATE_EXITING &&
        this.state.mindState !== MIND_STATE_FLYING &&
        prevBodega.userData.bbox.containsPoint(this.camera.position)) {
        // console.log('exiting')


        this.setState({mindState: MIND_STATE_EXITING});
        // check if were in space
      } else if (this.state.mindState !== MIND_STATE_FLYING &&
        this.state.mindState !== MIND_STATE_ENTERING) {
        // console.log('flying')
        // play next bodega once were in space
        // this.controls.enabled = false;


        this.camera.lookAt(curBodega.position);
        // console.log(prevBodega);
        if (this.state.curVideoState !== VIDEO_STATE_PLAYING) {
          this.playCurrentBodega();
          this.setState({curVideoState: VIDEO_STATE_PLAYING});
          this.setState({
            curVideoState: VIDEO_STATE_PAUSED,
            mindState: MIND_STATE_FLYING
          });
        }
        // check if we're entering the next bodega
        if (this.state.mindState !== MIND_STATE_ENTERING &&
          curBodega.userData.bbox.containsPoint(this.camera.position)) {
          // console.log('entering')
          // pause previous bodega when we're entering the next one

          this.pausePreviousBodega();
          this.setState({mindState: MIND_STATE_ENTERING});
        }
      }
    }
  }

  updateControls = () => {
    if (this.state.mindState === MIND_STATE_CHILLIN) {
      this.controls.update(this.clock.getDelta());
    }
  }

  updateFloaters = () => {
    for (let i = 0; i < FLOATERS.length; i++) {
      this.updateFloater(FLOATERS[i], i);
    }
  }

  // clampVelocity = (body) => {
  //   // TODO how to do this elegantly?
  //   if (body.velocity.x > MAX_VELOCITY) {
  //     body.velocity.x = MAX_VELOCITY
  //   }
  //   if (body.velocity.x < MIN_VELOCITY) {
  //     body.velocity.x = MIN_VELOCITY
  //   }
  //   if (body.velocity.y > MAX_VELOCITY) {
  //     body.velocity.y = MAX_VELOCITY
  //   }
  //   if (body.velocity.y < MIN_VELOCITY) {
  //     body.velocity.y = MIN_VELOCITY
  //   }
  //   if (body.velocity.z > MAX_VELOCITY) {
  //     body.velocity.z = MAX_VELOCITY
  //   }
  //   if (body.velocity.z < MIN_VELOCITY) {
  //     body.velocity.z = MIN_VELOCITY
  //   }
  // }

  // checkRoomCollisions = (floater, idx) => {
  //   // TODO we need to make a hollowed out object to have the space itself act as a physics collision object
  //   // let curScene = CURRENT_SCENE; // TODO switch out with this.getCurrentScene()
  //
  //   if (floater.object.position.y <= floater.bbox.min.y) {
  //     // console.log("THE OBJ IS Y LESS THAN THE VIDEO", idx)
  //     floater.physics.position.y = floater.bbox.min.y + 1;
  //     floater.physics.velocity.y *= -1;
  //   }
  //   if (floater.object.position.y >= floater.bbox.max.y) {
  //     // console.log("THE OBJ IS Y GREATER THAN THE VIDEO", idx)
  //     floater.physics.position.y = floater.bbox.max.y - 1;
  //     floater.physics.velocity.y *= -1;
  //   }
  //   if (floater.object.position.x <= floater.bbox.min.x) {
  //     // console.log("THE OBJ IS X LESS THAN THE VIDEO", idx)
  //     floater.physics.position.x = floater.bbox.min.x + 1;
  //     floater.physics.velocity.x *= -1;
  //   }
  //   if (floater.object.position.x >= floater.bbox.max.x) {
  //     // console.log("THE OBJ IS X GREATER THAN THE VIDEO", idx)
  //     floater.physics.position.x = floater.bbox.max.x - 1;
  //     floater.physics.velocity.x *= -1;
  //   }
  //   if (floater.object.position.z <= floater.bbox.min.z) {
  //     // console.log("THE OBJ IS Z GREATER THAN THE VIDEO",idx)
  //     floater.physics.position.z = floater.bbox.min.z + 1;
  //     floater.physics.velocity.z *= -1;
  //   }
  //   if (floater.object.position.z >= floater.bbox.max.z) {
  //     // console.log("THE OBJ IS Z LESS THAN THE VIDEO", idx)
  //     floater.physics.position.z = floater.bbox.max.z - 1;
  //     floater.physics.velocity.z *= -1;
  //   }
  // }

  updateFloater = (floater, idx) => {
    if (floater.object !== undefined) {
      floater.object.rotateX(.001);
      floater.object.rotateY(.001);
      // floater.rotation.x += Math.PI / 2;
      // this.checkRoomCollisions(floater, idx);
      // this.clampVelocity(floater.physics);
      // // Copy coordinates from Cannon.js to Three.js
      // floater.object.position.copy(floater.physics.position);
      // floater.object.quaternion.copy(floater.physics.quaternion);
    }
  }
  //
  // updatePhysics = () => {
  //   // Step the physics world
  //   this.world.step(this.timeStep);
  // }

  renderScene = () => {
    this.rotateBodegas();
    this.updateFloaters();
    this.updateControls();
    this.updateCameraPos();
    // this.updatePhysics();
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <Fragment>
        <div className="release">
          <div ref={element => this.container = element}/>
        </div>
        {/*<SoundcloudPlayer*/}
        {/*trackId='267037220'*/}
        {/*message='JONNY JONNY CANNON'*/}
        {/*inputRef={el => this.audioElement = el}*/}
        {/*fillColor="red"*/}
        {/*/>*/}
        <Purchase fillColor="red" href='https://gltd.bandcamp.com/track/lets-beach'/>
      </Fragment>
    );
  }
}

export default Release0004Video;
