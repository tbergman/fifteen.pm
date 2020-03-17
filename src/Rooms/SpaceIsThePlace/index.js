import React, { useMemo } from 'react';
import { CONTENT } from "../../Content";
import { VideoPlayerProvider } from '../../UI/Player/VideoPlayerContext';
import UI from '../../UI/UI';
import Canvas from './Canvas';

export default function SpaceIsThePlaceRoom({ }) {
    const content = useMemo(() => CONTENT[window.location.pathname]);
    return (
        <>
            <UI content={content} renderPlayer={false} loadWithNavigation={false}/>
            <Canvas content={content} />
        </>
    );
}