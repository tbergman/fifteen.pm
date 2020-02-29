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

export const calcSoundOffsetUnit = bpm => {
  return 60.0 / (bpm / C.SOUND_OFFSET_UNIT);
};
