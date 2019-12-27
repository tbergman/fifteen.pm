import React, { useEffect, useState } from 'react';
import { CONTENT } from '../../Content';
import useAudioPlayer from '../../UI/Player/hooks/useAudioPlayer';
import UI from '../../UI/UI';
import AlienDCanvas from './Canvas';
import * as C from './constants';

export default function Release({ }) {
    const { playTrack, currentTrackId, audioStream, audioPlayer, currentTime, bpm } = useAudioPlayer();
    const [content, setContent] = useState(false);
    console.log(currentTrackId);
    useEffect(() => {
        setContent(CONTENT[window.location.pathname])
    }, []);
    if (audioStream) {
        console.log("currentTime", currentTime);
        console.log("audioStream", audioPlayer.currentTime);
    }


    return <>{content &&
        <>
            <UI content={content} />
            <AlienDCanvas />
        </>
    }</>
}