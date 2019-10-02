import { CONTENT } from '../../Content';
import {isMobile} from '../../Utils/BrowserDetection'
import { assetPath9 } from './utils';

export const BUILDINGS_URL = assetPath9("objects/structures/buildings.glb");
export const EXTRA_LARGE = "xlarge";
export const LARGE = "large";
export const MEDIUM = "medium";
export const SMALL = "small";
export const TALL = "tall";
export const SHORT = "short";
// export const ARCH = "arch";
// export const FUTURE = "future";
// export const PRESENT = "present";
export const WIDTH_BUCKETS = [
    SMALL,
    MEDIUM,
    LARGE,
    EXTRA_LARGE
]
export const HEIGHT_BUCKETS = [
    SHORT,
    TALL,
]
// New
export const TOWER = "tower";
export const RIBBONY = "ribbony";
export const TWIRLY = "twirly";
export const DIAMOND = "diamond";
export const LOW = "low";
export const TILE_CATEGORIES = [
    TOWER,
    RIBBONY,
    TWIRLY,
    DIAMOND,
    LOW,
];
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
export const WORLD_RADIUS = isMobile ? 6 : 48;
export const SIDES = Math.floor(WORLD_RADIUS * 1.6);
export const TIERS = Math.floor(WORLD_RADIUS * .8);
export const MAX_WORLD_FACE_HEIGHT = 2.;
export const NEIGHBORHOOD_PROPS = {
    count: WORLD_RADIUS,
    maxSize: Math.floor(WORLD_RADIUS / 2),
    maxRadius: WORLD_RADIUS * 6, // Try to get this as low as possible after happy with maxSize (TODO there is probably a decent heuristic so you don't have to eyeball this)
}
