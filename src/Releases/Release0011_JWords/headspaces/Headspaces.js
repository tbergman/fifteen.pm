import React, { useState, useMemo, useEffect } from 'react';
import { useLoader } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import Explode from './Explode';
import Spin from './Spin';
import Reflect from './Reflect';
import useAudioPlayer from "../../../Common/UI/Player/hooks/useAudioPlayer";
import * as C from '../constants';

export default function Headspaces({ stepIdx, ...props }) {

    const { audioStream, currentTime, currentTrackName } = useAudioPlayer();
    const [headspace, setHeadspace] = useState(C.TRACKS_CONFIG[C.REMEDY].steps[0].headspace)

    useEffect(() => {
        if (!currentTrackName) return;
        setHeadspace(C.TRACKS_CONFIG[currentTrackName].steps[0].headspace);
    }, [currentTrackName])

    useEffect(() => {
        if (!currentTrackName) return;
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
            {headspace == C.EXPLODE && <Explode gltf={lowPolyTwoFace} />}
            {headspace == C.SPIN && <Spin gltf={lowPolyTwoFace} />}
            {headspace == C.REFLECT && <Reflect gltf={lowPolyOneFace} />}
        </>
    )
}
