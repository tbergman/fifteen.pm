import {
  Hover,
  MouseMove,
  Click,
  TwoFingerScroll,
  ArrowKeys,
  NoPhone,
  SlowLoad
} from "./UI/Controls/Icons";

import { assetPath } from "./Utils/assets";

export const LOGO_SVG_FILL_COLOR_BY_INDEX = {
  "/1": "#FF69B4",
  "/3": "red"
}

export const TOTAL_RELEASES = 7;

export const CONTENT = {
  "/": {
    home: true, // TODO rm
    theme: {
      message:
        "globally.ltd invites musicians to expand their visions through the collaborative development of experimental websites. Curated by artists and technologists in New York City, the collective creates experiences of meaning and specificity online, in opposition to the internet of platforms, templates, and streams. Responding to music with multisensory worlds, each release imagines a new space for sound.",
      iconColor: 'white',
      navColor: '#fff',
      fillColor: 'rgba(0, 0, 0, 0.5)',
      textColor: 'white',
    },
  },
  "/1": {
    artist: "YAHCEPH",
    textModel: assetPath("1/objects/text.gltf"),
    tracks: [
      {
        title: "Wun 4 Jas",
        id: "466084773",
        type: "soundcloud"
      }
    ],
    theme: {
      message:
        'Yahceph\'s production debut, "wun 4 jas", is composed of voice memos and buoyant pads floating somewhere between him and Jasmine, the namesake of this ode.',
      purchaseLink: "https://gltd.bandcamp.com/track/wun-4-jas",
      iconColor: '#fff',
      fillColor: 'rgba(255,105,180, 1)',
      logoSvgFillColor: 'rgba(255,105,180, 1)',
      textColor: '#fff',
      navColor: '#fff',
      controls: [
        {
          icon: MouseMove,
          instructions: "move mouse to make water ripple"
        }
      ]
    }
  },
  "/2": {
    artist: "YEAR UNKNOWN",
    textModel: assetPath("2/objects/text.gltf"),
    tracks: [
      {
        title: "Timer",
        id: "475418370",
        type: "soundcloud"
      }
    ],
    theme: {
      message:
        "Jen Fong (Year Unknown) serves up frenetic, glitch-fueled footwork on this otherworldly drum disturbance.",
      purchaseLink: "https://gltd.bandcamp.com/track/timer",
      iconColor: '#fff',
      fillColor: 'rgba(127, 0, 255, 0.5)',
      textColor: '#fff',
      navColor: '#fff',
      controls: [
        {
          icon: MouseMove,
          instructions: "click and drag mouse to look around"
        },
        {
          icon: TwoFingerScroll,
          instructions: "scroll to zoom"
        }
      ]
    }
  },
  "/3": {
    artist: "OTHERE",
    textModel: assetPath("3/objects/text.gltf"),
    tracks: [
      {
        title: "Let's Beach",
        id: "482138307",
        type: "soundcloud"
      }
    ],
    theme: {
      message:
        "Abbi Press makes buoyant, soul-inflected tunes by day. As Othere, she explores the darker, corporeal corners of her sound.",
      purchaseLink: "https://gltd.bandcamp.com/track/lets-beach",
      iconColor: 'rgba(255, 0, 0, 1)',
      navColor: 'rgba(255, 0, 0, 1)',
      fillColor: 'rgba(255, 0, 0, 0.7)',
      logoSvgFillColor: 'rgba(255, 0, 0, 1)',
      textColor: 'white',
      controls: [
        {
          icon: Hover,
          instructions: "hover over inner orb to activate filter"
        },
        {
          icon: MouseMove,
          instructions: "click and drag mouse to look around"
        },
        {
          icon: TwoFingerScroll,
          instructions: "scroll to zoom and fly through filter"
        }
      ]
    }
  },
  "/4": {
    artist: "JON CANNON",
    textModel: assetPath("4/objects/text.gltf"),
    tracks: [
      {
        title: "Nothing (Blood)",
        id: "507660189",
        type: "soundcloud"
      },
      {
        title: "Miracle Center",
        id: "513518607",
        type: "soundcloud"
      },
      {
        title: "Finesse",
        id: "513518595",
        type: "soundcloud"
      }
    ],
    theme: {
      message:
        "Jon Cannon's haunting house ballads are a product of his habitat: the long drag of Myrtle-Broadway where fluorescent-lit stores stock life's essentials.",
      purchaseLink: "https://gltd.bandcamp.com/album/ep-1",
      iconColor: '#fff',
      fillColor: 'rgba(0, 0, 0, 0.5)',
      textColor: '#fff',
      navColor: '#fff',
      controls: [
        {
          icon: MouseMove,
          instructions: "move mouse to look around"
        },
        {
          icon: Click,
          instructions: "click to advance flight path"
        },
        {
          icon: ArrowKeys,
          instructions: "use arrow keys to fly around"
        },
        {
          icon: NoPhone,
          instructions: "doesn't work on phones",
          alwaysShow: true
        }
      ]
    }
  },
  "/5": {
    artist: "PLEBEIAN",
    textModel: assetPath("5/objects/text.gltf"),
    tracks: [
      {
        title: "Heaven",
        id: "514219014",
        type: "soundcloud"
      },
      {
        title: "Bullseye",
        id: "514219020",
        type: "soundcloud"
      }
    ],
    theme: {
      message:
        "Plebeian’s toolbox rattles with chains, ball-bearings and loose screws on these slammin’ single-takes of industrial techno.",
      purchaseLink: "https://gltd.bandcamp.com/album/heaven",
      iconColor: '#fff',
      fillColor: 'rgba(40, 47, 175, 1)',
      textColor: '#fff',
      navColor: '#fff',
      controls: [
        {
          icon: MouseMove,
          instructions: "click and drag mouse to look around"
        },
        {
          icon: TwoFingerScroll,
          instructions: "scroll to zoom"
        }
      ]
    }
  },
  "/6": {
    artist: "VVEISS",
    textModel: assetPath("6/objects/text.gltf"),
    tracks: [
      {
        title: "ESCAPE VELOCITY",
        id: "529074519",
        type: "soundcloud"
      }
    ],
    theme: {
      message:
        "Dagger at the ready, vveiss plumbs virtual depths, carving out a subsonic ceremony of refracting rhythms.",
      purchaseLink: "https://gltd.bandcamp.com/track/escape-velocity",
      iconColor: '#fff',
      fillColor: 'rgba(127, 0, 255, 0.4)',
      textColor: '#fff',
      navColor: '#fff',
      controls: [
        {
          icon: MouseMove,
          instructions: "move mouse to look around"
        }
      ]
    }
  },
  "/7": {
    artist: "JON FAY",
    textModel: assetPath("7/objects/text.gltf"),
    tracks: [
      {
        title: "GOLDEN GROOVE",
        id: "565459281",
        type: "soundcloud"
      }
    ],
    theme: {
      message: "In this 22-minute meditation, Jon Fay captures the infinite pulse of the rave as it empties into the dawn.",
      purchaseLink: "https://gltd.bandcamp.com/track/golden-groove",
      iconColor: '#fff',
      fillColor: 'rgba(255, 102, 0, 0.4)',
      textColor: '#fff',
      navColor: '#fff',
      controls: [
        {
          icon: SlowLoad,
          instructions: "takes a few seconds to load"
        },
        {
          icon: ArrowKeys,
          instructions: "use arrow keys to walk forever"
        },
        {
          icon: MouseMove,
          instructions: "move mouse to look around"
        },
        {
          icon: NoPhone,
          instructions: "doesn't work on phones",
          alwaysShow: true
        }
      ]
    }
  },
  "/8": {
    artist: "GREEM JELLYFISH",
    tracks: [
      {
        title: "JUICY AND TENDER",
        id: "220556854",
        type: "soundcloud"
      },
    ],
    theme: {
      message: "DUR DUR DUR DUR DUR DUR DUR DUR",
      purchaseLink: "https://gltd.bandcamp.com/track/golden-groove",
      iconColor: '#fff',
      fillColor: 'rgba(0, 0, 0, 0.5)',
      textColor: '#fff',
      navColor: '#fff',
      controls: [
        {
          icon: ArrowKeys,
          instructions: "use arrow keys to orbit around"
        },
        {
          icon: MouseMove,
          instructions: "move mouse to yaw around"
        }
      ]
    }
  },
  "/greem-and-gltd-at-149ave-c": {
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
      // message: "DUR DUR DUR DUR DUR DUR DUR DUR",
      // purchaseLink: "https://gltd.bandcamp.com/track/golden-groove",
      // iconColor: '#fff',
      // fillColor: 'rgba(255, 0, 0, 0.5)',
      // textColor: '#fff',
      // navColor: '#fff',
      // controls: []
    }
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
