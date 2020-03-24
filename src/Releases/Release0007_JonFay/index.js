import React, { useMemo, useState } from 'react';
import { CONTENT } from "../../Content";
import UI from '../../Common/UI/UI';
import { AudioPlayerProvider } from '../../Common/UI/Player/AudioPlayerContext';
import Canvas from './Canvas';

export default function Release0007_JonFay({ }) {
  const content = useMemo(() => CONTENT[window.location.pathname]);
  const [contentReady, setContentReady] = useState(false);

  return (
    <AudioPlayerProvider tracks={content.tracks}>
      <UI content={content} contentReady={contentReady} />
      <Canvas contentReady={contentReady} onContentReady={() => setContentReady(true) } />
    </AudioPlayerProvider>
  );
}

