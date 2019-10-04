import * as THREE from 'three';
import { CONTENT } from '../../Content';
import { isMobile } from '../../Utils/BrowserDetection'
import { assetPath9 } from './utils';

export const BUILDINGS_URL = assetPath9("objects/structures/buildings.glb");
export const LARGE = "large";
export const MEDIUM = "medium";
export const SMALL = "small";
export const TALL = "tall";
export const SHORT = "short";
export const WIDTH_BUCKETS = [
    SMALL,
    MEDIUM,
    LARGE,
]
export const HEIGHT_BUCKETS = [
    SHORT,
    TALL,
]
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
const RADIUS_DIVISOR = isMobile ? 60 : 40;
export const WORLD_RADIUS = Math.floor(window.innerWidth / RADIUS_DIVISOR);
export const SIDES = Math.floor(WORLD_RADIUS * (isMobile ? 1.6 : 1.67));
export const TIERS = Math.floor(WORLD_RADIUS * (isMobile ? .8 : .8));
export const MAX_WORLD_FACE_HEIGHT = .5;
export const NEIGHBORHOOD_PROPS = {
    count: WORLD_RADIUS * 1.5,
    maxSize: Math.floor(WORLD_RADIUS / 2),
    maxRadius: WORLD_RADIUS * 6, // Try to get this as low as possible after happy with maxSize (TODO there is probably a decent heuristic so you don't have to eyeball this)
}
export const START_POS = isMobile ?
    new THREE.Vector3(0, 0, WORLD_RADIUS * 5.13) :
    new THREE.Vector3(0, 0, WORLD_RADIUS * 1.13);
export const BASE_SCALE = isMobile ? .2 : 1.;
export const CAMERA_DISTANCE_THRESHOLD = isMobile ? START_POS.z * 1.1 : WORLD_RADIUS + WORLD_RADIUS * .15;