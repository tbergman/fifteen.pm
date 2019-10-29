import React, { useMemo } from 'react';
import { CONTENT } from "../../Content";
import { MusicPlayerProvider } from '../../UI/Player/MusicPlayerContext';
import UI from '../../UI/UI';
import Canvas from './Canvas';
import '../Release.css';

export default function Release0003_Othere({ }) {
  const content = useMemo(() => CONTENT[window.location.pathname]);
  return (
    <MusicPlayerProvider tracks={content.tracks}>
      <UI content={content} />
      <Canvas />
    </MusicPlayerProvider>
  );
}