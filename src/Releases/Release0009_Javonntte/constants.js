import * as THREE from 'three';
import { CONTENT } from '../../Content';
import { isMobile } from '../../Utils/BrowserDetection'
import { assetPath9 } from './utils';

// ASSETS
export const BUILDINGS_URL = assetPath9("objects/structures/buildings.glb");
export const CAR_URL =  assetPath9("objects/car/car.glb");

// TRACK THEMES
export const THEMES = [
    // index matches track list order
    {
        textFillColor: 0xf0ffff,
        fog: new THREE.FogExp2( 0xefd1b5, 0.0025 ),
        background: new THREE.Color(0x000000),
        starColors: [0xffffff, 0xfffff0, 0xf9f1f1],
    },
    {
        textFillColor: 0xf0ffff,
        fog: new THREE.FogExp2( 0xefd1b5, 0.25 ),
        background: new THREE.Color(0xff0000),
        starColors: [0xffffff, 0xfffff0, 0xf9f1f1],
    },
    {
        textFillColor: 0xf0ffff,
        fog: new THREE.FogExp2( 0xefd1b5, 0.025 ),
        background: new THREE.Color(0x00ff00),
        starColors: [0xffffff, 0xfffff0, 0xf9f1f1],
    },
    {
        textFillColor: 0xf0ffff,
        fog: new THREE.FogExp2( 0x0faf00, 0.5 ),
        background: new THREE.Color(0xff0000),
        starColors: [0xffffff, 0xfffff0, 0xf9f1f1],
    },
]

export const TRACK_BUTTON_LOOKUP = {
    "button_life": "679771262",
    "button_swing": "693475855",
    "button_natural": "679771259",
    "button_dream": "679771253", 
}
export const TRACK_METADATA = (() => {
    const lookup = {};
    CONTENT["/9"].tracks.forEach((track, index) => lookup[track.id] = {
        bpm: track.bpm,
        name: track.title,
        theme: THEMES[index],
        index: index,
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
export const WORLD_SIDES = 24;
export const WORLD_TIERS = 24;
export const WORLD_BUILDING_CORRIDOR_WIDTH = isMobile ? 26 : 26;
export const WORLD_ROAD_WIDTH = isMobile ? 3 : WORLD_RADIUS / 6;
export const MAX_ROAD_ELEVATION = WORLD_RADIUS + 8;
export const WORLD_ROAD_PATH = (() => {
    const circle = new THREE.CircleGeometry(WORLD_RADIUS, WORLD_RADIUS);//MAX_ROAD_ELEVATION)
    const points = circle.vertices.reverse() // reverse it so driver is going in expected dir
    return points.slice(0, points.length - 2); // don't overlap the loop (rm last elt)
})();

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