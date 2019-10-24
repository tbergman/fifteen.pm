import React, { useRef, useContext, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from 'react-three-fiber';
import { CONTENT } from '../../Content';
import Menu from '../../UI/Menu/Menu'; // TODO code stutter :/
import { Scene } from './Scene';
import Player from '../../UI/Player/Player';
import * as C from './constants';
import { soundcloudTrackIdFromSrc } from '../../Utils/Audio/SoundcloudUtils';
import './index.css';
import TrackList from "../../UI/Player/TrackList";
import PlayerControls from "../../UI/Player/PlayerControls";
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
            {/* <Menu> */}
            <Player
                colors={content.colors}
                artist={content.artist}
                tracks={content.tracks}

            />
            {/* </Menu> */}
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