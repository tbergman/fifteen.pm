import {
  Hover,
  MouseMove,
  Click,
  TwoFingerScroll,
  ArrowKeys,
  NoPhone,
  SlowLoad
} from "./Common/UI/Controls/Icons";

import * as THREE from 'three';
import { multiSourceVideo } from './Common/Video/paths.js';

export const CONTENT = {
  "/": {
    home: true, // TODO rm
    // TODO punting on a cleaner solution to handling circular navigation arrows. This just needs to be defined in first and last navigation steps (so, home, and latest release.)
    lastIdx: 9,
    message:
      "fifteen.pm invites musicians to expand their visions through the collaborative development of experimental websites. Curated by artists and technologists in New York City, the collective creates experiences of meaning and specificity online, in opposition to the internet of platforms, templates, and streams. Responding to music with multisensory worlds, each release imagines a new space for sound.",
    colors: {
      logo: 'white',
      overlayContent: 'white',
      overlay: 'rgba(0, 50, 200, 0.8)',
      navigation: 'white',
      onHover: 'rgba(0, 0, 0, 0.5)',
      info: 'white',
    }
  },
  "/1": {
    artist: "YAHCEPH",
    message: 'Yahceph\'s production debut, "wun 4 jas", is composed of voice memos and buoyant pads floating somewhere between him and Jasmine, the namesake of this ode.',
    purchaseLink: "https://fifteenpm.bandcamp.com/track/wun-4-jas",
    tracks: [
      {
        name: "Wun 4 Jas",
        id: "466084773",
        type: "soundcloud"
      }
    ],
    colors: {
      logo: '#fff',
      overlay: 'rgba(255,105,180, 1)',
      overlayContent: '#fff',
      player: 'rgba(255,105,180, 1)',
      navigation: 'rgba(255,105,180, 1)',
      onHover: '#fff',
      info: 'rgba(255,105,180, 1)',
    },
    instructions: [
      {
        icon: MouseMove,
        text: "move mouse to make water ripple"
      }
    ]
  },
  "/2": {
    artist: "YEAR UNKNOWN",
    message: "Jen Fong (Year Unknown) serves up frenetic, glitch-fueled footwork on this otherworldly drum disturbance.",
    purchaseLink: "https://fifteenpm.bandcamp.com/track/timer",
    tracks: [
      {
        name: "Timer",
        id: "475418370",
        type: "soundcloud"
      }
    ],
    colors: {
      logo: 'white',
      overlayContent: 'white',
      overlay: 'rgba(127, 0, 255, 0.5)',
      player: 'white',
      navigation: 'white',
      onHover: 'rgba(240, 0, 255, 0.75)',
      info: 'white',
      instructions: [
        {
          icon: MouseMove,
          text: "click and drag mouse to look around"
        },
        {
          icon: TwoFingerScroll,
          text: "scroll to zoom"
        }
      ]
    }
  },
  "/3": {
    artist: "OTHERE",
    message:
      "Abbi Press makes buoyant, soul-inflected tunes by day. As Othere, she explores the darker, corporeal corners of her sound.",
    purchaseLink: "https://fifteenpm.bandcamp.com/track/lets-beach",
    tracks: [
      {
        name: "Let's Beach",
        id: "482138307",
        type: "soundcloud"
      }
    ],
    colors: {
      logo: 'red',
      player: 'red',
      overlay: 'red',
      overlayContent: 'white',
      navigation: 'red',
      onHover: 'gray',
      info: 'red',
    },
    instructions: [
      {
        icon: Hover,
        text: "hover over inner orb to activate filter"
      },
      {
        icon: MouseMove,
        text: "click and drag mouse to look around"
      },
      {
        icon: TwoFingerScroll,
        text: "scroll to zoom and fly through filter"
      }
    ]
  },
  "/4": {
    artist: "JON CANNON",
    message: "Jon Cannon's haunting house ballads are a product of his habitat: the long drag of Myrtle-Broadway where fluorescent-lit stores stock life's essentials.",
    purchaseLink: "https://fifteenpm.bandcamp.com/album/ep-1",
    tracks: [
      {
        name: "Nothing (Blood)",
        id: "507660189",
        type: "soundcloud"
      },
      {
        name: "Miracle Center",
        id: "513518607",
        type: "soundcloud"
      },
      {
        name: "Finesse",
        id: "513518595",
        type: "soundcloud"
      }
    ],
    colors: {
      logo: '#fff',
      overlayContent: '#fff',
      overlay: 'rgba(0, 0, 0, 0.5)',
      player: '#fff',
      navigation: '#fff',
      onHover: 'rgba(250, 10, 250)',
      info: '#fff',
    },
    instructions: [
      {
        icon: MouseMove,
        text: "move mouse to look around"
      },
      {
        icon: Click,
        text: "click to advance flight path"
      },
      {
        icon: ArrowKeys,
        text: "use arrow keys to fly around"
      },
      {
        icon: NoPhone,
        text: "doesn't work on phones",
        alwaysShow: true
      }
    ]

  },
  "/5": {
    artist: "PLEBEIAN",
    message: "Plebeian’s toolbox rattles with chains, ball-bearings and loose screws on these slammin’ single-takes of industrial techno.",
    purchaseLink: "https://fifteenpm.bandcamp.com/album/heaven",
    tracks: [
      {
        name: "Heaven",
        id: "514219014",
        type: "soundcloud"
      },
      {
        name: "Bullseye",
        id: "514219020",
        type: "soundcloud"
      }
    ],
    colors: {

      logo: '#fff',
      overlayContent: '#fff',
      overlay: 'rgba(40, 47, 175, 1)',
      player: '#fff',
      navigation: 'rgba(40, 47, 175, 1)',
      onHover: 'rgba(40, 47, 175, 1)',
      info: '#fff',
    },
    instructions: [
      {
        icon: MouseMove,
        text: "click and drag mouse to look around"
      },
      {
        icon: TwoFingerScroll,
        text: "scroll to zoom"
      }
    ]
  },
  "/6": {
    artist: "VVEISS",
    message: "Dagger at the ready, vveiss plumbs virtual depths, carving out a subsonic ceremony of refracting rhythms.",
    purchaseLink: "https://fifteenpm.bandcamp.com/track/escape-velocity",
    tracks: [
      {
        name: "ESCAPE VELOCITY",
        id: "529074519",
        type: "soundcloud"
      }
    ],
    colors: {
      logo: '#fff',
      overlay: 'rgba(127, 0, 255, 0.4)',
      overlayContent: '#fff',
      player: 'rgba(127, 0, 255, 0.4)',
      navigation: 'rgba(250, 0, 255, 0.4)',
      onHover: 'rgba(127, 0, 255, 0.4)',
      info: 'rgba(127, 0, 255, 0.4)',
    },
    instructions: [
      {
        icon: MouseMove,
        text: "move mouse to look around"
      }
    ]
  },
  "/7": {
    artist: "JON FAY",
    message: "In this 22-minute meditation, Jon Fay captures the infinite pulse of the rave as it empties into the dawn.",
    purchaseLink: "https://fifteenpm.bandcamp.com/track/golden-groove",
    tracks: [
      {
        name: "GOLDEN GROOVE",
        id: "565459281",
        type: "soundcloud"
      }
    ],
    colors: {
      logo: '#fff',
      overlayContent: '#fff',
      overlay: 'rgba(255, 102, 0, 0.4)',
      player: 'rgba(255, 102, 0, 0.4)',
      navigation: 'rgba(255, 102, 0, 0.4)',
      onHover: 'rgba(255, 102, 0, 0.4)',
      info: 'rgba(255, 102, 0, 0.4)',
    },
    instructions: [
      {
        icon: SlowLoad,
        text: "takes a few seconds to load"
      },
      {
        icon: ArrowKeys,
        text: "use arrow keys to walk forever"
      },
      {
        icon: MouseMove,
        text: "move mouse to look around"
      },
      {
        icon: NoPhone,
        text: "doesn't work on phones",
        alwaysShow: true
      }
    ]
  },
  "/greem-and-fifteenpm-opening": {
    artist: "",
    tracks: [
      {
        title: "",
        type: "soundcloud",
        id: "610976673",
        secretToken: "s-7EwJv"
      }
    ],
    theme: {
      message: "DUR DUR DUR DUR DUR DUR DUR DUR",
      purchaseLink: "https://fifteenpm.bandcamp.com/track/golden-groove",
      iconColor: '#fff',
      fillColor: 'rgba(255, 0, 0, 0.5)',
      textColor: '#fff',
      navColor: '#fff',
      controls: []
    }
  },
  "/8": {
    artist: "GREEM JELLYFISH",
    message: "Juicy Tender is an exploration of exodus and urban life. Though we leave the city in search of extraordinary experiences, we sometimes return to loneliness. Ultimately, refuge is not a place but a set of material conditions: Art, Food, Music, Mountain, Ocean, Family, Friend.",
    purchaseLink: "https://fifteenpm.bandcamp.com/album/juicy-tender",
    tracks: [
      {
        mediaType: 'video',
        meta: {
          type: 'video', // TODO do we need this here as well?
          mimetype: 'video/mp4',
          name: 'greem-vid1',
          sources: multiSourceVideo('/assets/8/videos/jt-final'),
          geometry: new THREE.PlaneBufferGeometry(1, 1),
          position: [0, 0, 0],
          playbackRate: 1,
          loop: true,
          invert: true,
          volume: .4,
          muted: false,
          angle: 0.0,
        },
        mesh: undefined,
      },
    ],
    colors: {
      logo: '#fff',
      overlay: 'rgba(255, 0, 0, 0.5)',
      overlayContent: '#fff',
      player: '#fff',
      navigation: '#fff',
      onHover: 'rgba(255, 0, 0, 0.5)',
      info: '#fff',
    },
    instructions: [{
      icon: MouseMove,
      text: "click and drag mouse to look around"
    },
    {
      icon: TwoFingerScroll,
      text: "scroll to zoom"
    }]
  },
  "/g": {
    artist: "",
    tracks: [
      {
        title: "",
        type: "soundcloud",
        id: "610976673",
        secretToken: "s-7EwJv"
      }
    ],
    theme: {
      message: "DUR DUR DUR DUR DUR DUR DUR DUR",
      purchaseLink: "https://fifteenpm.bandcamp.com/track/golden-groove",
      iconColor: '#fff',
      fillColor: 'rgba(255, 0, 0, 0.5)',
      textColor: '#fff',
      navColor: '#fff',
      controls: []
    }
  },
  "/9": {
    artist: "JAVONNTTE",
    message: "Detroit Asteroid Belt 2120: All sectors go wild for the Earthy tones of house master Javonntte after his 'City Life' series surfaces off some de-bricked drives in the archives.",
    purchaseLink: "https://fifteenpm.bandcamp.com/album/city-life",
    tracks: [
      {
        name: "City Life",
        type: "soundcloud",
        id: "742019866",
        secretToken: "s-7AotY",
        bpm: "120",
      },
      {
        name: "S.H.M.",
        type: "soundcloud",
        id: "742019875",
        secretToken: "s-dKlsb",
        bpm: "120",
      },
      {
        name: "Natural",
        type: "soundcloud",
        id: "742019860",
        secretToken: "s-gLrd3",
        bpm: "120",
      },
      {
        name: "This Dream",
        type: "soundcloud",
        id: "742019854",
        secretToken: "s-h4Las",
        bpm: "95",
      },


    ],
    colors: {
      logo: '#0f0',
      navigation: '#0f0',
      overlay: 'rgba(0, 255, 0, .8)',
      overlayContent: '#000',
      player: '#0f0',
      onHover: '#fff',
      info: '#0f0',
    },
    instructions: [
      {
        icon: ArrowKeys,
        text: "use arrow keys to drive the hoverboard"
      },
    ],
  },
  "/10": {
    artist: "Alien D",
    message: "Dan Creahan of Sweat Equity takes us on a hypnotic, chugging ride through the digital murk",
    purchaseLink: "https://fifteenpm.bandcamp.com/album/jazzin-the-cube",
    tracks: [
      {
        name: "Cube Jazz",
        type: "soundcloud",
        id: "708031996",
        secretToken: "s-f0NWB",
        bpm: 152
      },
      {
        name: "Frog Shirt",
        type: "soundcloud",
        id: "708031990",
        secretToken: "s-NKawM",
        bpm: 112
      },
      {
        name: "Show U",
        type: "soundcloud",
        id: "708031987",
        secretToken: "s-BnEVI",
        bpm: 110
      },
    ],
    colors: {
      logo: "white",
      overlayContent: "white",
      overlay: "rgba(0, 0, 0, 0.5)",
      navigation: "white",
      player: "white",
      onHover: "red",
      info: "white"
    },
    instructions: [
      {
        icon: MouseMove,
        text: "click and drag mouse to rotate around the cube"
      },
      {
        icon: Hover,
        text: 'mouse over frogs to make noise'
      },
      {
        icon: ArrowKeys,
        text: 'use arrows to move around'
      },
      {
        icon: TwoFingerScroll,
        text: "scroll to zoom"
      }
    ]
  },
  "/11": {
    artist: "JWORDS",
    message: "A 3D scan of JWords headspace from the tail-end of pre-Covid times. Watch it go to dust, and come into being again.",
    purchaseLink: "https://fifteenpm.bandcamp.com/album/dancepackvol-2",
    lastIdx: 10,
    instructions: [
      {
        icon: TwoFingerScroll,
        text: "scroll the headspace"
      },
    ],
    colors: {
      logo: '#0f0',
      navigation: '#0f0',
      overlay: 'rgba(0, 255, 0, .8)',
      overlayContent: '#000',
      player: '#0f0',
      onHover: '#fff',
      info: '#0f0',
    },
    tracks: [
      {
        name: "Remedy",
        type: "soundcloud",
        id: "832516708",
        secretToken: "s-90RRPxAlMoP",
        bpm: 136,
      },
      {
        name: "Fear",
        type: "soundcloud",
        id: "832516702",
        secretToken: "s-WYBrSlRSqz8",
        bpm: 140,
      },
      {
        name: "Radio Freak",
        type: "soundcloud",
        id: "832516690",
        secretToken: "s-WFObAbCzVsZ",
        bpm: 138,
      },
    ],
  }
};


/*
For devving, easy to swap in:
tracks: [
      { // These tracks are useful for devving on the player
        title: "Fake short song 1",
        id: "58432359" //287949388"
      },
      {
        title: "Fake short song 2",
        id: "177365673"
      },
      {
        title: "Fake short song 3",
        id: "177365185"
      },
      {
        title: "Fake short song 4",
        id: "177364838"
      }
],
*/
