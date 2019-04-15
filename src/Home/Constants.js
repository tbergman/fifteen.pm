import { assetPath } from "../Utils/assets";

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}


export const NUM_RELEASES = 7;

// same number of sounds as there are number of releases...
export const SOUNDS = shuffle([
    assetPath("0/sounds/chord-root.wav"),
    assetPath("0/sounds/chord-fourth.wav"),
    assetPath("0/sounds/chord-fifth.wav"),
    assetPath("0/sounds/chord-octave.wav"),
    assetPath("0/sounds/chord-second.wav"),
    assetPath("0/sounds/chord-fifth-down.wav"),
    assetPath("0/sounds/chord-third.wav"),
    assetPath("0/sounds/chord-ninth.wav")
]);


