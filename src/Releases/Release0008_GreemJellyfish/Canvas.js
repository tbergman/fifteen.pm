import React from 'react';
import useVideoPlayer from '../../UI/Player/hooks/useVideoPlayer';
import '../Release.css';
import Scene from './Scene';

export default function Canvas({ }) {
  const { videoPlayer } = useVideoPlayer();
  return <Scene videoPlayer={videoPlayer} />
}