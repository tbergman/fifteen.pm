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
export const ORBIT = "orbit" // orbit-style camera
export const STILL = "still" // still-set camera

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
      sources: multiSourceVideo('/assets/8/videos/jt'),
      // sources: multiSourceVideo('/assets/8/videos/juicy-tender-loop-640-480'), // easier to use while devving
      //sources: multiSourceVideo('/assets/8/videos/juicy-tender-greenscreen-640-360'),
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
      location: FALLING,
      camera: {
        type: ORBIT,
        offset: { x: 3, z: 3, y: 1.1 },
        speed: { x: .1, z: .1 },
        lookAt: { x: 0, y: 1., z: 0 },
      }
    },
    3: {
      location: FALLING,
      camera: {
        type: STILL,
        position: { x: 0, y: 0, z: 12 },
        rotation: { x: 0, y: 0, z: 0 },
        lookAt: { x: 0, y: 1., z: 0 },
      }
    },
    // 21: FALLING, // INSTRUMENTAL,
    6.: {
      location: FALLING,
      camera: {
        type: ORBIT,
        offset: { x: 3, z: 3, y: 1.1 },
        speed: { x: .1, z: .1 },
        lookAt: { x: 0, y: 1., z: 0 },
      }
    }, // VERSE2,
    9.: {
      location: FALLING,
      camera: {
        type: ORBIT,
        offset: { x: 3, z: 3, y: 35.1 },
        speed: { x: .1, z: .1 },
        lookAt: { x: 0, y: 1., z: 0 },
      }
    }, // CHORUS,
    12.: {
      location: FALLING,
      camera: {
        type: STILL,
        position: { x: 0, y: 1.1, z: 8.4 },
        rotation: { x: Math.PI * .2, y: 0, z: 0 },
        lookAt: { x: 0, y: 1., z: 0 },
      }
    }, // VERSE2,
  },
  sections: {
    
    0.: {
      location: OFFICE,
      camera: {
        type: ORBIT,
        offset: { x: 3, z: 3, y: 1.1 },
        speed: { x: .1, z: .1 },
        lookAt: { x: 0, y: 1., z: 0 },
      }
    },
    18: {
      location: FALLING,
      camera: {
        type: STILL,
        position: { x: 0, y: 0, z: 12 },
        rotation: { x: 0, y: 0, z: 0 },
        lookAt: { x: 0, y: 1., z: 0 },
      }
    },
    // 21: FALLING, // INSTRUMENTAL,
    29.: {
      location: OFFICE,
      camera: {
        type: ORBIT,
        offset: { x: 3, z: 3, y: 1.1 },
        speed: { x: .1, z: .1 },
        lookAt: { x: 0, y: 1., z: 0 },
      }
    }, // VERSE2,
    51.: {
      location: FOREST,
      camera: {
        type: ORBIT,
        offset: { x: 3, z: 3, y: 35.1 },
        speed: { x: .1, z: .1 },
        lookAt: { x: 0, y: 1., z: 0 },
      }
    }, // CHORUS,
    66.: {
      location: OFFICE,
      camera: {
        type: STILL,
        position: { x: 0, y: 1.1, z: 8.4 },
        rotation: { x: Math.PI * .2, y: 0, z: 0 },
        lookAt: { x: 0, y: 1., z: 0 },
      }
    }, // VERSE2,
    80.: {
      location: FALLING,
      camera: {
        type: STILL,
        position: { x: 0, y: 0, z: 12 },
        rotation: { x: 0, y: 0, z: 0 },
        lookAt: { x: 0, y: 1., z: 0 },
      }
    }, // INSTRUMENTAL,
    // TODO Is there a bug here???
    88.: {
      location: FOREST,
      camera: {
        type: ORBIT, //UPDATED
        offset: { x: 10, z: 10, y: 8.1 },
        speed: { x: -.2, z: -.2 },
        lookAt: { x: 0, y: 1., z: 0 },
      }
    }, // CHORUS,
    103.: {
      location: FOREST,
      camera: {
        type: STILL,
        camera: {
          type: STILL, // UPDATED
          position: { x: 0.505702463243422, y: 1.9908183938754178, z: 10.072518803231938 },
          rotation: { x: -0.19513349847872039, y: 0.04921356457916186, z: 0.009722755679543641 },
          lookAt: { x: 0, y: 1., z: 0 },
        }
      }, // BRIDGE,
      118.: {
        location: FOREST,
        camera: {
          type: STILL,
          position: { x: -6.911336867395235, y: 35.171791211103574, z: 21.186446198100736 },
          rotation: { x: -0.8936867517856268, y: -0.09255757666672404, z: -0.11446990020179652 },
          lookAt: { x: 0, y: 1., z: 0 },
        }
      }, // CHORUS,
      134: {
        location: FALLING,
        camera: {
          type: STILL,
          position: { x: 0, y: 0, z: 12 },
          rotation: { x: 0, y: 0, z: 0 },
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
    REBECCA: [-2, -.2, -3],
    DENNIS: [1, .1, -3.2],
  },
  trackSectionSpriteMaterialLookup: {
    FOREST: TRANSLUSCENT,
    FALLING: ROCK,
    OFFICE: FOAM
  },
  animationSpeed: {
    FOREST: .03,
    FALLING: .05,
    OFFICE: .02,
  },
  videoTransforms: {
    OFFICE: {
      position: { x: 0, y: 8, z: 1.3 },
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