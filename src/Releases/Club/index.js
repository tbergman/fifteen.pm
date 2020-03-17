import React, { useMemo } from 'react';
import { CONTENT } from "../../Content";
import { VideoPlayerProvider } from '../../UI/Player/VideoPlayerContext';
import UI from '../../UI/UI';
import Canvas from './Canvas';

export default function Club({ }) {
    const content = useMemo(() => CONTENT[window.location.pathname]);
    return (
        <VideoPlayerProvider tracks={content.tracks}>
            <UI content={content} />
            <Canvas />
        </VideoPlayerProvider>
    );
}