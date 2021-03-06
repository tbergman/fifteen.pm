import * as THREE from 'three';
import { CONTENT } from '../../Content';
import { assetPath9 } from './utils';


// ASSETS
export const BUILDINGS_URL = assetPath9("objects/structures/buildings.glb");
export const CAR_URL = assetPath9("objects/car/car.glb");
export const LOGO_URL = assetPath9("objects/logo/logo.glb");

// WORLD
export const WORLD_CENTER = new THREE.Vector3();
export const WORLD_RADIUS = 48;
export const WORLD_SURFACE_AREA = 4 * Math.PI * Math.pow(WORLD_RADIUS, 2);
export const MAX_WORLD_FACE_HEIGHT = 1;
export const WORLD_SIDES = 24;
export const WORLD_TIERS = 24;
const WORLD_FACES = WORLD_SIDES * WORLD_TIERS;
export const WORLD_SMALL_TILE = WORLD_SURFACE_AREA / WORLD_FACES * .3;
export const WORLD_MEDIUM_TILE = WORLD_SURFACE_AREA / WORLD_FACES * .5;
export const WORLD_LARGE_TILE = WORLD_SURFACE_AREA / WORLD_FACES * .75;
export const WORLD_ROAD_PATH = (() => {
    const circle = new THREE.CircleGeometry(WORLD_RADIUS, WORLD_RADIUS);
    const points = circle.vertices.reverse(); // reverse it so driver is going in expected dir
    return points.slice(0, points.length - 2); // don't overlap the loop (rm last elt)
})();

// ASTEROID CONSTANTS
// This is divided by the window inner width in the constant below so movile screens have smaller surfacess
export const NUM_ASTEROIDS = 20;
export const ASTEROID_MAX_RADIUS = WORLD_RADIUS / 5;
export const ASTEROID_BELT_RADIUS = WORLD_RADIUS * 5;
export const ASTEROID_DIST_BETWEEN_RINGS = 3;
export const ASTEROID_CLOSEST_RING_RADIUS = WORLD_RADIUS + 5;
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
export const DREAM = "dream"
export const NATURAL = "natural"

export const ASTEROID_BUILDING_CATEGORIES = {
    night: [
    ],
    sunset: [
    ],
    natural: [
        "medium_tall_tower_present_talltower"
    ],
    dream: [
    ]
}

export const WORLD_BUILDING_CATEGORIES = {
    night: [
        "small_tall_tower_future_needle4",
        "small_tall_tower_future_needle6",
    ],
    sunset: [
        "medium_tall_tower_present_talltower",
    ],
    natural: [
        "small_tall_twirly_future_comet_geo",
    ],
    dream: [
        "large_short_low_present_factory",
        "large_tall_tower_present_penobscot",
        "large_tall_low_present_michigancentralstation",
        // "large_short_low_present_boxy",
    ]
}

// TRACK INFO
export const TRACK_THEMES = [
    // index matches track list order
    // DREAM
    {
        name: DREAM,
        UIColors: {
            logo: '#ee82ee',
            overlay: 'rgb(238,130,238, .8)',
            overlayContent: '#000',
            player: '#ee82ee',
            navigation: '#ee82ee',
            info: '#ee82ee',
            onHover: '#fff',
        },
        // fog: new THREE.FogExp2(0x000000, 0.00000025),
        fog: new THREE.FogExp2(0xffffff, 0.00005),
        background: new THREE.Color(0x00000),
        starColors: [0xffffff, 0xfffff0, 0xf9f1f1],
        headlights: [0xff0000, 0x0000ff],
        usePostProcessing: true,
    },
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
        headlights: [0xffff4d, 0xffff4d],//ffffb3,
        usePostProcessing: false, // too intense for initial load
    },

    // SUNSET
    {
        name: SUNSET,
        UIColors: {
            logo: '#fff',
            overlay: 'rgba(255, 255, 255, .8)',
            overlayContent: '#000',
            player: '#fff',
            info: '#fff',
            navigation: '#fff',
            onHover: '#ee82ee',
        },
        fog: new THREE.FogExp2(0xefd1b5, 0.0025),
        background: new THREE.Color(0xfe8981),
        starColors: [0x0000ef, 0x111111, 0x222222],
        headlights: [0xff0000, 0x0000ff],
        usePostProcessing: true,
    },
    // NATURAL
    {
        name: NATURAL,
        UIColors: {
            logo: '#000',
            overlay: 'rgba(255,170,255, .8)',
            overlayContent: '#000',
            navigation: '#000',
            player: '#000',
            info: '#000',
            onHover: '#fff',
        },
        fog: new THREE.FogExp2(0xffffff, 0.00005),
        // background: new THREE.Color(0xffffff),
        starColors: [0x555555, 0x333333, 0x1a1a1a],
        headlights: [0xff0000, 0x0000ff],
        usePostProcessing: true,
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

export const TRACK_ID_LOOKUP = {
    "742019866": 0,
    "742019875": 1,
    "742019860": 2,
    "742019854": 3,
}

export const TRACK_LOOKUP = {
    "life": "742019866",
    "swing": "742019875",
    "natural": "742019860",
    "dream": "742019854",
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