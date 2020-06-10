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
export const SINGLE = "single"
export const ASYMMETRICAL = "asymmetrical"
export const SYMMETRICAL = "symmetrical"
export const PURPLE_TRON2 = "purpleTron2"
export const BLACK_BG = "blackBG"
export const ORANGE_TRON2 = "orangeTron2"
export const NOISE1 = "noise1"
export const NAIVE_GLASS = "naiveGlass"
export const WIREFRAMEY = "wireframey"
export const SMALL = "small"
export const MEDIUM = "medium"
export const LARGE = "large"
export const HEAD_MATERIALS = [NOISE1, NAIVE_GLASS, WIREFRAMEY]
export const TRACKS_CONFIG = {}
TRACKS_CONFIG[REMEDY] = {
    steps: [
        { time: 0, headspace: ASYMMETRICAL, complexity: SMALL, dynamics: "flat", material: NOISE1, room: BLACK_BG },
        { time: 2, headspace: SINGLE, complexity: SMALL, dynamics: "flat", material: NOISE1, room: PURPLE_TRON2 },
        { time: 3, headspace: SINGLE, complexity: SMALL, dynamics: "flat", material: NAIVE_GLASS, room: PURPLE_TRON2 },
        { time: 4, headspace: ASYMMETRICAL, complexity: SMALL, dynamics: "flat", material: WIREFRAMEY, room: BLACK_BG },
        { time: 6, headspace: ASYMMETRICAL, complexity: SMALL, dynamics: "flat", material: WIREFRAMEY, room: BLACK_BG },
        // { time: 4, headspace: SYMMETRICAL, complexity: SMALL, dynamics: "flat", material: WIREFRAMEY, room: BLACK_BG },
        // { time: 5, headspace: SYMMETRICAL, complexity: SMALL, dynamics: "flat", material: NOISE1, room: ORANGE_TRON2 },
        // { time: 6, headspace: SINGLE, complexity: SMALL, dynamics: "flat", material: NOISE1, room: BLACK_BG },
        // { time: 7, headspace: SYMMETRICAL, complexity: SMALL, dynamics: "flat", material: WIREFRAMEY, room: BLACK_BG },
        // { time: 8, headspace: SYMMETRICAL, complexity: SMALL, dynamics: "flat", material: NOISE1, room: ORANGE_TRON2 },
        // { time: 9, headspace: SYMMETRICAL, complexity: SMALL, dynamics: "flat", material: WIREFRAMEY, room: BLACK_BG },
        // { time: 10, headspace: SYMMETRICAL, complexity: SMALL, dynamics: "flat", material: NOISE1, room: ORANGE_TRON2 },
        // { time: 11, headspace: SINGLE, complexity: SMALL, dynamics: "flat", material: NOISE1, room: PURPLE_TRON2 },

        // // { time: 14, headspace: SPIN, complexity: SMALL, dynamics: "flat", material: NOISE1, room: PURPLE_TRON2 },
        // { time: 21, headspace: SINGLE, complexity: SMALL, dynamics: "flat", material: NOISE1, room: PURPLE_TRON2 },
        // { time: 35, headspace: ASYMMETRICAL, complexity: MEDIUM, dynamics: "flat", material: NOISE1, room: PURPLE_TRON2 },
        // { time: 42, headspace: SINGLE, complexity: SMALL, dynamics: "flat", material: NOISE1, room: PURPLE_TRON2 },
        // { time: 49, headspace: ASYMMETRICAL, complexity: SMALL, dynamics: "flat", material: NOISE1, room: PURPLE_TRON2 },
        // { time: 63, headspace: SYMMETRICAL, complexity: MEDIUM, dynamics: "flat", material: NOISE1, room: PURPLE_TRON2 },
        // { time: 70, headspace: ASYMMETRICAL, complexity: SMALL, dynamics: "flat", material: NOISE1, room: PURPLE_TRON2 },
        // { time: 75, headspace: SINGLE, complexity: MEDIUM, dynamics: "flat", material: NOISE1, room: PURPLE_TRON2 },
        // { time: 91, headspace: ASYMMETRICAL, complexity: LARGE, dynamics: "flat", material: NOISE1, room: PURPLE_TRON2 },
        // { time: 176, headspace: SINGLE, complexity: LARGE, dynamics: "flat", material: NOISE1, room: PURPLE_TRON2 },
    ]
}
TRACKS_CONFIG[FEAR] = {
    steps: [
        { time: 0, headspace: ASYMMETRICAL, complexity: SMALL, dynamics: "decreasing", material: NOISE1, room: BLACK_BG },
        { time: 15, headspace: ASYMMETRICAL, complexity: SMALL, dynamics: "increasing", material: NOISE1, room: PURPLE_TRON2 },
        { time: 27, headspace: SINGLE, complexity: SMALL, dynamics: "flat", material: NOISE1, room: PURPLE_TRON2 },
        { time: 41, headspace: ASYMMETRICAL, complexity: SMALL, dynamics: "flat", material: NOISE1, room: PURPLE_TRON2 },
        { time: 48, headspace: SYMMETRICAL, complexity: SMALL, dynamics: "increasing", material: NOISE1, room: PURPLE_TRON2 },
        { time: 61, headspace: ASYMMETRICAL, complexity: MEDIUM, dynamics: "flat", material: NOISE1, room: PURPLE_TRON2 },
        { time: 83, headspace: SINGLE, complexity: LARGE, dynamics: "decreasing", material: NOISE1, room: PURPLE_TRON2 },
        { time: 137, headspace: SYMMETRICAL, complexity: LARGE, dynamics: "flat", material: NOISE1, room: PURPLE_TRON2 },
        { time: 155, headspace: ASYMMETRICAL, complexity: LARGE, dynamics: "decreasing", material: NOISE1, room: PURPLE_TRON2 },
    ]
}
TRACKS_CONFIG[RADIO_FREAK] = {
    steps: [
        { time: 0, headspace: SYMMETRICAL, complexity: SMALL, dynamics: "flat", material: NOISE1, room: ORANGE_TRON2 },
        { time: 15, headspace: SINGLE, complexity: SMALL, dynamics: "flat", material: NOISE1, room: PURPLE_TRON2 },
        { time: 22, headspace: ASYMMETRICAL, complexity: SMALL, dynamics: "flat", material: NOISE1, room: PURPLE_TRON2 },
        { time: 27, headspace: SYMMETRICAL, complexity: SMALL, dynamics: "increasing", material: NOISE1, room: PURPLE_TRON2 },
        { time: 58, headspace: ASYMMETRICAL, complexity: SMALL, dynamics: "flat", material: NOISE1, room: PURPLE_TRON2 },
        { time: 103, headspace: SINGLE, complexity: MEDIUM, dynamics: "increasing", material: NOISE1, room: PURPLE_TRON2 },
        { time: 166, headspace: ASYMMETRICAL, complexity: SMALL, dynamics: "flat", material: NOISE1, room: PURPLE_TRON2 },
        { time: 220, headspace: SINGLE, complexity: MEDIUM, dynamics: "increasing", material: NOISE1, room: PURPLE_TRON2 },
    ]
}
//
