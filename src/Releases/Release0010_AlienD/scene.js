import React, { useEffect, useState, Suspense } from "react";
import { FixedLights } from "./lights";
import { useFrame } from "react-three-fiber";
import FrogCube from "./FrogCube";
import Sax from "./Sax";
import Sky from "./Sky";
import useAudioPlayer from "../../Common/UI/Player/hooks/useAudioPlayer";
import Terrain from './Terrain';
import { THEMES } from './constants';

export function Scene({}) {
  // using a filter for left and right arrow press
  const [freqArray, setFreqArray] = useState();
  const { audioStream, isPlaying, bpm, currentTrackName, currentTrackId} = useAudioPlayer();
  const [theme, setTheme] = useState(THEMES['Frog Shirt']);
  useEffect(() => {
    if (currentTrackName) {
      setTheme(THEMES[currentTrackName])
    }
  }, [currentTrackName]);

  return (
    <>
      <Suspense fallback={null}>
        <Sky {...theme.sky}/>
        <FrogCube
          amount={5}
          bpm={bpm}
          audioStream={audioStream}
          freqArray={freqArray}
          currentTrackName={currentTrackName}
        />
        {/* <Sax /> */}
        <Terrain {...theme.terrain}/>
      </Suspense>
    </>
  );
}
