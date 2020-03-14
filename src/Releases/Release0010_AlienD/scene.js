import React, { useEffect, useState, Suspense } from "react";
import { FixedLights } from "./lights";
import { useThree, useFrame } from "react-three-fiber";
import FrogCube from "./FrogCube";
import Sky from "./Sky";
import useAudioPlayer from "../../UI/Player/hooks/useAudioPlayer";

export function Scene({}) {
  const { scene, camera } = useThree();
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
      <FixedLights />
      <ambientLight color={0xffffff} intensity={1.0} />
      <Suspense fallback={null}>
        <Sky/>
        <FrogCube
          amount={5}
          bpm={bpm}
          audioStream={audioStream}
          freqArray={freqArray}
          currentTrackName={currentTrackName}
        />
      </Suspense>
    </>
  );
}
