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
    "butt": { position: [-1.440317563037257, 1.2956672647059897, -0.26250668818042233], lookAt: [0, 2, 0] },
    "floorMid": { position: [3.9038521003481264, 1.9686621524209956, -0.07793609444684252], lookAt: [0, 0, 0] },
    "floorMidUpsideDown": { position: [-3.9038521003481264, -1.7686621524209956, 0.07793609444684252], lookAt: [0, 0, 0] },
    "floorHigh": { position: [4.1437982940586195, 2.4, 0.013147959502974958], lookAt: [0, 3, 0] },
    "side": { position: [3.457559, -0.434766259, 5.96748884], lookAt: [0, 0, 0] },
    "bottom": { position: [0.000003892542295841119, -3.9306783940759447, 5.47467480983172e-7], lookAt: [0, 0, 0] },
    "top": { position: [0.000003892542295841119, 3.9306783940759447, 5.47467480983172e-7], lookAt: [0, 0, 0] },
    "split": { position: [7.059123795293685, -0.20436603058191879, -0.06187434400353934], lookAt: [0, 0, 0] },
}

export const TRACKS_CONFIG = {
    "Inside Out": {
        steps: [
            {
                time: 0,
                cameraPos: "floorHigh",
                alien1ActionName: "insideout1",
                heidiActionName: "insideout1",
                heidiTimeScale: 1.1,
                guapxboxxActionName: "insideout1",
            },
            {
                time: 7.7,
                cameraPos: "floorHigh",
                bgColor: new THREE.Color("white"),
                autoRotate: true,
            },
            {
                time: 7.9,
                cameraPos: "floorHigh",
                bgColor: new THREE.Color("yellow"),
                autoRotate: false,
            },
            {
                time: 8,
                cameraPos: "floorHigh",
                bgColor: new THREE.Color("black"),
                autoRotate: true,
            },
            {
                time: 45,
                cameraPos: "butt",
                autoRotate: false,
            },
            {
                time: 48,
                cameraPos: "floorMidUpsideDown",
                autoRotate: true,
            },
            {
                time: 68,
                cameraPos: "split",
                autoRotate: false,
            },
            {
                time: 84,
                cameraPos: "top",
                alien1ActionName: "insideout2",
                heidiActionName: "insideout2",
                guapxboxxActionName: "insideout2",
                
            },
            {
                time: 93,
                cameraPos: "floorMidUpsideDown",
                autoRotate: true,
            },
            {
                time: 104,
                cameraPos: "wide",
                alien1ActionName: "insideout3",
                heidiActionName: "insideout3",
                guapxboxxActionName: "insideout3",
            },
            {
                time: 106,
                cameraPos: "floorMid",
                autoRotate: false,
            },
            {
                time: 118,
                cameraPos: "butt",
                alien1ActionName: "insideout4",
                heidiActionName: "insideout4",
                guapxboxxActionName: "insideout2",
            },
            {
                time: 120,
                cameraPos: "floorMidUpsideDown",
                autoRotate: true,
            },
            {
                time: 136,
                cameraPos: "bottom",
                alien1ActionName: "insideout1",
                heidiActionName: "insideout1",
                guapxboxxActionName: "insideout1",
                autoRotate: false,
                bgColor: new THREE.Color("white")
            },
            {
                time: 138,
                cameraPos: "floorMidUpsideDown",
                autoRotate: true,
                bgColor: new THREE.Color("black")
            },
            {
                time: 156,
                cameraPos: "top",
                alien1ActionName: "insideout2",
                heidiActionName: "insideout2",
                guapxboxxActionName: "insideout2",
                autoRotate: false,
            },
            {
                time: 158,
                cameraPos: "split",
                autoRotate: true,
            },
            {
                time: 172,
                cameraPos: "floorMid",
                alien1ActionName: "insideout3",
                heidiActionName: "insideout3",
                guapxboxxActionName: "insideout3",
                autoRotate: false,
            },
            {
                time: 185,
                cameraPos: "wide",
                alien1ActionName: "insideout4",
                heidiActionName: "insideout4",
                guapxboxxActionName: "insideout2",
                autoRotate: true,
            },
            {
                time: 187.5,
                cameraPos: "floorMidUpsideDown",
                autoRotate: false,
            },
            {
                time: 202,
                cameraPos: "floorMidUpsideDown",
                alien1ActionName: "insideout3",
                heidiActionName: "insideout3",
                guapxboxxActionName: "insideout3",
                autoRotate: true,
            },
            {
                time: 224,
                cameraPos: "side",
                alien1ActionName: "insideout4",
                heidiActionName: "insideout4",
                guapxboxxActionName: "insideout2",
                autoRotate: false,
            },
            {
                time: 230,
                cameraPos: "bottom",
                alien1ActionName: "insideout1",
                heidiActionName: "insideout1",
                guapxboxxActionName: "insideout1",
            },
            {
                time: 232,
                cameraPos: "floorMid",
            },
            {
                time: 245,
                cameraPos: "top",
                alien1ActionName: "insideout2",
                heidiActionName: "insideout2",
                guapxboxxActionName: "insideout2",
                autoRotate: true,
            },
            {
                time: 247,
                cameraPos: "floorHigh",
                autoRotate: false,
            },
            {
                time: 262,
                cameraPos: "split",
                alien1ActionName: "insideout3",
                heidiActionName: "insideout3",
                guapxboxxActionName: "insideout3",
            },
            {
                time: 278,
                cameraPos: "floorHigh",
                alien1ActionName: "insideout4",
                heidiActionName: "insideout4",
                guapxboxxActionName: "insideout2",
            },
            {
                time: 292,
                cameraPos: "wide",
                autoRotate: true,
                bgColor: new THREE.Color("white")
            },
        ]
    },
    "High On Mate": {
        steps: [
            {
                time: 0,
                cameraPos: "floorHigh",
                alien1ActionName: "mate1",
                heidiActionName: "mate1",
                guapxboxxActionName: "mate1",
                guapxboxxTimeScale: 1.33,
                autoRotate: false,
                bgColor: new THREE.Color("black"),
            },
            {
                time: 40.5,
                cameraPos: "butt",
                autoRotate: true,
            },
            {
                time: 54,
                cameraPos: "top",
            },
            {
                time: 55,
                cameraPos: "floorMid",
                autoRotate: false,
            },
            {
                time: 58,
                cameraPos: "floorHigh",
                alien1ActionName: "mate2",
                heidiActionName: "mate2",
                guapxboxxActionName: "mate2",
            },
            {
                time: 59,
                cameraPos: "floorMidUpsideDown",
                alien1ActionName: "mate2",
                heidiActionName: "mate2",
                guapxboxxActionName: "mate1",
            },
            {
                time: 62.3,
                cameraPos: "split",
                alien1ActionName: "mate1",
                heidiActionName: "mate3",
                autoRotate: true,
            },
            {
                time: 66.8,
                cameraPos: "floorMid",
                heidiActionName: "mate1",
                autoRotate: false,
            },
            {
                time: 70,
                cameraPos: "floorHigh",
                alien1ActionName: "mate2",
                heidiActionName: "mate2",
            },
            {
                time: 73,
                cameraPos: "floorMidUpsideDown",
                alien1ActionName: "mate1",
                heidiActionName: "mate3",
                guapxboxxActionName: "mate3",
                autoRotate: true,
            },
            {
                time: 77.7,
                cameraPos: "floorHigh",
                heidiActionName: "mate1",
                guapxboxxActionName: "mate1",
                autoRotate: false,
            },
            {
                time: 81.1,
                cameraPos: "floorMid",
                alien1ActionName: "mate2",
                heidiActionName: "mate2",
                autoRotate: false,
            },
            {
                time: 84.9,
                cameraPos: "floorHigh",
                alien1ActionName: "mate1",
                heidiActionName: "mate3",
                autoRotate: false,
            },
            {
                time: 88,
                cameraPos: "split",
                alien1ActionName: "mate1",
                heidiActionName: "mate1",
                autoRotate: false,
            },
            {
                time: 92,
                cameraPos: "floorMid",
                alien1ActionName: "mate2",
                heidiActionName: "mate2",
                autoRotate: false,
            },
            {
                time: 96.5,
                cameraPos: "top",
                alien1ActionName: "mate1",
                heidiActionName: "mate3",
                autoRotate: false,
            },
            {
                time: 99.7,
                cameraPos: "floorMidUpsideDown",
                alien1ActionName: "mate1",
                heidiActionName: "mate1",
                autoRotate: false,
            },
            {
                time: 103.3,
                cameraPos: "floorHigh",
                alien1ActionName: "mate2",
                heidiActionName: "mate2",
                autoRotate: false,
            },
            {
                time: 107,
                cameraPos: "floorMid",
                alien1ActionName: "mate1",
                heidiActionName: "mate3",
                autoRotate: false,
            },
            {
                time: 110.75,
                cameraPos: "floorHigh",
                alien1ActionName: "mate1",
                heidiActionName: "mate1",
                autoRotate: false,
            },
            {
                time: 113,
                cameraPos: "wide",
                alien1ActionName: "mate2",
                heidiActionName: "mate2",
                autoRotate: true,
            },
            {
                time: 114.6,
                cameraPos: "floorMid",
                alien1ActionName: "mate2",
                heidiActionName: "mate2",
                autoRotate: true,
            },
            {
                time: 117.9,
                cameraPos: "split",
                alien1ActionName: "mate1",
                heidiActionName: "mate3",
                autoRotate: false,
            },
            {
                time: 122,
                cameraPos: "floorHigh",
                alien1ActionName: "mate1",
                heidiActionName: "mate1",
                autoRotate: false,
            },
            {
                time: 125.9,
                cameraPos: "bottom",
                alien1ActionName: "mate2",
                heidiActionName: "mate2",
                autoRotate: false,
            },
            {
                time: 129,
                cameraPos: "floorHigh",
                alien1ActionName: "mate1",
                heidiActionName: "mate3",
                autoRotate: false,
            },
            {
                time: 132.8,
                cameraPos: "floorMidUpsideDown",
                alien1ActionName: "mate1",
                heidiActionName: "mate1",
                autoRotate: true,
            },
            {
                time: 136.6,
                cameraPos: "floorHigh",
                alien1ActionName: "mate2",
                heidiActionName: "mate2",
                autoRotate: false,
            },
            {
                time: 140.1,
                cameraPos: "floorMid",
                alien1ActionName: "mate1",
                heidiActionName: "mate3",
                autoRotate: false,
            },
            {
                time: 144.2,
                cameraPos: "top",
                alien1ActionName: "mate1",
                heidiActionName: "mate1",
                autoRotate: true,
            },
            {
                time: 148.9,
                cameraPos: "split",
                alien1ActionName: "mate2",
                heidiActionName: "mate2",
                autoRotate: false,
            },
            {
                time: 155,
                cameraPos: "floorHigh",
                alien1ActionName: "mate1",
                heidiActionName: "mate3",
                autoRotate: false,
            },
            {
                time: 158.9,
                cameraPos: "split",
                alien1ActionName: "mate1",
                heidiActionName: "mate3",
                autoRotate: true,
            },
            {
                time: 162.8,
                cameraPos: "floorMid",
                alien1ActionName: "mate2",
                heidiActionName: "mate2",
                autoRotate: false,
            },
            {
                time: 170,
                cameraPos: "floorHigh",
                alien1ActionName: "mate1",
                heidiActionName: "mate3",
                autoRotate: false,
            },
            {
                time: 177.7,
                cameraPos: "bottom",
                alien1ActionName: "mate1",
                heidiActionName: "mate3",
                autoRotate: false,
            },
            {
                time: 184.4,
                cameraPos: "floorHigh",
                alien1ActionName: "mate1",
                heidiActionName: "mate3",
                autoRotate: false,
            },
            {
                time: 192.8,
                cameraPos: "floorMidUpsideDown",
                alien1ActionName: "mate1",
                heidiActionName: "mate2",
                autoRotate: true,
            },
            {
                time: 199.4,
                cameraPos: "top",
                alien1ActionName: "mate2",
                heidiActionName: "mate1",
                autoRotate: false,
            },
            {
                time: 207,
                cameraPos: "split",
                alien1ActionName: "mate1",
                heidiActionName: "mate2",
            },
            {
                time: 214.1,
                cameraPos: "split",
                alien1ActionName: "mate1",
                heidiActionName: "mate2",
            },
            {
                time: 221.4,
                cameraPos: "split",
                alien1ActionName: "mate2",
                heidiActionName: "mate3",
                guapxboxxActionName: "mate1",
                autoRotate: true,
            },
            {
                time: 229,
                cameraPos: "butt",
                alien1ActionName: "mate1",
                heidiActionName: "mate1",
                autoRotate: true,
            },
            {
                time: 236,
                cameraPos: "floorHigh",
                alien1ActionName: "mate1",
                heidiActionName: "mate1",
                autoRotate: false,
            },
            {
                time: 243.8,
                cameraPos: "floorMid",
                alien1ActionName: "mate1",
                heidiActionName: "mate1",
            },
            {
                time: 250.5,
                cameraPos: "floorHigh",
                alien1ActionName: "mate2",
                heidiActionName: "mate2",
            },
            {
                time: 258,
                cameraPos: "floorMid",
                alien1ActionName: "mate2",
                heidiActionName: "mate2",
            },
            {
                time: 265.2,
                cameraPos: "butt",
                alien1ActionName: "mate1",
                heidiActionName: "mate3",
            },
            {
                time: 273,
                cameraPos: "floorHigh",
                alien1ActionName: "mate1",
                heidiActionName: "mate1",
            },
            {
                time: 280.4,
                cameraPos: "split",
                alien1ActionName: "mate2",
                heidiActionName: "mate2",
                guapxboxxActionName: "mate2",
            },
            {
                time: 287.8,
                cameraPos: "wide",
                alien1ActionName: "mate1",
                heidiActionName: "mate3",
                guapxboxxActionName: "mate1",
                autoRotate: true,
            },
            {
                time: 295.1,
                cameraPos: "floorHigh",
                alien1ActionName: "mate2",
                heidiActionName: "mate2",
            },
            {
                time: 302.2,
                cameraPos: "floorMidUpsideDown",
                alien1ActionName: "mate1",
                heidiActionName: "mate1",
            },
            {
                time: 311.3,
                cameraPos: "split",
                alien1ActionName: "mate2",
                heidiActionName: "mate3",
            },
            {
                time: 317,
                cameraPos: "wide",
                alien1ActionName: "mate2",
                heidiActionName: "mate3",
                guapxboxxActionName: "mate3",
                autoRotate: true,
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
                autoRotate: true,
            },
            {
                time: 30,
                cameraPos: "side",
                alien1ActionName: "roses2",
                guapxboxxActionName: "roses2",
            },
            {
                time: 60,
                cameraPos: "floorMid",
                alien1ActionName: "roses3",
                guapxboxxActionName: "roses3",
            },
            {
                time: 90,
                cameraPos: "side",
                alien1ActionName: "roses4",
                guapxboxxActionName: "roses2",
            },
            {
                time: 120,
                cameraPos: "wide",
                alien1ActionName: "roses4",
                guapxboxxActionName: "roses2",
            },
            {
                time: 150,
                cameraPos: "floorMidUpsideDown",
                alien1ActionName: "roses2",
                guapxboxxActionName: "roses2",
            },
            {
                time: 180,
                cameraPos: "floorMid",
                alien1ActionName: "roses3",
                guapxboxxActionName: "roses3",
            },
            {
                time: 210,
                cameraPos: "side",
                alien1ActionName: "roses4",
                guapxboxxActionName: "roses2",
            },
            {
                time: 240,
                cameraPos: "wide",
                alien1ActionName: "roses4",
                guapxboxxActionName: "roses2",
            },
            {
                time: 270,
                cameraPos: "floorMid",
                alien1ActionName: "roses3",
                guapxboxxActionName: "roses3",
            },
            {
                time: 300,
                cameraPos: "top",
                alien1ActionName: "roses4",
                guapxboxxActionName: "roses2",
            },
        ]
    }
}
