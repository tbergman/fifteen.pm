import { assetPath } from "../../Utils/assets";
import * as C from "./constants";

export const assetPath10 = p => {
  return assetPath("10/" + p);
};

export const choose = choices => {
  return choices[Math.floor(Math.random() * choices.length)];
};

export const copy = x => {
  return JSON.parse(JSON.stringify(x));
};

export const calcSoundOffsetUnit = (bpm, barsPerSample) => {
  return 60.0 / (bpm / barsPerSample);
};

export const genSoundOffsets = (numSamples, barsPerSample, bpm) => {
  let offsets = [];
  let soundOffsetUnit = calcSoundOffsetUnit(bpm, barsPerSample);
  for (var i = 0; i < numSamples; i++) {
    offsets.push([soundOffsetUnit * i, soundOffsetUnit]);
  }
  return offsets;
}

export const map = (value, start1, stop1, start2, stop2) => {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
}

export const lerp =  (start, end, amt) => {
  return (1 - amt) * start + amt * end
}