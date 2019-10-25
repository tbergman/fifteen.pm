import React, { useRef, useContext, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import { CONTENT } from '../../Content';
import { Scene } from './Scene';
import UI from '../../UI/UI';
import './index.css';
import { MusicPlayerProvider } from '../../UI/Player/MusicPlayerContext';
import { BloomFilmEffect } from '../../Utils/Effects';

export default function Release0009_Javonntte({ }) {
    const track = useRef();
    const [hasEntered, setHasEntered] = useState(false);
    const content = useMemo(() => CONTENT[window.location.pathname]);

    useEffect(() => {
        if (hasEntered) {
            // console.log('media.currentSrc:', mediaRef.current.currentSrc);
            // const curId = soundcloudTrackIdFromSrc(mediaRef.current.currentSrc);
            // track.current = C.TRACK_LOOKUP[curId];
            // setNewTrackSelected(true);
        }
    });

    return (
        <MusicPlayerProvider tracks={content.tracks}>
            <UI content={content}/>
            <Canvas
                id="canvas"
                onCreated={({ gl }) => {
                    gl.shadowMap.enabled = true;
                    gl.gammaInput = true;
                    gl.gammaOutput = true;
                }}
            >
                <Scene
                    track={track}
                    onButtonClicked={(dispatchConfig) => {
                        const buttonName = dispatchConfig.eventObject.name;
                        const trackId = TRACK_BUTTON_ID_LOOKUP[buttonName];
                        if (curTrack !== trackId) {
                            setCurTrack(trackId);
                        }
                    }}
                />
                {/* <BloomFilmEffect /> */}
            </Canvas>
        </MusicPlayerProvider >
    );
}