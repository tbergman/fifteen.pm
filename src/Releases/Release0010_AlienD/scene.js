import React, { useEffect, useState, Suspense } from "react";
import { FixedLights } from "./lights";
import { useFrame, useThree } from "react-three-fiber";
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
  const {camera} = useThree();
  const [theme, setTheme] = useState(THEMES['Cube Jazz']);
  
  useEffect(() => {
    if (currentTrackName) {
      setTheme(THEMES[currentTrackName])
    }
  }, [currentTrackName]);
  
  useEffect(() => {
    if (camera) {
      camera.position.set( ...theme.camera.position );
    }
  }, [camera])

  return (
    <>
      <Suspense fallback={null}>
        <FrogCube
          amount={5}
          bpm={bpm}
          audioStream={audioStream}
          freqArray={freqArray}
          currentTrackName={currentTrackName}
        />
        <Sax />
        <Terrain {...theme.terrain}/>
      </Suspense>
    </>
  );
}
