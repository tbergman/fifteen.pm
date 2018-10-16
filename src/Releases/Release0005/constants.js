export const CONSTANTS = {
  // Get window dimension
  ww: document.documentElement.clientWidth || document.body.clientWidth,
  wh: window.innerHeight,
  textures: {
    galaxy: {
      url: "assets/circuit_pattern.png"
    },
  },
  trackTimes: {
    Heaven: {
      bpm: 131.0,
      enterWormhole: [
        94, // synths enter,
        180, // synths drop out
        195, // drums change
        210, // weird bass enters
        253, //noisy snare break
        275, // crazy synths enter
        310 // drums drop out
      ],
      pivotStatue: [
        // 3,
        // 4,
        // 6,
        // 8,
        // 15.5, // these are all the chain/cash register noises
        // 15,
        19.05,
        22.8,
        26.4,
        30.05,
        33.7,
        37.1,
        40.7,
        // 30,
        // 33.5,
        // 36.8,
        // 40.75,
        44.5,
        48,
        // 52.5,
        55.4,
        59,
        62.5,
        66.1,
        69.9,
        //72,
        77,
        80.55,
        84.3,
        88,
        91.5,
        124,
        127.8,
        131.2,
        135,
        138.5,
        142,
        146.2,
        148,
        153,
        156.7,
        161,
        164,
        167.8,
        171,
        174.8,
        178.3, // ooff
        283,
        287,
        291,
        294,
        297.8,
        301.5,
        305.1,
        308.5
     ]
    },
    Bullseye: {
      bpm: 134.0,
      enterWormhole: [
        0, // the song is spooky
        10,
        31, // snares enter
        87, // hats enter
        114, // weird noise hit enters (faster feeling)
        143, // kick leaves
        157,  // kick re-emerges
        201, // chills out a bit
        245, // hats pick up
        293, // rims come in
        322, // chills out again
        337, // snares come back
        365, // crazy toms eneter
        408, // outro
      ],
      shakeStatue: []
    }

  }
};
