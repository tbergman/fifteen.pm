import { assetPath10, assetPathJV } from "./utils";

// frog sound sprite settings
export const FROG_OBJECT_URL = assetPath10("objects/frog/scene.gltf");
export const FROG_SOUNDS_URL = assetPath10("sounds/frog-sprites-2-ld.wav");
export const FROG_SOUNDS_NUM_SAMPLES = 16;
export const FROG_SOUNDS_BARS_PER_SAMPLE = 16;
// position audio
export const FROG_SOUNDS_ROLLOFF_FACTOR = 2;
export const FROG_SOUNDS_ROLLOFF_MIN_DISTANCE = 300;
export const FROG_SOUNDS_ROLLOFF_MAX_DISTANCE = 1500;
// random notes
export const FROG_SOUNDS_NOTES = [-500, -300, 300, 700, -700, 900];

// sax sound sprite settings
export const SAX_OBJECT_URL = assetPath10("objects/baritone_sax/scene.gltf");
export const SAX_SOUNDS_URL = assetPath10("sounds/sax-sprites-1-25-76bpm.wav");
export const SAX_SOUNDS_NUM_SAMPLES = 16;
export const SAX_SOUNDS_BARS_PER_SAMPLE = 16;

// position sax audio
export const SAX_SOUNDS_ROLLOFF_FACTOR = 10;
export const SAX_SOUNDS_ROLLOFF_MIN_DISTANCE = 1;
export const SAX_SOUNDS_ROLLOFF_MAX_DISTANCE = 500;
export const SAX_SOUNDS_DEBOUNCE = 2.5;


export const THEMES = {
  "Frog Shirt": {
    terrain: {
      terrainDiffuseTexture1URL: assetPathJV("textures/terrain/zuck1.jpg"),
      terrainUniformsRepeat: 16
    },
    sky: {
      turbidity: 1003,
      rayleigh: 0.4,
      luminance: 1,
      mieCoefficient: 0.1,
      mieDirectionalG: 90.0,
      sunPosition: [0,10,0]
    }
  },
  "Show U": {
    terrain: {
      terrainDiffuseTexture1URL: assetPathJV("textures/terrain/23mudcrack.png"),
      terrainUniformsRepeat: 16
    },
    sky: {
      turbidity: 173,
      rayleigh: 10,
      luminance: 1,
      mieCoefficient: 0.1,
      mieDirectionalG: 30.0,
      sunPosition: [0,10,0]
    }
  },
  "Cube Jazz": {
    terrain: {
      terrainDiffuseTexture1URL: assetPathJV("textures/terrain/rug1.jpg"),
      terrainUniformsRepeat: 16
    },
    sky: {
      turbidity: 103,
      rayleigh: 0.4,
      luminance: 1,
      mieCoefficient: 0.1,
      mieDirectionalG: 10.0,
      sunPosition: [0,10,0]
    }
  }
};