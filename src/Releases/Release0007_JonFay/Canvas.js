import React from 'react';
import useAudioPlayer from '../../Common/UI/Player/hooks/useAudioPlayer';
import '../Release.css';
import Scene from './Scene';


export default function Canvas({ contentReady, onContentReady }) {
  const { isPlaying } = useAudioPlayer();
  return <Scene contentReady={contentReady} onContentReady={onContentReady} paused={!isPlaying} />
}




