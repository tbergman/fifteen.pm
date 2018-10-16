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
      shakeStatue: []
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
