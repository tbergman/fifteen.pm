import React, { useEffect, useState } from 'react';
import { CONTENT } from '../../Content';
import useMusicPlayer from '../../UI/Player/hooks';
import UI from '../../UI/UI';
import AlienDCanvas from './Canvas';
import * as C from './constants';

export default function Release({ }) {
    const { playTrack, currentTrackId } = useMusicPlayer();
    const [content, setContent] = useState(false);

    useEffect(() => {
        setContent(CONTENT[window.location.pathname])
    }, []);

    return <>{content &&
        <>
            <UI content={content} />
            <AlienDCanvas />
        </>
    }</>
}