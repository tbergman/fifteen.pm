import * as THREE from 'three';
import { assetPath } from "../../Common/Utils/assets"

export const HEIDI = assetPath("12/objects/heidi/main.glb")
export const THE_HAIR = assetPath("12/objects/the-hair/main.glb")
export const GUAPXBOX_X = assetPath("12/objects/guapxbox-x/main.glb")
export const ALIEN1 = assetPath("12/objects/alien1/main.glb")
export const CAT = assetPath("12/objects/cat/main.glb")
export const FIRST_TRACK = "Inside Out"
export const ANIMATION_TRACK_CROSSWALK = {
    "Inside Out": "insideout",
    "High On Mate": "mate",
    "Looking For Roses": "roses",
}
export const FIRST_CAMERA_POSITION = "floorHigh"
export const CAMERA_POSITIONS = {
    "wide": { position: [-2.2504463506184993, 2.868375043915486, 10.95079874726515], lookAt: [0, 0, 0] },
    "floorMid": { position: [3.9038521003481264, 1.3686621524209956, -0.07793609444684252], lookAt: [0, 0, 0] },
    "floorHigh": { position: [4.1437982940586195, 2.0, 0.013147959502974958], lookAt: [0, 3, 0] },
    "side": { position: [3.457559, -0.434766259, 5.96748884], lookAt: [0, 0, 0] },
    "top": { position: [0.000003892542295841119, -3.9306783940759447, 5.47467480983172e-7], lookAt: [0, 0, 0] },
    "split": { position: [8.059123795293685, -0.10436603058191879, -0.06187434400353934], lookAt: [0, 0, 0] },
}

export const TRACKS_CONFIG = {
    "Inside Out": {
        steps: [
            // todo (jeremy) actionName is just demonstrating, these aren't the actions we'd want here
            {time: 0, cameraPos: FIRST_CAMERA_POSITION, actionName: "insideout"},
            {time: 3, cameraPos: FIRST_CAMERA_POSITION, actionName: "mate"}, 
            {time: 5, cameraPos: FIRST_CAMERA_POSITION, actionName: "rose3"}, 
            // {time: 3, cameraPos: "side"},
            // {time: 4, cameraPos: "floorHigh"}
        ]
    },
    "High On Mate": {
        steps: [
            {time: 0, cameraPos: FIRST_CAMERA_POSITION, actionName: "mate1"},
            {time: 3, cameraPos: "floorMid", actionName: "mate2"},
        ]
    },
    "Looking For Roses": {
        steps: [
            {time: 0, cameraPos: "wide", actionName: "roses1"},
            {time: 3, cameraPos: "side", actionName: "roses2"},
        ]
    }
}
