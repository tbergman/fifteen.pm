import React, { useMemo } from 'react';
import { CONTENT } from '../../Content';
import { AudioPlayerProvider } from '../../Common/UI/Player/AudioPlayerContext';
import Release from './Release';
import "./index.css";

export default function Release0009_Javonntte({ }) {
    const tracks = useMemo(() => CONTENT[window.location.pathname].tracks)
    return (
        <AudioPlayerProvider tracks={tracks}>
            <Release />
        </AudioPlayerProvider >
    );
}