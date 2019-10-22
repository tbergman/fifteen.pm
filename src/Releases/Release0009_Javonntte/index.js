import React, { useRef, useContext, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from 'react-three-fiber';
import { CONTENT } from '../../Content';
import Menu from '../../UI/Menu/Menu'; // TODO code stutter :/
import { Scene } from './Scene';
import * as C from './constants';
import { soundcloudTrackIdFromSrc } from '../../Utils/Audio/SoundcloudUtils';
import './index.css';
import { MusicPlayerProvider, MusicPlayerContext } from '../../UI/Player/ActiveSongContext';
import { BloomFilmEffect } from '../../Utils/Effects';

export default function Release0009_Javonntte({ }) {
    const mediaRef = useRef();
    const [newTrackSelected, setNewTrackSelected] = useState(false);
    const track = useRef();
    const [hasEntered, setHasEntered] = useState(false);
    const [activeSong, updateActiveSong] = useState("1");

    useEffect(() => {
        if (hasEntered) {
            // console.log('media.currentSrc:', mediaRef.current.currentSrc);
            // const curId = soundcloudTrackIdFromSrc(mediaRef.current.currentSrc);
            // track.current = C.TRACK_LOOKUP[curId];
            // setNewTrackSelected(true);
        }
    });

    useEffect(() => {
        // console.log("activeSong!", activeSong);
    }, [activeSong])


    return (
        <MusicPlayerProvider>
            {/* <Menu
                content={CONTENT[window.location.pathname]}
                menuIconFillColor={CONTENT[window.location.pathname].theme.iconColor}
                mediaRef={mediaRef}
                updateSongFn={updateActiveSong}
                // mediaRef={el => {
                //     mediaRef.current = el;
                //     setNewTrackSelected(true);
                // }}
                didEnterWorld={() => { setHasEntered(true) }}
            /> */}
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
        </MusicPlayerProvider>
    );
}