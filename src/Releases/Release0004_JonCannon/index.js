import React, { useMemo, useState } from 'react';
import { CONTENT } from "../../Content";
import UI from '../../UI/UI';
import { MusicPlayerProvider } from '../../UI/Player/MusicPlayerContext';
import Canvas from './Canvas';

export default function Release0004_JonCannon({ }) {
  const content = useMemo(() => CONTENT[window.location.pathname]);
  const [hasEnteredWorld, setHasEnteredWorld] = useState(false);

  return (
    <MusicPlayerProvider tracks={content.tracks}>
      <UI content={content} onOverlayHasBeenClosed={() => setHasEnteredWorld(true)} />
      <Canvas hasEnteredWorld={hasEnteredWorld} />
    </MusicPlayerProvider>
  );
}