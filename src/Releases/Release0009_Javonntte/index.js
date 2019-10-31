import React, { useRef, useContext, useMemo, useEffect, useState } from 'react';
import { CONTENT } from '../../Content';

import UI from '../../UI/UI';
import './index.css';
import { MusicPlayerProvider } from '../../UI/Player/MusicPlayerContext';

import JavonntteCanvas from './Canvas';

export default function Release0009_Javonntte({ }) {
    const content = useMemo(() => CONTENT[window.location.pathname]);
    const tracks = useMemo(() => content.tracks)
    return (
        <MusicPlayerProvider tracks={tracks}>
            <UI content={content} />
            <JavonntteCanvas />
        </MusicPlayerProvider >
    );
}