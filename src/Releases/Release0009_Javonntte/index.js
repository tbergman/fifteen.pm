import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas } from 'react-three-fiber';
import { CONTENT } from '../../Content';
import Menu from '../../UI/Menu/Menu'; // TODO code stutter :/
import { Scene } from './scene';
import * as C from './constants';
import { soundcloudTrackIdFromSrc } from '../../Utils/Audio/SoundcloudUtils';
import './index.css';
import { cloneDeep } from 'lodash';

export default function Release0009_Javonntte({ }) {
    const mediaRef = useRef();
    const [mediaUpdated, setMediaUpdated] = useState(false);//useRef()
    const [track, setTrack] = useState(C.TRACK_LOOKUP[679771259]); // TODO rm hardcoded track assignment
    const [curSrc, setCurSrc] = useState();
    const [curTime, setCurTime] = useState(0);
    const [hasEntered, setHasEntered] = useState(false);

    useEffect(() => {
        if (mediaRef.current && !mediaUpdated) setMediaUpdated(true);
    });

    useEffect(() => {
        if (mediaUpdated && hasEntered) {
            console.log('mediaRef:', mediaRef.current.currentSrc);
        }
    }, [mediaUpdated, hasEntered]);

    return (
        <>
            <Menu
                content={CONTENT[window.location.pathname]}
                menuIconFillColor={CONTENT[window.location.pathname].theme.iconColor}
                mediaRef={mediaRef}
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
                <Scene track={track} />
            </Canvas>
        </>
    );
}