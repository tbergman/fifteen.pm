import * as THREE from 'three';
import { CONTENT } from '../../Content';
import { isMobile } from '../../Utils/BrowserDetection'
import { assetPath9 } from './utils';

// ASSETS
export const BUILDINGS_URL = assetPath9("objects/structures/buildings.glb");
export const CADILLAC_HOOD_URL = assetPath9("objects/car/cadillac-hood2.glb")
export const STEERING_WHEEL_URL = assetPath9("objects/car/steering-wheel.glb")



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
export const NUM_ASTEROIDS = 20;
const ASTEROID_RADIUS_DIVISOR = isMobile ? 40 : 40;
export const ASTEROID_MAX_RADIUS = Math.floor(window.innerWidth / ASTEROID_RADIUS_DIVISOR);
console.log("radius", ASTEROID_MAX_RADIUS);
export const ASTEROID_BELT_RADIUS = 555;
export const ASTEROID_BELT_CENTER = new THREE.Vector3();
export const ASTEROID_MAX_SIDES = Math.floor(ASTEROID_MAX_RADIUS * (isMobile ? 1.6 : 1.6));
export const ASTEROID_MAX_TIERS = Math.floor(ASTEROID_MAX_RADIUS * (isMobile ? .8 : 1.6));
export const ASTEROID_MAX_FACE_NOISE = 1;
export const ASTEROID_NEIGHBORHOOD_PROPS = {
    count: 100,//WORLD_RADIUS * WORLD_RADIUS, //WORLD_RADIUS * (isMobile ? 2. : 2.),
    maxSize: isMobile ? ASTEROID_MAX_RADIUS * 2 : Math.floor(ASTEROID_MAX_RADIUS) * 2,
    maxRadius: ASTEROID_MAX_RADIUS * 6, // Try to get this as low as possible after happy with maxSize (TODO there is probably a decent heuristic so you don't have to eyeball this)
}

// CAMERA
const STARTING_Z = isMobile ? ASTEROID_MAX_RADIUS * 1.1 : ASTEROID_MAX_RADIUS * 1.1;
// max camera distance from center
export const START_POS = new THREE.Vector3(0, 0,STARTING_Z);

// WORLD
export const WORLD_CENTER = new THREE.Vector3();
export const WORLD_NEIGHBORHOOD_PROPS = ASTEROID_NEIGHBORHOOD_PROPS;
// TODO getting the warnings gone for  min
export const WORLD_RADIUS = ASTEROID_MAX_RADIUS;
export const MAX_WORLD_FACE_HEIGHT=ASTEROID_MAX_FACE_NOISE;
export const WORLD_SIDES = 34;
export const WORLD_TIERS = 34;
export const WORLD_ROAD_WIDTH = isMobile ? 17 : 17;
export const WORLD_BUILDING_CORRIDOR_WIDTH = isMobile ? 26 : 26;

// BUILDING
export const BUILDING_BASE_SCALE = 1.;
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