import * as THREE from 'three';
import { CONTENT } from '../../Content';
import { isMobile } from '../../Utils/BrowserDetection'
import { assetPath9 } from './utils';

// ASSETS
export const BUILDINGS_URL = assetPath9("objects/structures/buildings.glb");
export const CAR_URL =  assetPath9("objects/car/car.glb");

// TRACK THEMES
const THEMES = [
    // index matches track list order
    {
        fogColor: 0x0000aa,
        backgroundColor: 0x000000,
        starColors: [0xffffff, 0xfffff0, 0xf9f1f1],
    },
    {
        // fogColor: 0xff0000, i.e. turn off fog
        backgroundColor: 0xff0000,
        starColors: [0xffffff, 0xfffff0, 0xf9f1f1],
    },
    {
        fogColor: 0x0000ff,
        backgroundColor: 0x00ff00,
        starColors: [0xffffff, 0xfffff0, 0xf9f1f1],
    }
]
export const TRACK_LOOKUP = (() => {
    const lookup = {};
    CONTENT["/9"].tracks.forEach((track, index) => lookup[track.id] = {
        bpm: track.bpm,
        name: track.title,
        theme: THEMES[index],
    });
    return lookup;
})();

// ASTEROID CONSTANTS
// This is divided by the window inner width in the constant below so movile screens have smaller asteroids
export const NUM_ASTEROIDS = 8;
const ASTEROID_RADIUS_DIVISOR = isMobile ? 40 : 40;
export const ASTEROID_MAX_RADIUS = Math.floor(window.innerWidth / ASTEROID_RADIUS_DIVISOR);
export const ASTEROID_BELT_RADIUS = 255;
export const ASTEROID_BELT_CENTER = new THREE.Vector3();
export const ASTEROID_MAX_SIDES = Math.floor(ASTEROID_MAX_RADIUS * (isMobile ? 1.6 : 1.6));
export const ASTEROID_MAX_TIERS = Math.floor(ASTEROID_MAX_RADIUS * (isMobile ? .8 : 1.6));
export const ASTEROID_MAX_FACE_NOISE = 1;

// WORLD
export const WORLD_CENTER = new THREE.Vector3();
export const WORLD_RADIUS = ASTEROID_MAX_RADIUS;
export const MAX_WORLD_FACE_HEIGHT = ASTEROID_MAX_FACE_NOISE;
export const WORLD_SIDES = 34;
export const WORLD_TIERS = 34;
export const WORLD_BUILDING_CORRIDOR_WIDTH = isMobile ? 26 : 26;
export const WORLD_ROAD_WIDTH = isMobile ? 17 : 17;
export const MAX_ROAD_ELEVATION = WORLD_RADIUS + 8;
// export const WORLD_ROAD_PATH = (() => {
//     const circle = new THREE.CircleGeometry(WORLD_RADIUS);//MAX_ROAD_ELEVATION)
//     const points = circle.vertices.reverse() // reverse it so driver is going in expected dir
//     return points.slice(0, points.length - 2); // don't overlap the loop (rm last elt)
// })();
export const WORLD_ROAD_PATH = [
    new THREE.Vector3(WORLD_RADIUS, 0, 0),
    new THREE.Vector3(3 * WORLD_RADIUS / 4, 0, 3 * WORLD_RADIUS / 4),
    new THREE.Vector3(WORLD_RADIUS / 2, 0, WORLD_RADIUS / 2),
    new THREE.Vector3(WORLD_RADIUS / 4, 0, WORLD_RADIUS / 4),
    new THREE.Vector3(0, 0, WORLD_RADIUS),
    new THREE.Vector3(3 * -WORLD_RADIUS / 4, 0, 3 * WORLD_RADIUS / 4),
    new THREE.Vector3(-WORLD_RADIUS / 2, 0, WORLD_RADIUS / 2),
    new THREE.Vector3(-WORLD_RADIUS / 4, 0, WORLD_RADIUS / 4),
    new THREE.Vector3(-WORLD_RADIUS, 0, 0),
    new THREE.Vector3(3 * -WORLD_RADIUS / 4, 0, 3 * -WORLD_RADIUS / 4),
    new THREE.Vector3(-WORLD_RADIUS / 2, 0, -WORLD_RADIUS / 2),
    new THREE.Vector3(-WORLD_RADIUS / 4, 0, -WORLD_RADIUS / 4),
    new THREE.Vector3(0, 0, -WORLD_RADIUS),
    new THREE.Vector3(3 * WORLD_RADIUS / 4, 0, 4 * -WORLD_RADIUS / 4),
    new THREE.Vector3(WORLD_RADIUS / 2, 0, -WORLD_RADIUS / 2),
    new THREE.Vector3(WORLD_RADIUS / 4, 0, -WORLD_RADIUS / 4),
];

// BUILDING
export const BUILDING_BASE_SCALE = 1.;
// model geometry categories
export const LARGE = "large";
export const MEDIUM = "medium";
export const SMALL = "small";
export const TALL = "tall";
export const SHORT = "short";
export const BUILDING_WIDTH_BUCKETS = [
    SMALL,
    MEDIUM,
    LARGE,
]
export const BUILDING_HEIGHT_BUCKETS = [
    SHORT,
    TALL,
]

// CAR
// model geometry names
export const BUTTON_LIFE = "button_life"
export const BUTTON_DREAM = "button_dream"
export const BUTTON_SWING = "button_swing"
export const BUTTON_NATURAL = "button_natural"
export const SPEEDOMETER = "speedometer"
export const DASH_BUTTONS = [
    BUTTON_LIFE,
    BUTTON_DREAM,
    BUTTON_SWING,
    BUTTON_NATURAL,
]