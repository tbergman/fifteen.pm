import React, { useMemo } from 'react';
import { CONTENT } from '../../Content';
import { MusicPlayerProvider } from '../../UI/Player/MusicPlayerContext';
import Release from './Release';
import "./index.css";

export default function Release0010_AlienD({ }) {
    const tracks = useMemo(() => CONTENT[window.location.pathname].tracks)
    return (
        <MusicPlayerProvider tracks={tracks}>
            <Release />
        </MusicPlayerProvider >
    );
}