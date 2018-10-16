export const CONSTANTS = {
  // Get window dimension
  ww: document.documentElement.clientWidth || document.body.clientWidth,
  wh: window.innerHeight,
  textures: {
    galaxy: {
      url: "assets/circuit_pattern.png"
    },
  },
  bpm: 145,
  beatTime: (60 / 145) * 1000,
  trackTimes: {
    Heaven: {
      enterTunnel: [
        60 + 34, // synths enter,
        60 * 3, // synths drop out
        60 * 3 + 15, // drums change
        60 * 3 + 30, // weird bass enters
        60 * 4 + 13, //noisy snare break
        60 * 4 + 35, // crazy synths enter
        60 * 5 + 10 // drums drop out
      ],
      shakeStatue: [
        15, // these are all the chain/cash register noises
        23,
        25,
        29,
        33,
        37,
        41,
        44,
        48,
        51,
        54,
        58,
        60 + 2,
        60 + 5,
        60 + 9,
        60 + 12,
        60 + 16,
        60 + 19,
        60 + 23,
        60 + 38,
        60 + 31,
        2 * 60 + 3,
        2 * 60 + 7,
        2 * 60 + 10,
        2 * 60 + 14,
        2 * 60 + 17,
        2 * 60 + 21,
        2 * 60 + 25,
        2 * 60 + 29,
        2 * 60 + 32,
        2 * 60 + 36,
        2 * 60 + 40,
        2 * 60 + 43,
        2 * 60 + 47,
        2 * 60 + 50,
        2 * 60 + 54,
        2 * 60 + 57,
        4 * 60 + 43,
        4 * 60 + 47,
        4 * 60 + 50,
        4 * 60 + 53,
        4 * 60 + 57,
        5 * 60,
        5 * 60 + 4,
        5 * 60 + 7
      ]
    },
    Bullseye: {
      enterTunnel: [
        0, // the song is spooky
        31, // snares enter
        60 + 27, // hats enter
        60 + 54, // weird noise hit enters (faster feeling)
        60 * 2 + 23, // kick leaves
        60 * 2 + 37,  // kick re-emerges
        60 * 3 + 21, // chills out a bit
        60 * 4 + 25, // hats pick up
        60 * 4 + 53, // rims come in
        60 * 5 + 22, // chills out again
        60 * 5 + 37, // snares come back
        60 * 6 + 5, // crazy toms eneter
        60 * 6 + 48, // outro
      ],
      shakeStatue: []
    }

  }
};
