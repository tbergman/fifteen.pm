import { assetPath } from "../../Common/Utils/assets";

export const HEADSPACE_1_PATH = assetPath("11/objects/headspace1/main.gltf");
export const HEADSPACE_2_PATH = assetPath("11/objects/headspace2/main.glb");
export const HEADSPACE_3_PATH = assetPath("11/objects/headspace3/main.glb");
export const HEADSPACE_4_PATH = assetPath("11/objects/headspace4/main.gltf");
export const HEADSPACE_8_PATH = assetPath("11/objects/headspace8/main.gltf");
export const HEADSPACE_9_PATH = assetPath("11/objects/headspace9/main.glb");
export const HEADSPACE_10_PATH = assetPath("11/objects/headspace10/main.glb");


export const REMEDY = "Remedy"
export const FEAR = "Fear"
export const RADIO_FREAK = "Radio Freak"
export const FIRST_TRACK = REMEDY
export const EXPLODE = "explode"
export const SPIN = "spin"
export const REFLECT = "reflect"
export const PURPLE_TRON2 = "purpleTron2"
export const DARK_TRON2 = "darkTron2"
export const BW_TRON2 = "bwTron2"
export const NOISE1 = "noise1"
export const FOAM_GRIP_PURPLE = "foamGripPurple"
export const WIREFRAMEY = "wireframey"


// e.g.
export const TRACKS_CONFIG = {}
TRACKS_CONFIG[REMEDY] = {
    steps: [
        { time: 0, headspace: EXPLODE, complexity: "small", dynamics: "flat", headmat: NOISE1, room: BW_TRON2 },
        // TODO rm me
        { time: 2, headspace: SPIN, complexity: "small", dynamics: "flat", headmat: FOAM_GRIP_PURPLE, room: BW_TRON2 },
        // TODO rm me
        { time: 3, headspace: EXPLODE, complexity: "small", dynamics: "flat", headmat: NOISE1, room: PURPLE_TRON2 },
        // TODO rm me
        { time: 4, headspace: REFLECT, complexity: "small", dynamics: "flat", headmat: NOISE1, room: PURPLE_TRON2 },
        // TODO rm me
        { time: 5, headspace: SPIN, complexity: "small", dynamics: "flat", headmat: FOAM_GRIP_PURPLE, room: BW_TRON2 },
        // TODO rm me
        { time: 6, headspace: EXPLODE, complexity: "small", dynamics: "flat", headmat: NOISE1, room: PURPLE_TRON2 },
       


        // TODO rm me
        // { time: 3, headspace: REFLECT, complexity: "small", dynamics: "flat", headmat: WIREFRAMEY, room: DARK_TRON2 },
        // { time: 14, headspace: SPIN, complexity: "small", dynamics: "flat", headmat: NOISE1, room: BW_TRON2 },
        // { time: 21, headspace: EXPLODE, complexity: "small", dynamics: "flat", headmat: NOISE1, room: PURPLE_TRON2 },
        // { time: 35, headspace: SPIN, complexity: "medium", dynamics: "flat", headmat: NOISE1, room: PURPLE_TRON2 },
        // { time: 42, headspace: EXPLODE, complexity: "small", dynamics: "flat", headmat: NOISE1, room: PURPLE_TRON2 },
        // { time: 49, headspace: SPIN, complexity: "small", dynamics: "flat", headmat: NOISE1, room: PURPLE_TRON2 },
        // { time: 63, headspace: REFLECT, complexity: "medium", dynamics: "flat", headmat: NOISE1, room: PURPLE_TRON2 },
        // { time: 70, headspace: SPIN, complexity: "small", dynamics: "flat", headmat: NOISE1, room: PURPLE_TRON2 },
        // { time: 75, headspace: EXPLODE, complexity: "medium", dynamics: "flat", headmat: NOISE1, room: PURPLE_TRON2 },
        // { time: 91, headspace: SPIN, complexity: "large", dynamics: "flat", headmat: NOISE1, room: PURPLE_TRON2 },
        // { time: 176, headspace: EXPLODE, complexity: "large", dynamics: "flat", headmat: NOISE1, room: PURPLE_TRON2 },
    ]
}
TRACKS_CONFIG[FEAR] = {
    steps: [
        { time: 0, headspace: SPIN, complexity: "small", dynamics: "decreasing", headmat: NOISE1, room: DARK_TRON2 },
        { time: 15, headspace: SPIN, complexity: "small", dynamics: "increasing", headmat: NOISE1, room: PURPLE_TRON2 },
        { time: 27, headspace: EXPLODE, complexity: "small", dynamics: "flat", headmat: NOISE1, room: PURPLE_TRON2 },
        { time: 41, headspace: SPIN, complexity: "small", dynamics: "flat", headmat: NOISE1, room: PURPLE_TRON2 },
        { time: 48, headspace: REFLECT, complexity: "small", dynamics: "increasing", headmat: NOISE1, room: PURPLE_TRON2 },
        { time: 61, headspace: SPIN, complexity: "medium", dynamics: "flat", headmat: NOISE1, room: PURPLE_TRON2 },
        { time: 83, headspace: EXPLODE, complexity: "large", dynamics: "decreasing", headmat: NOISE1, room: PURPLE_TRON2 },
        { time: 137, headspace: REFLECT, complexity: "large", dynamics: "flat", headmat: NOISE1, room: PURPLE_TRON2 },
        { time: 155, headspace: SPIN, complexity: "large", dynamics: "decreasing", headmat: NOISE1, room: PURPLE_TRON2 },
    ]
}
TRACKS_CONFIG[RADIO_FREAK] = {
    steps: [
        { time: 0, headspace: REFLECT, complexity: "small", dynamics: "flat", headmat: NOISE1, room: BW_TRON2 },
        { time: 15, headspace: EXPLODE, complexity: "small", dynamics: "flat", headmat: NOISE1, room: PURPLE_TRON2 },
        { time: 22, headspace: SPIN, complexity: "small", dynamics: "flat", headmat: NOISE1, room: PURPLE_TRON2 },
        { time: 27, headspace: REFLECT, complexity: "small", dynamics: "increasing", headmat: NOISE1, room: PURPLE_TRON2 },
        { time: 58, headspace: SPIN, complexity: "small", dynamics: "flat", headmat: NOISE1, room: PURPLE_TRON2 },
        { time: 103, headspace: EXPLODE, complexity: "medium", dynamics: "increasing", headmat: NOISE1, room: PURPLE_TRON2 },
        { time: 166, headspace: SPIN, complexity: "small", dynamics: "flat", headmat: NOISE1, room: PURPLE_TRON2 },
        { time: 220, headspace: EXPLODE, complexity: "medium", dynamics: "increasing", headmat: NOISE1, room: PURPLE_TRON2 },
    ]
}
