
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
};
