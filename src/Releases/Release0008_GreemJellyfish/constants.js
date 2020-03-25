import * as THREE from "three";

import { multiSourceVideo } from '../../Common/Video/paths.js';

export const OFFICE = "OFFICE";
export const FOREST = "FOREST";
export const FALLING = "FALLING";
export const PINK_ROCK = "pinkRock"
export const FOAM = "foam"
export const WATER = "water"
export const TRANSLUSCENT = "transluscent"
export const REBECCA = "REBECCA";
export const ALEXA = "ALEXA";
export const DENNIS = "DENNIS";
export const ORBIT = "orbit" // orbit-style camera
export const STILL = "still" // still-set camera

export const CONSTANTS = {
  auxMedia: [{
    meta: {
      type: 'video',
      mimetype: 'video/mp4',
      name: 'greem-vid1',
      // sources: multiSourceVideo('/assets/8/videos/jt-reduced-no-audio'),
      // sources: multiSourceVideo('/assets/8/videos/jt-brian-version'),
      sources: multiSourceVideo('/assets/8/videos/jt-final'),
      // sources: multiSourceVideo('/assets/8/videos/juicy-tender-loop-640-480'), // easier to use while devving
      geometry: new THREE.PlaneBufferGeometry(1, 1),
      position: [0, 0, 0],
      playbackRate: 1,
      loop: true,
      invert: true,
      volume: .4,
      muted: false,
      angle: 0.0
    },
    mesh: undefined,
  }],
  bpm: 130.0,
  songLength: 145.,
  // make sure everything's loaded on init
  numElementsPerLocation: {
    FOREST: 3,
    OFFICE: 1,
    FALLING: 1
  },
  sectionsDev: {
    0.: {
      location: OFFICE,
      camera: {
        position: { x: 10000, y: 12.1, z: 500 },
        lookAt: { x: 0, y: 1., z: 0 },
      }
    },
    3: {
      location: OFFICE,
      camera: {
        position: { x: 0, y: 0, z: 12 },
        lookAt: { x: 0, y: 1., z: 0 },
      }
    },
    // 21: FALLING, // INSTRUMENTAL,
    6.: {
      location: FOREST,
      camera: {
        position: { x: 3, y: -4.1, z: 3 },
        lookAt: { x: 0, y: 1., z: 0 },
      }
    }, // VERSE2,
    9.: {
      location: FALLING,
      camera: {
        position: { x: 3, y: 35.1, z: 3 },
        lookAt: { x: 0, y: 1., z: 0 },
      }
    }, // CHORUS,
    12.: {
      location: FOREST,
      camera: {
        position: { x: 0, y: 1.1, z: 8.4 },
        lookAt: { x: 0, y: 1., z: 0 },
      }
    }, // VERSE2,
  },
  sections: {
    0.: {
      location: OFFICE,
      camera: {
        position: { x: 10, y: 3.1, z: 5},
        lookAt: { x: 0, y: 1., z: 0 },
      }
    },
    22.: {
      location: FALLING,
      camera: {
        position: { x: 0, y: 0, z: 16 },
        lookAt: { x: 0, y: 1., z: 0 },
      }
    },
    // 21: FALLING, // INSTRUMENTAL,
    29.: {
      location: OFFICE,
      camera: {
        position: { x: 3, y: 1.1, z: 3 },
        lookAt: { x: 0, y: 1., z: 0 },
      }
    }, // VERSE2,
    51.: {
      location: FOREST,
      camera: {
        position: { x: 3, y: 5.1, z: 8},
        lookAt: { x: 0, y: 1., z: 0 },
      }
    }, // CHORUS,
    66.: {
      location: OFFICE,
      camera: {
        position: { x: 0, y: 1.1, z: 8.4 },
        lookAt: { x: 0, y: 1., z: 0 },
      }
    }, // VERSE2,
    80.: {
      location: FALLING,
      camera: {
        position: { x: 3, y: -5, z: 12 },
        lookAt: { x: 0, y: 1., z: 0 },
      }
    }, // INSTRUMENTAL,
    // TODO Is there a bug here???
    88.: {
      location: FOREST,
      camera: {
        position: { x: 10, y: 8.1, z: 10},
        lookAt: { x: 0, y: 1., z: 0 },
      }
    }, 
    105.: {
      location: FOREST,
      camera: {
        position: { x: 0, y: 35.1, z: 0 },
        lookAt: { x: 0, y: 1., z: 0 },
      }
    },
    103.: {
      location: FOREST,
      camera: {
        type: STILL,
        camera: {
          position: { x: 0.505702463243422, y: 1.9908183938754178, z: 10.072518803231938 },
          lookAt: { x: 0, y: 1., z: 0 },
        }
      }, // BRIDGE,
      118.: {
        location: FOREST,
        camera: {
          position: { x: 5, y:3, z: 2},
          lookAt: { x: 0, y: 1., z: 0 },
        }
      }, // CHORUS,
      134: {
        location: FALLING,
        camera: {
          position: { x: 0, y: 0, z: 12 },
          lookAt: { x: 0, y: 1., z: 0 },
        }
      }, // INSTRUMENTAL
    },
  },
  animationClipNames: {
    OFFICE: ["office_1", "office_2"],
    FALLING: ["falling"],
    FOREST: ["forest_1", "forest_2"]
  },
  animationFadeInRatio: {
    FOREST: .1,
    FALLING: .1,
    OFFICE: .25
  },
  spriteNames: [ALEXA, REBECCA, DENNIS],
  spriteStartPos: {
    ALEXA: [0, -.1, 0],
    REBECCA: [-2, -.2, -3.7],
    DENNIS: [1, .1, -3.2],
  },
  trackSectionSpriteMaterialLookup: {
    FOREST: TRANSLUSCENT,
    FALLING: PINK_ROCK,
    OFFICE: FOAM
  },
  animationSpeed: {
    FOREST: .03,
    FALLING: .05,
    OFFICE: .02,
  },
  videoTransforms: {
    OFFICE: {
      position: { x: 1.3, y: 8.6, z: 1.5 },
      rotation: { x: Math.PI * .5, y: 0, z: 0 },
      scale: { x: .3, y: .3, z: .3 }
    },
    FOREST: {
      position: { x: -4, y: -5, z: 0 },
      rotation: { x: 0, y: 0, z: Math.PI * -.25 },
      scale: { x: .8, y: .8, z: .8 }
    },
    FALLING: {
      position: { x: 6, y: 1, z: 1 },
      rotation: { x: 0, y: 0, z: Math.PI * 0.5 },
      scale: { x: .3, y: .3, z: .3 }
    }
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
      location: CONSTANTS.sections[sectionStartTimeKeys[i]].location,
      length: end - start,
      camera: CONSTANTS.sections[sectionStartTimeKeys[i]].camera
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