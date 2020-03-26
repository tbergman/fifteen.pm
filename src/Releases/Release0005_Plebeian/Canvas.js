import React, { useEffect, useState } from 'react';
import useAudioPlayer from '../../Common/UI/Player/hooks/useAudioPlayer';
import '../Release.css';
import Scene from './Scene';

export default function Canvas({ hasEnteredWorld }) {
    const { audioPlayer, currentTrackName } = useAudioPlayer();
    const [trackName, setTrackName] = useState("Heaven")

    useEffect(() => {
        if (!currentTrackName) setTrackName("Heaven")
        else setTrackName(currentTrackName);
    }, [currentTrackName])

    return <Scene
        hasEnteredWorld={hasEnteredWorld}
        trackName={trackName}
        audioPlayer={audioPlayer}
    />
}




