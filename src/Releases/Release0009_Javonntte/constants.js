import { CONTENT } from '../../Content';
import { assetPath9 } from './utils';

export const BUILDINGS_URL = assetPath9("objects/structures/buildings.glb");
export const EXTRA_LARGE = "extra_large";
export const LARGE = "large";
export const MEDIUM = "medium";
export const SMALL = "small";
export const TALL = "tall";
export const SHORT = "short";
export const ARCH = "arch";
export const FUTURE = "future";
export const PRESENT = "present";
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
export const TOWERING = "towering";
export const FLORAL = "floral"
export const LOW = "low"
export const TILE_CATEGORIES = [
    TOWERING,
    FLORAL,
    LOW,
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
        backgroundColor: 0x000000,
        starColors: [0xffffff, 0xfffff0, 0xf9f1f1],
    },
    {
        fogColor: 0x0000ff,
        backgroundColor: 0x000000,
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
export const WORLD_RADIUS = 48;
export const SIDES = 80;
export const TIERS = 40;
export const MAX_WORLD_FACE_HEIGHT = 2.;
export const NEIGHBORHOOD_PROPS = {
    count: 50,
    maxSize: 10,
    maxRadius: 300, // Try to get this as low as possible after happy with maxSize (TODO there is probably a decent heuristic so you don't have to eyeball this)
}
