import React, { useMemo, useState } from 'react';
import { CONTENT } from "../../Content";
import UI from '../../UI/UI';
import { AudioPlayerProvider } from '../../UI/Player/AudioPlayerContext';
import Canvas from './Canvas';

export default function Release0004_JonCannon({ }) {
  const content = useMemo(() => CONTENT[window.location.pathname]);
  const [hasEnteredWorld, setHasEnteredWorld] = useState(false);

  return (
    <AudioPlayerProvider tracks={content.tracks}>
      <UI content={content} onOverlayHasBeenClosed={() => setHasEnteredWorld(true)} />
      <Canvas hasEnteredWorld={hasEnteredWorld} />
    </AudioPlayerProvider>
  );
}