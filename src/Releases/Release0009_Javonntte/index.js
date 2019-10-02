import React, { useRef, useContext, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useRender } from 'react-three-fiber';
import { CONTENT } from '../../Content';
import Menu from '../../UI/Menu/Menu'; // TODO code stutter :/
import { Scene } from './scene';
import * as C from './constants';
import { soundcloudTrackIdFromSrc } from '../../Utils/Audio/SoundcloudUtils';
import './index.css';
import { MusicPlayerProvider, MusicPlayerContext } from '../../UI/Player/ActiveSongContext';

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
        console.log("activeSong!", activeSong);
    }, [activeSong])


    return (
        <MusicPlayerProvider>
            <Menu
                content={CONTENT[window.location.pathname]}
                menuIconFillColor={CONTENT[window.location.pathname].theme.iconColor}
                mediaRef={mediaRef}
                updateSongFn={updateActiveSong}
                // mediaRef={el => {
                //     mediaRef.current = el;
                //     setNewTrackSelected(true);
                // }}
                didEnterWorld={() => { setHasEntered(true) }}
            />
            <Canvas
                id="canvas"
                antialias="false"
                onCreated={({ gl }) => {
                    gl.shadowMap.enabled = true;
                    gl.shadowMap.type = THREE.PCFSoftShadowMap;
                    gl.gammaInput = true;
                    gl.gammaOutput = true;
                }}
            >
                <Scene
                    track={track}
                />
            </Canvas>
        </MusicPlayerProvider>
    );
}