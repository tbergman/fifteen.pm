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
const THEMES = [
    // index matches track list order
    {
        fogColor: 0x0000aa,
        backgroundColor: 0x0000aa,
        starColors: [0xfff, 0xfa0000, 0xaf0000],
    },
    {
        // fogColor: 0xff0000, i.e. turn off fog
        backgroundColor: 0xff0000,
        starColors: [0x00ff00, 0x00fa00, 0x00af00],
    },
    {
        fogColor: 0x0000ff,
        backgroundColor: 0x0000ff,
        starColors: [0xff0000, 0xfa0000, 0xaf0000],
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
export const MAX_FACE_HEIGHT = 0.1;
