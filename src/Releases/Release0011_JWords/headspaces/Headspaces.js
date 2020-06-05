import React, { useState, useMemo, useEffect } from 'react';
import { useLoader, useFrame } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import Explode from './Explode';
import Spin from './Spin';
import Reflect from './Reflect';
import useAudioPlayer from "../../../Common/UI/Player/hooks/useAudioPlayer";
import * as C from '../constants';

export default function Headspaces({ stepIdx, ...props }) {

    const { audioStream, currentTime, currentTrackName } = useAudioPlayer();
    const [headspace, setHeadspace] = useState(C.TRACKS_CONFIG[C.FIRST_TRACK].steps[0].headspace)

    // // ensu
    useEffect(() => {
        if (!currentTrackName) return;
        if (!headspace) {
            setHeadspace(C.TRACKS_CONFIG[currentTrackName].steps[0].headspace);
        }
    }, [currentTrackName])

    useEffect(() => {
        if (!currentTrackName) return;
        console.log("SETTING HEADSPACE", stepIdx)
        setHeadspace(C.TRACKS_CONFIG[currentTrackName].steps[stepIdx].headspace)
    }, [stepIdx])


    const lowPolyTwoFace = useLoader(GLTFLoader, C.HEADSPACE_9_PATH, loader => {
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco-gltf/')
        loader.setDRACOLoader(dracoLoader)
    });

    const lowPolyOneFace = useLoader(GLTFLoader, C.HEADSPACE_10_PATH, loader => {
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco-gltf/')
        loader.setDRACOLoader(dracoLoader)
    });

    return (
        <>
            {/* <Explode gltf={lowPolyTwoFace} /> */}
            {headspace == C.EXPLODE && <Explode gltf={lowPolyTwoFace} />}
            {headspace == C.SPIN && <Spin gltf={lowPolyTwoFace} />}
            {headspace == C.REFLECT && <Reflect gltf={lowPolyOneFace} />}
        </>
    )
}
