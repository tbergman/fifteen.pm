import React, { useEffect, useState } from 'react';
import { CONTENT } from '../../Content';
import useAudioPlayer from '../../Common/UI/Player/hooks/useAudioPlayer';
import UI from '../../Common/UI/UI';
import JavonntteCanvas from './Canvas';
import * as C from './constants';


export default function Release({ }) {
    const { playTrack, currentTrackId } = useAudioPlayer();
    const [content, setContent] = useState(CONTENT[window.location.pathname]);
    const [contentReady, setContentReady] = useState(false);
    const [theme, setTheme] = useState(C.TRACK_METADATA[C.TRACK_LOOKUP["life"]].theme);
    const [useDashCam, setUseDashCam] = useState(false);

    useEffect(() => {
        if (!currentTrackId) return;
        const metadata = C.TRACK_METADATA[currentTrackId];
        content.colors = metadata.theme.UIColors;
        setTheme(metadata.theme);
    }, [currentTrackId])

    function onTrackSelect(trackId) {
        const trackIndex = C.TRACK_ID_LOOKUP[trackId];
        playTrack(trackIndex)
    }

    return <>{content && theme &&
        <>
            <UI
                contentReady={contentReady}
                content={content}
                onOverlayHasBeenClosed={() => setUseDashCam(true)}
            />
            <JavonntteCanvas
                setContentReady={setContentReady}
                theme={theme}
                onThemeSelect={onTrackSelect}
                useDashCam={useDashCam}
            />
        </>
    }</>
}