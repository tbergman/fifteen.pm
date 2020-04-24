import React, { useMemo } from 'react';
import { CONTENT } from '../../Content';
import { AudioPlayerProvider } from '../../Common/UI/Player/AudioPlayerContext';
import Release from './Release';
import "./index.css";

export default function Release0010_AlienD({ }) {
    const tracks = useMemo(() => CONTENT[window.location.pathname].tracks)
    return (
        <AudioPlayerProvider tracks={tracks}>
          <div className={'background'}>
            <Release/>
          </div>
        </AudioPlayerProvider >
    );
}