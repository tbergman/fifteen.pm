import { assetPath } from "../../Common/Utils/assets";

export const HEADSPACE_1_PATH = assetPath("11/objects/headspace1/main.gltf");
export const HEADSPACE_2_PATH = assetPath("11/objects/headspace2/main.glb");
export const HEADSPACE_3_PATH = assetPath("11/objects/headspace3/main.glb");
export const HEADSPACE_4_PATH = assetPath("11/objects/headspace4/main.gltf");
export const HEADSPACE_8_PATH = assetPath("11/objects/headspace8/main.gltf");
export const HEADSPACE_9_PATH = assetPath("11/objects/headspace9/main.glb");
export const HEADSPACE_10_PATH = assetPath("11/objects/headspace10/main.glb");

// tracks
export const REMEDY = "Remedy"
export const FEAR = "Fear"
export const RADIO_FREAK = "Radio Freak"
export const FIRST_TRACK = REMEDY
// headspace components
export const SINGLE = "single"
export const ASYMMETRICAL = "asymmetrical"
export const SYMMETRICAL = "symmetrical"
// background materials
export const PURPLE_TRON2 = "purpleTron2"
export const BLACK_BG = "blackBG"
export const ORANGE_TRON2 = "orangeTron2"
// headspace materials
export const NOISE1 = "noise1"
export const NAIVE_GLASS1 = "naiveGlass1"
export const WIREFRAMEY1 = "wireframey1"
export const HEAD_MATERIALS1 = [NOISE1, NAIVE_GLASS1, WIREFRAMEY1]
export const NOISE2 = "noise2"
export const NAIVE_GLASS2 = "naiveGlass2"
export const WIREFRAMEY2 = "wireframey2"
export const HEAD_MATERIALS2 = [NOISE2, NAIVE_GLASS2, WIREFRAMEY2]

// headspace 'sizes' -- open to interpretation
export const SMALL = "small"
export const MEDIUM = "medium"
export const LARGE = "large"

export const TRACKS_CONFIG = {}
TRACKS_CONFIG[REMEDY] = {
    steps: [
        { time: 0, headspace: SYMMETRICAL, complexity: SMALL, dynamics: "flat", material1: NOISE1, room: BLACK_BG },
        { time: 6, headspace: SYMMETRICAL, complexity: SMALL, dynamics: "flat", material1: NAIVE_GLASS1, room: PURPLE_TRON2 },
        { time: 8, headspace: SYMMETRICAL, complexity: MEDIUM, dynamics: "flat", material1: NOISE1, room: BLACK_BG },
        { time: 14, headspace: SYMMETRICAL, complexity: MEDIUM, dynamics: "flat", material1: NAIVE_GLASS1, room: PURPLE_TRON2 },
        { time: 21, headspace: SINGLE, complexity: SMALL, dynamics: "flat", material1: NOISE1, room: ORANGE_TRON2 },
        { time: 35, headspace: ASYMMETRICAL, complexity: MEDIUM, dynamics: "flat", material1: NOISE1, material2: NOISE2, room: BLACK_BG },
        { time: 42, headspace: SINGLE, complexity: LARGE, dynamics: "flat", material1: WIREFRAMEY1, room: BLACK_BG },
        { time: 49, headspace: ASYMMETRICAL, complexity: SMALL, dynamics: "flat", material1: NOISE1, material2: NAIVE_GLASS2, room: BLACK_BG },
        { time: 63, headspace: SYMMETRICAL, complexity: MEDIUM, dynamics: "flat", material1: WIREFRAMEY1, room: BLACK_BG },
        { time: 70, headspace: ASYMMETRICAL, complexity: SMALL, dynamics: "flat", material1: NOISE1, material2: NOISE2, room: BLACK_BG },
        { time: 75, headspace: SINGLE, complexity: LARGE, dynamics: "flat", material1: NAIVE_GLASS1, room: PURPLE_TRON2 },
        { time: 91, headspace: ASYMMETRICAL, complexity: LARGE, dynamics: "flat", material1: NOISE1, material2: NOISE2, room: BLACK_BG },
        { time: 176, headspace: SINGLE, complexity: LARGE, dynamics: "flat", material1: NOISE1, room: PURPLE_TRON2 },
    ]
}
TRACKS_CONFIG[FEAR] = {
    steps: [
        { time: 0, headspace: ASYMMETRICAL, complexity: SMALL, dynamics: "decreasing", material1: NOISE1, material2: NOISE2, room: BLACK_BG },
        { time: 14, headspace: ASYMMETRICAL, complexity: SMALL, dynamics: "increasing", material1: NAIVE_GLASS1, material2: NOISE2, room: PURPLE_TRON2 },
        { time: 27, headspace: SINGLE, complexity: SMALL, dynamics: "flat", material1: NOISE1, room: PURPLE_TRON2 },
        { time: 41, headspace: ASYMMETRICAL, complexity: SMALL, dynamics: "flat", material1: NOISE1, material2: WIREFRAMEY2, room: PURPLE_TRON2 },
        { time: 48, headspace: SYMMETRICAL, complexity: SMALL, dynamics: "increasing", material1: NOISE1, room: PURPLE_TRON2 },
        { time: 61, headspace: ASYMMETRICAL, complexity: MEDIUM, dynamics: "flat", material1: WIREFRAMEY1, material2: NOISE2, room: BLACK_BG },
        { time: 83, headspace: SINGLE, complexity: LARGE, dynamics: "decreasing", material1: NOISE1, room: PURPLE_TRON2 },
        { time: 137, headspace: SYMMETRICAL, complexity: LARGE, dynamics: "flat", material1: NOISE1, room: PURPLE_TRON2 },
        { time: 155, headspace: ASYMMETRICAL, complexity: LARGE, dynamics: "decreasing", material1: NOISE1, material2: NOISE2, room: PURPLE_TRON2 },
    ]
}
TRACKS_CONFIG[RADIO_FREAK] = {
    steps: [
        { time: 0, headspace: SYMMETRICAL, complexity: LARGE, dynamics: "flat", material1: NOISE1, room: ORANGE_TRON2 },
        { time: 15, headspace: SINGLE, complexity: SMALL, dynamics: "flat", material1: NOISE1, room: BLACK_BG },
        { time: 22, headspace: ASYMMETRICAL, complexity: SMALL, dynamics: "flat", material1: NAIVE_GLASS1, material2: NOISE2, room: PURPLE_TRON2 },
        { time: 27, headspace: SYMMETRICAL, complexity: SMALL, dynamics: "increasing", material1: NAIVE_GLASS1, room: PURPLE_TRON2 },
        { time: 58, headspace: ASYMMETRICAL, complexity: SMALL, dynamics: "flat", material1: NOISE1, material2: NOISE2, room: PURPLE_TRON2 },
        { time: 103, headspace: SINGLE, complexity: MEDIUM, dynamics: "increasing", material1: NOISE1, room: PURPLE_TRON2 },
        { time: 166, headspace: ASYMMETRICAL, complexity: SMALL, dynamics: "flat", material1: NOISE1, material2: NOISE2, room: PURPLE_TRON2 },
        { time: 220, headspace: SINGLE, complexity: MEDIUM, dynamics: "increasing", material1: NOISE1, room: PURPLE_TRON2 },
    ]
}
//
