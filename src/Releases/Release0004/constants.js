import * as THREE from "three";
import {makeSphere, assetPath4Objects, assetPath4Videos} from './utils'

export const SCREEN_WIDTH = window.innerWidth;
export const SCREEN_HEIGHT = window.innerHeight;
export const CAMERA_SPEED = 0.00029;
export const FIRST_PERSON_CONTROL_SPEED = 0.15;
export const FIRST_PERSON_CONTROL_MOVEMENT = 150;
export const STARTING_POINT = [-875, 0, -875];
export const PROGRESS_EMOJI = ["🥤", "🥪", "🐈", "🌆", "<br/>", "◎"];
export const MAX_START_PROGRESS_LENGTH = 13;
export const VIDEO_STATE_PLAYING = 'playing';
export const VIDEO_STATE_PAUSED = 'paused';
export const MIND_STATE_CHILLIN_THRESHOLD = 10;
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
    name: 'cat-girl-world',
    url: assetPath4Videos('myrtle-central-girl-notices-cat-er.mp4'),
    geometry: makeSphere(100),
    position: [-800, 0, -800],
    playbackRate: 1,
    loop: true,
    invert: true,
    volume: 0.005,
    muted: false,
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
    name: 'broadway-bongs-video',
    url: assetPath4Videos('er-broadway-bongs.mp4'),
    geometry: makeSphere(75),
    position: [800, -100, -200],
    playbackRate: 1,
    loop: true,
    invert: true,
    volume: 0.01,
    muted: true,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.007,
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
    name: 'evergreen-bike-passing-newport-sign-video',
    url: assetPath4Videos('evergreen-bike-passing-newport-sign-er.mp4'),
    geometry: makeSphere(200),
    position: [-500, 200, 900],
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
    name: 'eric-mini-market-central-video',
    url: assetPath4Videos('er-eric-mini-market-central-ave.mp4'),
    geometry: makeSphere(33),
    position: [-250, -200, -250],
    playbackRate: 1,
    loop: true,
    invert: true,
    volume: 0.01,
    muted: true,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.005,
    moons: []
  },
  // 5
  {
    type: 'video',
    name: 'myrtle-red-bull-fridge-video',
    url: assetPath4Videos('myrtle-red-bull-fridge-er.mp4'),
    geometry: makeSphere(40),
    position: [800, 300, 800],
    playbackRate: 1,
    loop: true,
    invert: true,
    volume: 0.01,
    muted: true,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.01,
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
  // 6
  {
    type: 'video',
    name: 'myrtle-omg-video',
    url: assetPath4Videos('myrtle-omg-er.mp4'),
    geometry: makeSphere(120),
    position: [200, -300, 600],
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
    name: 'pomegranite-ice-box-video',
    url: assetPath4Videos('er-pomegranite-ice-box.mp4'),
    geometry: makeSphere(100),
    position: [-900, 200, 300],
    playbackRate: 1,
    loop: true,
    invert: true,
    volume: 0.01,
    muted: true,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.03,
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
    name: 'broadway-big-boi-bitcoin-video',
    url: assetPath4Videos('broadway-big-boi-bitcoin-er.mp4'),
    geometry: makeSphere(50),
    position: [100, -550, -500],
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
        name: 'atm-moon',
        url: assetPath4Objects('atm/scene.gltf'),
        position: [200, -550, -500],
        relativeScale: 0.3,
      }
    ]
  },
  // 9
  {
    type: 'video',
    name: 'day-and-night-pringles-video',
    url: assetPath4Videos('er-day-and-night-pringles.mp4'),
    geometry: makeSphere(40),
    position: [300, 150, -200],
    playbackRate: 1,
    loop: true,
    invert: true,
    volume: 0.1,
    muted: true,
    axis: new THREE.Vector3(0, 1, 0).normalize(),
    angle: 0.005,
    moons: [
      {
        type: 'gltf',
        axis: new THREE.Vector3(1, 0, 0),
        theta: 0.01,
        name: 'pringles-moon',
        url: assetPath4Objects('pringles/scene.gltf'),
        position: [350, 150, -250],
        relativeScale: 0.25,
      }
    ]
  },
  // 10
  // 11
  {
    type: 'video',
    name: 'broadway-tv-elbows-video',
    url: assetPath4Videos('er-broadway-tvs-n-elbows.mp4'),
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
  // 12
  {
    type: 'video',
    name: '99-cts-broadway-1-video',
    url: assetPath4Videos('er-99-cts-broadway-1.mp4'),
    geometry: makeSphere(40),
    position: [300, 450, 300],
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
        name: 'tp-moon',
        url: assetPath4Objects('simple_toilet_paper/scene.gltf'),
        position: [-350, 450, -350],
        relativeScale: 20,
      }
    ]
  },
  // 13
  {
    type: 'video',
    name: 'johnson-roof-jon-phone-video',
    url: assetPath4Videos('johnson-roof-jon-phone-er.mp4'),
    geometry: makeSphere(200),
    position: [1000, 0, -1000],
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
        name: 'cool-ranch-moon',
        url: assetPath4Objects('doritos/doritos_cool_ranch.gltf'),
        position: [-325, -200, -325],
        relativeScale: 1,
      }
    ]
  }
];
