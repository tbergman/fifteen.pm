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
            {
                time: 0,
                cameraPos: "floorHigh", 
                alien1ActionName: "insideout1",
                heidiActionName: "insideout1",
                guapxboxxActionName: "insideout1"
            },
            {
                time: 1,
                cameraPos: "floorHigh",
                alien1ActionName: "insideout2",
                heidiActionName: "insideout2",
                guapxboxxActionName: "insideout2",
            },
            // {
            //     time: 8,
            //     cameraPos: "wide",
            //     alien1ActionName: "insideout3",
            //     heidiActionName: "insideout3",
            //     guapxboxxActionName: "insideout3",
            // },
            // {
            //     time: 12,
            //     cameraPos: "wide",
            //     alien1ActionName: "insideout4",
            //     heidiActionName: "insideout4",
            //     guapxboxxActionName: "insideout2",
            // },
            // {
            //     time: 16,
            //     cameraPos: "wide", 
            //     alien1ActionName: "insideout1",
            //     heidiActionName: "insideout1",
            //     guapxboxxActionName: "insideout1"
            // },
            // {
            //     time: 20,
            //     cameraPos: "wide",
            //     alien1ActionName: "insideout2",
            //     heidiActionName: "insideout2",
            //     guapxboxxActionName: "insideout2",
            // },
            // {
            //     time: 24,
            //     cameraPos: "wide",
            //     alien1ActionName: "insideout3",
            //     heidiActionName: "insideout3",
            //     guapxboxxActionName: "insideout3",
            // },
            // {
            //     time: 28,
            //     cameraPos: "wide",
            //     alien1ActionName: "insideout4",
            //     heidiActionName: "insideout4",
            //     guapxboxxActionName: "insideout2",
            // },
        ]
    },
    "High On Mate": {
        steps: [
            {
                time: 0,
                cameraPos: "split",
                alien1ActionName: "mate1",
                heidiActionName: "mate1",
                guapxboxxActionName: "mate1",
            },
            {
                time: 3,
                cameraPos: "split",
                alien1ActionName: "mate2",
                heidiActionName: "mate2",
                guapxboxxActionName: "mate2",
            },
            {
                time: 4,
                cameraPos: "split",
                alien1ActionName: "mate1",
                heidiActionName: "mate3",
                guapxboxxActionName: "mate3",
            },
            {
                time: 6,
                cameraPos: "split",
                alien1ActionName: "mate1",
                heidiActionName: "mate1",
                guapxboxxActionName: "mate1",
            },
            {
                time: 8,
                cameraPos: "split",
                alien1ActionName: "mate2",
                heidiActionName: "mate2",
                guapxboxxActionName: "mate2",
            },
            {
                time: 10,
                cameraPos: "split",
                alien1ActionName: "mate1",
                heidiActionName: "mate3",
                guapxboxxActionName: "mate3",
            },
            {
                time: 12,
                cameraPos: "split",
                alien1ActionName: "mate1",
                heidiActionName: "mate1",
                guapxboxxActionName: "mate1",
            },
            {
                time: 14,
                cameraPos: "split",
                alien1ActionName: "mate2",
                heidiActionName: "mate2",
                guapxboxxActionName: "mate2",
            },
            {
                time: 16,
                cameraPos: "split",
                alien1ActionName: "mate1",
                heidiActionName: "mate3",
                guapxboxxActionName: "mate3",
            },
        ]

    },
    "Looking For Roses": {
        steps: [
            {
                time: 0,
                cameraPos: "wide",
                alien1ActionName: "roses1",
                heidiActionName: "roses1",
                guapxboxxActionName: "roses1",
            },
            {
                time: 3,
                cameraPos: "side",
                alien1ActionName: "roses2",
                heidiActionName: "roses1",
                guapxboxxActionName: "roses2",
            },
            {
                time: 5,
                cameraPos: "side",
                alien1ActionName: "roses3",
                heidiActionName: "roses1",
                guapxboxxActionName: "roses3",
            },
            {
                time: 7,
                cameraPos: "side",
                alien1ActionName: "roses4",
                heidiActionName: "insideout1",
                guapxboxxActionName: "roses2",
            },
        ]
    }
}
