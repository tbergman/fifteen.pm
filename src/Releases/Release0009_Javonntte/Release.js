import React, { useEffect, useState } from 'react';
import { CONTENT } from '../../Content';
import useMusicPlayer from '../../UI/Player/hooks';
import UI from '../../UI/UI';
import JavonntteCanvas from './Canvas';
import * as C from './constants';
import { cloneDeep } from 'lodash';


export default function Release({ }) {
    const { playTrack, currentTrackId } = useMusicPlayer();
    const [content, setContent] = useState(cloneDeep(CONTENT[window.location.pathname]));
    const [colorTheme, setColorTheme] = useState(C.TRACK_METADATA["679771262"].theme);

    useEffect(() => {
        setContent(CONTENT[window.location.pathname])
    }, []);

    useEffect(() => {
        if (currentTrackId) setColorTheme(C.TRACK_METADATA[currentTrackId].theme);
    }, [currentTrackId])

    function onThemeSelect(trackId) {
        const metadata = C.TRACK_METADATA[trackId]
        setColorTheme(metadata.theme);
        playTrack(metadata.index)
    }

    useEffect(() => {
        content.colors = colorTheme.UIColors;
    }, [colorTheme])

    return <>{content &&
        <>
            <UI content={content} />
            <JavonntteCanvas colorTheme={colorTheme} onThemeSelect={onThemeSelect} />
        </>
    }</>
}