import * as THREE from "three";

import { multiSourceVideo } from '../../Utils/Video/paths.js';

export const OFFICE = "OFFICE";
export const FOREST = "FOREST";
export const FALLING = "FALLING";
export const ROCK = "rock"
export const FOAM = "foam"
export const WATER = "water"
export const TRANSLUSCENT = "transluscent"
export const REBECCA = "REBECCA";
export const ALEXA = "ALEXA";
export const DENNIS = "DENNIS";

export const CONSTANTS = {
  officeWaterSurfaces: [
    "ceiling005_2",
    "furniture005_0",
    "furniture005_1",
    "walls005_4",
    "walls005_7"
  ],
  auxMedia: [{
    meta: {
      type: 'video',
      mimetype: 'video/mp4',
      name: 'greem-vid1',
      sources: multiSourceVideo('/assets/8/videos/juicy-tender-loop-640-480'), // easier to use while devving
      // sources: multiSourceVideo('/assets/8/videos/juicy-tender-greenscreen-640-360'),
      geometry: new THREE.PlaneBufferGeometry(1, 1),
      position: [0, 0, 0],
      playbackRate: 1,
      loop: true,
      invert: true,
      volume: .0,
      muted: false,
      angle: 0.0
    },
    mesh: undefined,  
  }],
  bpm: 130.0,
  songLength: 145.,
  sections: {
    0.: OFFICE,
    // 5.: FALLING,
    // 10: FOREST,
    // 18: FALLING,
    // 21: FALLING, // INSTRUMENTAL,
    // 29.: OFFICE, // VERSE2,
    // 51.: FOREST, // CHORUS,
    // 66.: OFFICE, // VERSE2,
    // 80.: FALLING, // INSTRUMENTAL,
    // 88.: FOREST, // CHORUS,
    // 103.: FOREST, // BRIDGE,
    // 118.: FOREST, // CHORUS,
    // 134: FALLING, // INSTRUMENTAL
  },
  animationClipNames: {
    OFFICE: ["office_1", "office_2"],
    FALLING: ["falling"],
    FOREST: ["forest_1", "forest_2"]
  },
  spriteNames: [ALEXA, REBECCA, DENNIS],
  spriteStartPos: {
    ALEXA: [4, 0, -5],
    REBECCA: [2, 0, -8],
    DENNIS: [5, .1, -8],
  },
  trackSectionSpriteMaterialLookup: {
    FOREST: TRANSLUSCENT,
    FALLING: ROCK,
    OFFICE: FOAM
  },
  animationSpeed: {
    FOREST: .03,
    FALLING: .1,
    OFFICE: .02,
  }
}

function initTrackSections() {
  // TODO will this always be ordered?
  const sectionStartTimeKeys = Object.keys(CONSTANTS.sections);
  const sections = [];
  for (let i = 0; i < sectionStartTimeKeys.length; i++) {
    const start = parseFloat(sectionStartTimeKeys[i]);
    const end = i < sectionStartTimeKeys.length - 1 ? parseFloat(sectionStartTimeKeys[i + 1])
      : CONSTANTS.songLength;
    sections.push({
      start: start,
      end: end,
      location: CONSTANTS.sections[sectionStartTimeKeys[i]],
      length: end - start
    })
  }
  return sections;
}

export const TRACK_SECTIONS = initTrackSections();

/*
 15-21: verse1
Verse 1
A walk in the woods getting lost
in pleasure of solitudes
and loneliness

21-29 : instrumental

29-44: verse2
Verse 2
Outdoor clues
Reading
nature’s signs
To the extraordinary destinations
searching for the
Juicy Tender

51-66: chorus
chorus
Juicy Tender
Juicy Tender
Der Der Der Der Der Der Der Der
Crispy Juicy
Crispy Juicy
Der Der Der Der Der Der Der Der

66-80: verse2
Verse 2
Outdoor clues
Reading nature’s signs
To the extraordinary destinations
searching for the
Juicy and tender

80-88: instrumental

88-103: chorus
Chorus
Juicy Tender
Juicy Tender
Der Der Der Der Der Der Der Der
Crispy Juicy
Crispy Juicy
Der Der Der Der Der Der Der Der

103-118: bridge
Bridge

118-134: chorus
Chorus
Juicy Tender
Juicy Tender
Der Der Der Der Der Der Der Der
Crispy Juicy
Crispy Juicy
Der Der Der Der Der Der Der Der
*/