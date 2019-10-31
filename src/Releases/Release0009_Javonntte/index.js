import React, { useMemo } from 'react';
import { CONTENT } from '../../Content';
import { MusicPlayerProvider } from '../../UI/Player/MusicPlayerContext';
import Release from './Release';

export default function Release0009_Javonntte({ }) {
    const tracks = useMemo(() => CONTENT[window.location.pathname].tracks)
    return (
        <MusicPlayerProvider tracks={tracks}>
            <Release />
        </MusicPlayerProvider >
    );
}