import * as THREE from "three";
import {makeSphere, assetPath4Objects, multiSourceVideo} from './utils'

export const SCREEN_WIDTH = window.innerWidth;
export const SCREEN_HEIGHT = window.innerHeight;
export const CAMERA_SPEED = 0.00016;
export const FIRST_PERSON_CONTROL_SPEED = 0.13;
export const FIRST_PERSON_CONTROL_MOVEMENT = 133;
export const STARTING_POINT = [-975, 0, -975];
export const PROGRESS_EMOJI = ["🥤", "🥪", "🐈", "🌆", "<br/>", "◎"];
export const MAX_START_PROGRESS_LENGTH = 5;
export const MIN_LOAD_TIME = 10;
export const VIDEO_STATE_PLAYING = 'playing';
export const VIDEO_STATE_PAUSED = 'paused';
export const MIND_STATE_CHILLIN_THRESHOLD = 5;
export const CHILLIN_TIME = 12;
export const MIND_STATE_CHILLIN = 'chillin';
export const MIND_STATE_EXITING = 'exiting';
export const MIND_STATE_FLYING = 'flying';



export const SUN = {
  type: 'gltf',
  name: 'sun',
  url: assetPath4Objects('half_sub/scene.gltf'),
  position: [0, 0, 0],
  relativeScale: 130,
  rotateX: .01
}

export const ASTEROIDS = [
  {
    type: 'gltf',
    name: 'chip-asteroid',
    url: assetPath4Objects('potato_chip/scene.gltf'),
    position: [-300, -100, 500],
    rotateX: 0.01,
    rotateY: 0.005,
    rotateZ: -0.001,
    relativeScale: 110,
  },
  {
    type: 'gltf',
    name: 'cat-asteroid',
    url: assetPath4Objects('cat_low_polygon_art_farm_animal/scene.gltf'),
    position: [0, 500, 1200],
    rotateX: 0.005,
    rotateY: -0.05,
    rotateZ: 0.01,
    relativeScale: 5,
  },
  {
    type: 'gltf',
    name: 'cig-asteroid',
    url: assetPath4Objects('cigarette/scene.gltf'),
    position: [0, 200, -800],
    rotateX: 0.001,
    rotateY: -0.005,
    rotateZ: 0.01,
    relativeScale: 40,
  }
]

