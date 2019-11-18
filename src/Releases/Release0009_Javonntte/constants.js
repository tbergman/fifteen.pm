import * as THREE from 'three';
import { CONTENT } from '../../Content';
import { isMobile } from '../../Utils/BrowserDetection'
import { assetPath9 } from './utils';


// ASSETS
export const BUILDINGS_URL = assetPath9("objects/structures/buildings.glb");
export const CAR_URL = assetPath9("objects/car/car.glb");
export const LOGO_URL = assetPath9("objects/logo/logo.glb");

console.log("IS MOBILE", isMobile);

// WORLD
export const WORLD_CENTER = new THREE.Vector3();
export const WORLD_RADIUS = 48;
export const MAX_WORLD_FACE_HEIGHT = 1;
export const WORLD_SIDES = 24;
export const WORLD_TIERS = 24;
export const WORLD_BUILDING_CORRIDOR_WIDTH = isMobile ? 20 : 20;
export const WORLD_ROAD_WIDTH = isMobile ? WORLD_RADIUS / 7 : WORLD_RADIUS / 7;
export const MAX_ROAD_ELEVATION = WORLD_RADIUS + 8;
export const WORLD_ROAD_PATH = (() => {
    const circle = new THREE.CircleGeometry(WORLD_RADIUS, WORLD_RADIUS);
    const points = circle.vertices.reverse(); // reverse it so driver is going in expected dir
    return points.slice(0, points.length - 2); // don't overlap the loop (rm last elt)
})();

// LOGO
// TODO use world radius?
export const LOGO_POS = new THREE.Vector3(
    -500,
    -300,
    0,
)

// ASTEROID CONSTANTS
// This is divided by the window inner width in the constant below so movile screens have smaller surfacess
export const NUM_ASTEROIDS = 33;
export const ASTEROID_MAX_RADIUS = WORLD_RADIUS / 3;
export const ASTEROID_BELT_RADIUS = WORLD_RADIUS * 8;

// BUILDING
// model geometry categories
export const LARGE = "large";
export const MEDIUM = "medium";
export const SMALL = "small";
export const TALL = "tall";
export const SHORT = "short";
export const PRESENT = "present"
export const FUTURE = "future"
export const BUILDING_WIDTH_BUCKETS = [
    SMALL,
    MEDIUM,
    LARGE,
]
export const BUILDING_HEIGHT_BUCKETS = [
    SHORT,
    TALL,
]
// Theme names
export const NIGHT = "night"
export const SUNSET = "sunset"
export const HELL = "hell"
export const DAY = "day"

export const ASTEROID_BUILDING_CATEGORIES = {
    night: ["medium_large_tall_low_michigancentralstation", "large_tall_logo_present_logo"],
    sunset: ["small_tall_diamond_future_diamondhull_geo002"],
    day: ["medium_tall_tower_present_talltower"],
    hell: ["medium_tall_tower_present_talltower"],
}

export const WORLD_BUILDING_CATEGORIES = {
    night: [
        "medium_short_diamond_future_diamondhull_geo001",
        "medium_tall_diamond_future_diamondhull_geo",
        "medium_tall_diamond_future_disco1",
        "medium_tall_diamond_future_shinyhull1",
        "medium_tall_diamond_future_unlithull_geo",
        "medium_tall_diamond_future_unlithull_geo001",
        "medium_tall_ribbony_future_celvinyl_geo003",
        "medium_tall_ribbony_future_celvinyl_geo002",
        "medium_tall_tower_future_needle7",
        "small_short_twirly_future_disco1_small_cactus",
        "small_short_twirly_future_disco1_small_worm",
        "small_tall_diamond_future_diamondhull_geo002",
        "small_tall_diamond_future_toongeo1",
        "small_tall_tower_future_needle3",
        "small_tall_tower_future_needle4",
        "small_tall_tower_future_needle6",
        "small_tall_tower_future_lightwire1",
        "small_tall_twirly_future_comet_geo",
    ],
    sunset: [
        "medium_tall_tower_present_talltower",
    ],
    day: [
        "small_tall_twirly_future_comet_geo"
    ],
    hell: [
        "large_short_low_present_factory"
    ]
}

// TRACK INFO
export const TRACK_THEMES = [
    // index matches track list order
    // NIGHT
    {
        name: NIGHT,
        UIColors: CONTENT["/9"].colors,
        fog: new THREE.FogExp2(0xefd1b5, 0.0025),
        background: new THREE.Color(0x000000),
        starColors: [0x555555, 0x333333, 0x1a1a1a],
        surfaces: "ground29",
        sky: "night",
        world: "future",
    },

    // SUNSET
    {
        name: SUNSET,
        UIColors: {
            logo: '#f00',
            overlay: '#f00',
            overlayContent: '#f0f',
            player: '#aaa',
            onHover: '#0ff0',
        },
        fog: new THREE.FogExp2(0xefd1b5, 0.0025),
        background: new THREE.Color(0xfe8981),
        starColors: [0x0000ef, 0x111111, 0x222222],
    },
    // HELL
    {
        name: HELL,
        UIColors: {
            logo: '#0f0',
            overlay: '#0f0',
            overlayContent: '#fff',
            player: '#0a0',
            onHover: '#fff9',
        },
        fog: new THREE.FogExp2(0xff0000, 0.0025),
        background: new THREE.Color(0xff0000),
        starColors: [0xffffff, 0xfffff0, 0xf9f1f1],
    },
    // DAY
    {
        name: DAY,
        UIColors: {
            logo: '#0f0',
            overlay: '#0f0',
            overlayContent: '#fff',
            player: '#faf',
            onHover: '#fff9',
        },
        fog: new THREE.FogExp2(0xffffff, 0.00005),
        background: new THREE.Color(0xffffff),
        starColors: [0x555555, 0x333333, 0x1a1a1a],
    },
]

export const THEME_NAMES = TRACK_THEMES.map(theme => theme.name);

export const TRACK_METADATA = (() => {
    const lookup = {};
    CONTENT["/9"].tracks.forEach((track, index) => lookup[track.id] = {
        bpm: track.bpm,
        name: track.title,
        theme: TRACK_THEMES[index],
        index: index,
    });
    return lookup;
})();

export const TRACK_LOOKUP = {
    "life": "679771262",
    "swing": "693475855",
    "natural": "679771259",
    "dream": "679771253",
}

// CAR
// model geometry names
export const DASH_BUTTONS = [
    "button_life",
    "button_swing",
    "button_natural",
    "button_dream",
]
export const STEERING_WHEEL_PARTS = [
    "gloves",
    "sleeves",
    "wheel",
    "wheel_internal"
]