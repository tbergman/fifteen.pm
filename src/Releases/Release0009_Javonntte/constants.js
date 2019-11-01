import * as THREE from 'three';
import { CONTENT } from '../../Content';
import { isMobile } from '../../Utils/BrowserDetection'
import { assetPath9 } from './utils';

// ASSETS
export const BUILDINGS_URL = assetPath9("objects/structures/buildings.glb");
export const CAR_URL = assetPath9("objects/car/car.glb");
export const LOGO_URL = assetPath9("objects/logo/logo.glb");

// WORLD
export const WORLD_CENTER = new THREE.Vector3();
const WORLD_RADIUS_DIVISOR = isMobile ? 40 : 40;
export const WORLD_RADIUS = Math.floor(window.innerWidth / WORLD_RADIUS_DIVISOR);
export const MAX_WORLD_FACE_HEIGHT = 1;
export const WORLD_SIDES = 24;
export const WORLD_TIERS = 24;
export const WORLD_BUILDING_CORRIDOR_WIDTH = isMobile ? 20 : 20;
export const WORLD_ROAD_WIDTH = isMobile ? 3 : WORLD_RADIUS / 7;
export const MAX_ROAD_ELEVATION = WORLD_RADIUS + 8;
export const WORLD_ROAD_PATH = (() => {
    const circle = new THREE.CircleGeometry(WORLD_RADIUS, WORLD_RADIUS);
    const points = circle.vertices.reverse(); // reverse it so driver is going in expected dir
    return points.slice(0, points.length - 2); // don't overlap the loop (rm last elt)
})();

// LOGO
// TODO use world radius?
export const LOGO_POS = new THREE.Vector3(
    -500,
    -300,
    0,
)

// ASTEROID CONSTANTS
// This is divided by the window inner width in the constant below so movile screens have smaller asteroids
export const NUM_ASTEROIDS = 8;
export const ASTEROID_MAX_RADIUS = WORLD_RADIUS;
export const ASTEROID_BELT_RADIUS = WORLD_RADIUS * 8;
// export const ASTEROID_BELT_CENTER = WORLD_ROAD_PATH[0];// Ensure this is a point on the road so we have at least 1 asteroid intersecting it for a fun drive-thru
export const ASTEROID_MAX_SIDES = Math.floor(ASTEROID_MAX_RADIUS * (isMobile ? 1.6 : 1.6));
export const ASTEROID_MAX_TIERS = Math.floor(ASTEROID_MAX_RADIUS * (isMobile ? .8 : 1.6));
export const ASTEROID_MAX_FACE_NOISE = MAX_WORLD_FACE_HEIGHT;

// BUILDING
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


// TRACK INFO
export const TRACK_THEMES = [
    // index matches track list order
    {
        textFillColor: 0xf0ffff,
        fog: new THREE.FogExp2(0xefd1b5, 0.0025),
        background: new THREE.Color(0x000000),
        starColors: [0x555555, 0x333333, 0x1a1a1a],
        world: 0x0000af,
        asteroid: {insideColor: 0x0000ff, outsideColor: 0xf0f0f0}
    },
    {
        textFillColor: 0xf0ffff,
        fog: new THREE.FogExp2(0xefd1b5, 0.0025),
        background: new THREE.Color(0xffffff),
        starColors: [0x0000ef, 0x111111, 0x222222],
        world: 0xffff10,
        asteroid: {insideColor: 0xf000af, outsideColor: 0xfff000}
    },
    {
        textFillColor: 0xf0ffff,
        fog: new THREE.FogExp2(0xefd1b5, 0.025),
        background: new THREE.Color(0x00ff00),
        starColors: [0xffffff, 0xfffff0, 0xf9f1f1],
        world: 0xf0ffff,
        asteroid: {insideColor: 0x00a0ff, outsideColor: 0x00fff0}
    },
    {
        textFillColor: 0xf0ffff,
        fog: new THREE.FogExp2(0x0faf00, 0.05),
        background: new THREE.Color(0xff0000),
        starColors: [0xffffff, 0xfffff0, 0xf9f1f1],
        world: 0x00affb,
        asteroid: {insideColor: 0x0b00ff, outsideColor: 0xfaf23b}
    },
]

export const TRACK_METADATA = (() => {
    const lookup = {};
    CONTENT["/9"].tracks.forEach((track, index) => lookup[track.id] = {
        bpm: track.bpm,
        name: track.title,
        theme: TRACK_THEMES[index],
        index: index,
    });
    return lookup;
})();
export const TRACK_LOOKUP = {
    "life": "679771262",
    "swing": "693475855",
    "natural": "679771259",
    "dream": "679771253",
}

// CAR
// model geometry names
export const DASH_BUTTONS = [
    "button_life",
    "button_swing",
    "button_natural",
    "button_dream",
]
export const STEERING_WHEEL_PARTS = [
    "gloves",
    "sleeves",
    "wheel",
    "wheel_internal"
]