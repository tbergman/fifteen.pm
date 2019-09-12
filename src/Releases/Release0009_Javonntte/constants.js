import { CONTENT } from '../../Content';
import { assetPath9 } from './utils';

export const BUILDINGS_URL = assetPath9("objects/structures/buildings.glb");
// export const LARGE = "medium";
// export const MEDIUM = "medium";
// export const SMALL = "medium";
export const LARGE = "large";
export const MEDIUM = "medium";
export const SMALL = "small";
export const BPM_LOOKUP = () => {
    const lookup = {};
    CONTENT["/9"].tracks.forEach(track => lookup[track.id] = track.bpm);
    return lookup;
}
export const WORLD_RADIUS = 48;
export const SIDES = 80;
export const TIERS = 40;
export const MAX_FACE_HEIGHT = 0.1;
