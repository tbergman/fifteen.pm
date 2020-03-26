import React, { useEffect, useState, Suspense } from "react";
import { FixedLights } from "./lights";
import { useFrame } from "react-three-fiber";
import FrogCube from "./FrogCube";
import Sax from "./Sax";
import useAudioPlayer from "../../Common/UI/Player/hooks/useAudioPlayer";
import Terrain from './Terrain';

export function Scene({}) {
  // using a filter for left and right arrow press
  const [freqArray, setFreqArray] = useState();
  const { audioStream, isPlaying, bpm, currentTrackName } = useAudioPlayer();

  useEffect(() => {
    if (audioStream && !freqArray) {
      setFreqArray(new Uint8Array(audioStream.analyser.frequencyBinCount));
    }
  }, [isPlaying]);

  useFrame(() => {
    if (audioStream && freqArray) {
      audioStream.analyser.getByteFrequencyData(freqArray);
    }
  });

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
        <Terrain/>
      </Suspense>
    </>
  );
}
