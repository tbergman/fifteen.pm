  import { assetPath10, assetPathJV } from "./utils";

  // frog sound sprite settings
  export const FROG_OBJECT_URL = assetPath10("objects/frog/scene.gltf");
  export const FROG_SOUNDS_URL = assetPath10("sounds/frog-sprites-2-ld.wav");
  export const FROG_SOUNDS_NUM_SAMPLES = 16;
  export const FROG_SOUNDS_BARS_PER_SAMPLE = 16;
  export const FROG_CUBE_MIN_X = -1200
  export const FROG_CUBE_MAX_X = -300
  export const FROG_CUBE_SPEED = 1;

  // position audio
  export const FROG_SOUNDS_ROLLOFF_FACTOR = 1.5;
  export const FROG_SOUNDS_ROLLOFF_MIN_DISTANCE = 500;
  export const FROG_SOUNDS_ROLLOFF_MAX_DISTANCE = 2000;
  // random notes
  export const FROG_SOUNDS_NOTES = [-500, -300, 300, 700, -700, 900];

  // sax sound sprite settings
  export const SAX_OBJECT_URL = assetPath10("objects/baritone_sax/scene.gltf");
  export const SAX_SOUNDS_URL = assetPath10("sounds/sax-sprites-1-25-76bpm.wav");
  export const SAX_SOUNDS_NUM_SAMPLES = 16;
  export const SAX_SOUNDS_BARS_PER_SAMPLE = 16;

  // position sax audio
  export const SAX_SOUNDS_ROLLOFF_FACTOR = 1.1;
  export const SAX_SOUNDS_ROLLOFF_MIN_DISTANCE = 1;
  export const SAX_SOUNDS_ROLLOFF_MAX_DISTANCE = 1500;
  export const SAX_SOUNDS_DEBOUNCE = 2.5;


  export const THEMES = {
    "Frog Shirt": {
      terrain: {
        terrainDiffuseTexture1URL: assetPathJV("textures/terrain/sand-big-saturated.jpg"),
        terrainUniformsRepeat: 16,
        terrainDisplacementScale:  600,
      },
      camera: {
        position: [ -1600, 800,  0]
      },
      frogCube: {
        amount: 5,
        scale: 1.44,
        xOffset: 75,
        yOffset: 75,
        zOffset: 75,
        xFactor: 100,
        yFactor: 100,
        zFactor: 100,
        position: [-600, 530, 0],
      }
    },
    "Show U": {
      terrain: {
        terrainDiffuseTexture1URL: assetPathJV("textures/terrain/23mudcrack.png"),
        terrainUniformsRepeat: 8,
        terrainDisplacementScale:  1000,
      },
      camera: {
        position: [ -1600, 530,  0]
      },
      frogCube: {
        amount: 10,
        // scale: 0.66,
        // xOffset: 33,
        // yOffset: 33,
        // zOffset: 33,
        // xFactor: 33,
        // yFactor: 33,
        // zFactor: 33,
        position: [-600, 530, 0],
      }
    },
    "Cube Jazz": {
      terrain: {
        terrainDiffuseTexture1URL: assetPathJV("textures/terrain/rug1.jpg"),
        terrainUniformsRepeat: 16,
        terrainDisplacementScale:  150
      },
      camera: {
        position: [ -1600, 800,  0]
      },
      frogCube: {
        amount: 10,
        scale: 1.44,
        xOffset: 75,
        yOffset: 75,
        zOffset: 75,
        xFactor: 100,
        yFactor: 100,
        zFactor: 100,
        position: [-600, 530, 0],
      }
    }
  };