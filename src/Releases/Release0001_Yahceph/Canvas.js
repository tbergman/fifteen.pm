import React, { useState, useEffect } from 'react';
import useAudioPlayer from '../../UI/Player/hooks';
import '../Release.css';
import Scene from './Scene';


export default function Canvas({ }) {
  const { isPlaying, audioStream } = useAudioPlayer();
  const [freqArray, setFreqArray] = useState();

  useEffect(() => {
    if (audioStream && !freqArray) {
      setFreqArray(
        new Uint8Array(audioStream.analyser.frequencyBinCount)
      )
    }
  }, [isPlaying])

  return <Scene
    freqArray={freqArray}
    audioStream={audioStream}
  />
}