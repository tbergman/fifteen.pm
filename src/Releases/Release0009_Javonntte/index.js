import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useRender } from 'react-three-fiber';
import { CONTENT } from '../../Content';
import Menu from '../../UI/Menu/Menu'; // TODO code stutter :/
import { Scene } from './scene';
import * as C from './constants';
import { soundcloudTrackIdFromSrc } from '../../Utils/Audio/SoundcloudUtils';
import './index.css';
import { cloneDeep } from 'lodash';

export default function Release0009_Javonntte({ }) {
    const mediaRef = useRef();
    const [newTrackSelected, setNewTrackSelected] = useState(false);
    const track = useRef();
    const [hasEntered, setHasEntered] = useState(false);

    useEffect(() => {
        if (hasEntered) {
            // console.log('media.currentSrc:', mediaRef.current.currentSrc);
            // const curId = soundcloudTrackIdFromSrc(mediaRef.current.currentSrc);
            // track.current = C.TRACK_LOOKUP[curId];
            // setNewTrackSelected(true);
        }
    });

    useEffect(() => {
        // console.log("NEW TRACK SELECTED!, now setting to false; currentsrc:", mediaRef.current.currentSrc, 'mediaRef.current', mediaRef.current)
        setNewTrackSelected(false);
    }, [newTrackSelected])

    return (
        <>
            <Menu
                content={CONTENT[window.location.pathname]}
                menuIconFillColor={CONTENT[window.location.pathname].theme.iconColor}
                mediaRef={mediaRef}
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
        </>
    );
}