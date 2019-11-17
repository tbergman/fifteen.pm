import React from 'react';
import useAudioPlayer from '../../UI/Player/hooks';
import '../Release.css';
import Scene from './Scene';


export default function Canvas({ contentReady, onContentReady }) {
  const { isPlaying } = useAudioPlayer();
  return <Scene contentReady={contentReady} onContentReady={onContentReady} paused={!isPlaying} />
}




