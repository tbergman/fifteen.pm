import React, { useMemo } from 'react';
import { CONTENT } from "../../Content";
import UI from '../../UI/UI';
import { MusicPlayerProvider } from '../../UI/Player/MusicPlayerContext';
import Canvas from './Canvas';

export default function Release0001_Yahceph({ }) {
    const content = useMemo(() => CONTENT[window.location.pathname]);
    return (
        <MusicPlayerProvider tracks={content.tracks}>
            <UI content={content} />
            <Canvas />
        </MusicPlayerProvider>
    );
}