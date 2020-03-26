import React, { useMemo } from 'react';
import { CONTENT } from "../../Content";
import UI from '../../Common/UI/UI';
import { AudioPlayerProvider } from '../../Common/UI/Player/AudioPlayerContext';
import Canvas from './Canvas';

export default function Release0001_Yahceph({ }) {
    const content = useMemo(() => CONTENT[window.location.pathname]);
    return (
        <AudioPlayerProvider tracks={content.tracks}>
            <UI content={content} />
            <Canvas />
        </AudioPlayerProvider>
    );
}