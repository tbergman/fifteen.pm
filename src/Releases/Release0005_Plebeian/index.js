import React, { useMemo, useState } from 'react';
import { CONTENT } from "../../Content";
import { AudioPlayerProvider } from '../../Common/UI/Player/AudioPlayerContext';
import UI from '../../Common/UI/UI';
import Canvas from './Canvas';

export default function Release0005_Plebeian({ }) {
  const content = useMemo(() => CONTENT[window.location.pathname]);
  const [hasEnteredWorld, setHasEnteredWorld] = useState(false);
  return (
    <AudioPlayerProvider tracks={content.tracks}>
      <UI content={content} onOverlayHasBeenClosed={() => setHasEnteredWorld(true)} />
      <Canvas hasEnteredWorld={hasEnteredWorld} />
    </AudioPlayerProvider>
  );
}