export const PLANETS = [
  // 1
  {
    type: 'video',
    mimetype: 'video/mp4',
    name: 'cat-girl-world',
    sources: multiSourceVideo('myrtle-central-girl-notices-cat-er'),
    geometry: makeSphere(80),
    position: [-800, 0, -800],
    playbackRate: 1,
    loop: true,
    invert: true,
    volume: 0,
    muted: true,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.0,
    moons: [
      {
        type: 'gltf',
        axis: new THREE.Vector3(1, 0, 0),
        theta: 0.01,
        name: 'cardboard-box-moon',
        url: assetPath4Objects('cardboard_box_sealed/scene.gltf'),
        position: [-800, 0, -1050],
        relativeScale: 25,
      }
    ]
  },
  // 2
  {
    type: 'video',
    mimetype: 'video/mp4',
    name: 'broadway-bongs-video',
    sources: multiSourceVideo('er-broadway-bongs'),
    geometry: makeSphere(75),
    position: [800, -100, -200],
    playbackRate: 1,
    loop: true,
    invert: true,
    volume: 0.01,
    muted: true,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.003,
    moons: [
      {
        type: 'gltf',
        axis: new THREE.Vector3(1, 0, 0),
        theta: 0.01,
        name: 'vape-moon',
        url: assetPath4Objects('vape/scene.gltf'),
        position: [800, -100, -450],
        relativeScale: 3.5,
      }
    ]
  },
  // 3
  {
    type: 'video',
    mimetype: 'video/mp4',
    name: 'evergreen-bike-passing-newport-sign-video',
    sources: multiSourceVideo('evergreen-bike-passing-newport-sign-er'),
    geometry: makeSphere(200),
    position: [-500, 200, 900],
    playbackRate: 1,
    loop: true,
    invert: true,
    volume: 0.01,
    muted: true,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.003,
    moons: [
      {
        type: 'gltf',
        axis: new THREE.Vector3(1, 0, 0),
        theta: 0.01,
        name: 'cigarette-box-moon',
        url: assetPath4Objects('marlboro_cigarettes/scene.gltf'),
        position: [-800, 200, 1150],
        relativeScale: 2,
      }
    ]
  },
  // 4
  {
    type: 'video',
    mimetype: 'video/mp4',
    name: 'eric-mini-market-central-video',
    sources: multiSourceVideo('er-eric-mini-market-central-ave'),
    geometry: makeSphere(33),
    position: [-250, -200, -250],
    playbackRate: 1,
    loop: true,
    invert: true,
    volume: 0.01,
    muted: true,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.003,
    moons: []
  },
  // 5
  {
    type: 'video',
    mimetype: 'video/mp4',
    name: 'myrtle-red-bull-fridge-video',
    sources: multiSourceVideo('myrtle-red-bull-fridge-er'),
    geometry: makeSphere(40),
    position: [800, 300, 800],
    playbackRate: 1,
    loop: true,
    invert: true,
    volume: 0.01,
    muted: true,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.005,
    moons: [
      {
        type: 'gltf',
        axis: new THREE.Vector3(1, 0, 0),
        theta: 0.07,
        name: 'soda-can-moon',
        url: assetPath4Objects('soda_can/scene.gltf'),
        position: [850, 300, 900],
        relativeScale: 8,
      }
    ]
  },
  {
    type: 'video',
    mimetype: 'video/mp4',
    name: 'myrtle-omg-video',
    sources: multiSourceVideo('myrtle-omg-er'),
    geometry: makeSphere(120),
    position: [200, -300, 600],
    playbackRate: 1,
    loop: true,
    invert: true,
    volume: 0.01,
    muted: true,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.003,
    moons: [
      {
        type: 'gltf',
        axis: new THREE.Vector3(1, 0, 0),
        theta: 0.11,
        name: 'doritos-nacho-cheese-moon',
        url: assetPath4Objects('doritos/doritos_nacho_cheese.gltf'),
        position: [300, -300, 550],
        relativeScale: 3,
      }
    ]
  },
  // 7
  {
    type: 'video',
    mimetype: 'video/mp4',
    name: 'pomegranite-ice-box-video',
    sources: multiSourceVideo('er-pomegranite-ice-box'),
    geometry: makeSphere(100),
    position: [-900, 200, 300],
    playbackRate: 1,
    loop: true,
    invert: true,
    volume: 0.01,
    muted: true,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.005,
    moons: [
      {
        type: 'gltf',
        axis: new THREE.Vector3(1, 0, 0),
        theta: 0.01,
        name: 'drumstick-moon',
        url: assetPath4Objects('drumstick/scene.gltf'),
        position: [-700, 200, 200],
        relativeScale: 33,
      }
    ]
  },
  // 8
  {
    type: 'video',
    mimetype: 'video/mp4',
    name: 'broadway-big-boi-bitcoin-video',
    sources: multiSourceVideo('broadway-big-boi-bitcoin-er'),
    geometry: makeSphere(50),
    position: [100, -550, -500],
    playbackRate: 1,
    loop: true,
    invert: true,
    volume: 0.01,
    muted: true,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.003,
    moons: [
      {
        type: 'gltf',
        axis: new THREE.Vector3(1, 0, 0),
        theta: 0.01,
        name: 'lighter-moon',
        url: assetPath4Objects('a_lighter/scene.gltf'),
        position: [200, -550, -500],
        relativeScale: 10,
      }
    ]
  },
  // 9
  {
    type: 'video',
    mimetype: 'video/mp4',
    name: 'day-and-night-pringles-video',
    sources: multiSourceVideo('er-day-and-night-pringles'),
    geometry: makeSphere(40),
    position: [300, 150, -200],
    playbackRate: 1,
    loop: true,
    invert: true,
    volume: 0.1,
    muted: true,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.003,
    moons: [
      // {
      //   type: 'gltf',
      //   axis: new THREE.Vector3(1, 0, 0),
      //   theta: 0.01,
      //   name: 'cool-ranch-moon',
      //   url: assetPath4Objects('doritos/doritos_cool_ranch.gltf'),
      //   position: [350, 150, -250],
      //   relativeScale: 0.25,
      // }
    ]
  },
  // 10
  {
    type: 'video',
    mimetype: 'video/mp4',
    name: 'broadway-tv-elbows-video',
    sources: multiSourceVideo('er-broadway-tvs-n-elbows'),
    geometry: makeSphere(80),
    position: [1000, 500, 500],
    playbackRate: 1,
    loop: true,
    invert: true,
    volume: 0.01,
    muted: true,
    axis: new THREE.Vector3(0, 0, 1).normalize(),
    angle: 0.002,
    moons: []
  },
  // 11
  {
    type: 'video',
    mimetype: 'video/mp4',
    name: '99-cts-broadway-1-video',
    sources: multiSourceVideo('er-99-cts-broadway-1'),
    geometry: makeSphere(40),
    position: [300, 450, 300],
    playbackRate: 1,
    loop: true,
    invert: true,
    volume: 0.01,
    muted: true,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.003,
    moons: [
      {
        type: 'gltf',
        axis: new THREE.Vector3(1, 0, 0),
        theta: 0.01,
        name: 'tp-moon',
        url: assetPath4Objects('simple_toilet_paper/scene.gltf'),
        position: [-350, 450, -350],
        relativeScale: 20,
      }
    ]
  },
  // 12
  {
    type: 'video',
    mimetype: 'video/mp4',
    name: 'johnson-roof-jon-phone-video',
    sources: multiSourceVideo('johnson-roof-jon-phone-er'),
    geometry: makeSphere(200),
    position: [1000, 0, -1000],
    playbackRate: 1,
    loop: true,
    invert: true,
    volume: 0.01,
    muted: true,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.003,
    moons: []
  }
];
