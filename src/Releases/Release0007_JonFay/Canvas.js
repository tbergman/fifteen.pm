import React from 'react';
import useMusicPlayer from '../../UI/Player/hooks';
import '../Release.css';
import Scene from './Scene';


export default function Canvas({ contentReady, onContentReady }) {
  const { isPlaying } = useMusicPlayer();
  return <Scene contentReady={contentReady} onContentReady={onContentReady} paused={!isPlaying} />
}




