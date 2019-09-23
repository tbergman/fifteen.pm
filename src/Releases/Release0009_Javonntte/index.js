import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from 'react-three-fiber';
import { CONTENT } from '../../Content';
import Menu from '../../UI/Menu/Menu'; // TODO code stutter :/
import { Scene } from './scene';
import * as C from './constants';
import { soundcloudTrackIdFromSrc } from '../../Utils/Audio/SoundcloudUtils';
import './index.css';

export default function Release0009_Javonntte({ }) {
    const mediaRef = useRef()
    const [track, setTrack] = useState(C.TRACK_LOOKUP[679771259]); // TODO rm hardcoded track assignment
    const [curSrc, setCurSrc] = useState();
    const [curTime, setCurTime] = useState(0);

    // TODO having trouble figuring out mediaRef state handling
    useEffect(() => {
        if (mediaRef) {
            console.log('mediaRef:', mediaRef.current);
            console.log('mediaRef.current:', mediaRef.current);
            // console.log("mediaRef.current.audio:", mediaRef.current.);
            console.log("mediaRef.current.currentSrc:", mediaRef.current.currentSrc);
            // console.log("mediaRef.current.src:", mediaRef.current.src)
            // if (mediaRef.currentSrc) {
            //     const trackId = soundcloudTrackIdFromSrc(mediaRef.currentSrc);
            //     setTrack(C.TRACK_LOOKUP[trackId]);
            // }
        }
    });

    // useEffect(() => {
    //    setCurSrc(mediaRef.current.currentSrc); 
    // });

    return (
        <>
            <Menu
                content={CONTENT[window.location.pathname]}
                menuIconFillColor={CONTENT[window.location.pathname].theme.iconColor}
                mediaRef={el => mediaRef.current = el}
            />
            <Canvas
                id="canvas"
                antialias="false"
                onCreated={({ gl }) => {
                    gl.shadowMap.enabled = true;
                }}
            >
                <Scene track={track} />
            </Canvas>
        </>
    );
}