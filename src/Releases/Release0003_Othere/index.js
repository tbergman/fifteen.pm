import React, { useMemo } from 'react';
import { CONTENT } from "../../Content";
import { AudioPlayerProvider } from '../../UI/Player/AudioPlayerContext';
import UI from '../../UI/UI';
import Canvas from './Canvas';
import '../Release.css';

export default function Release0003_Othere({ }) {
  const content = useMemo(() => CONTENT[window.location.pathname]);
  return (
    <AudioPlayerProvider tracks={content.tracks}>
      <UI content={content} />
      <Canvas />
    </AudioPlayerProvider>
  );
}