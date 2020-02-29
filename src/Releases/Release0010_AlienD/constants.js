import { assetPath10 } from './utils';

// ASSETS
export const FROG_URL = assetPath10("objects/frog.glb");
export const BOSS_FROG_URL = assetPath10("objects/SAPO.glb");
export const SOUNDS_URL = assetPath10("sounds/frog-sprites-2.wav");
export const SOUND_URLS_BY_TRACK_NAME = {
  'Frog Shirt': assetPath10("sounds/frog-sprites-2.wav"),
  'Show U': assetPath10("sounds/showu-sprites-1-25-55bpm.wav"),
  'Cube Jazz': assetPath10("sounds/sax-sprites-1-25-76bpm.wav")
};
export const SOUND_SPRITE_NUMBER=25;
export const SOUND_OFFSET_UNIT=16;
export const ROLLOFF_FACTOR = 10;
export const ROLLOFF_MIN_DISTANCE = 1;
export const ROLLOFF_MAX_DISTANCE = 500;

export const TUNES = [-500, -300, 300, 700, -1200, 900];

export const VOLUMES = [
  0.11,
  0.12,
  0.13,
  0.14,
  0.15,
  0.16,
  0.17,
  0.18,
  0.19,
  0.2,
  0.21,
  0.22,
  0.27,
  0.33,
  0.39,
  0.5,
  0.55,
  0.66,
  0.75,
  0.8,
  0.9,
  1.0
];