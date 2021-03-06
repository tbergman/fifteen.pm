import React, { useMemo } from 'react';
import { CONTENT } from "../../Content";
import { VideoPlayerProvider } from '../../Common/UI/Player/VideoPlayerContext';
import UI from '../../Common/UI/UI';
import Canvas from './Canvas';

export default function Release0008_GreemJellyFish({ }) {
    const content = useMemo(() => CONTENT[window.location.pathname]);
    return (
        <VideoPlayerProvider tracks={content.tracks}>
            <UI content={content} />
            <Canvas />
        </VideoPlayerProvider>
    );
}