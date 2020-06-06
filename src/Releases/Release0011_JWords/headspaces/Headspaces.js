import React, { useState, useMemo, useEffect } from 'react';
import { useLoader, useFrame, useResource , useThree} from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import Explode from './Explode';
import Spin from './Spin';
import Reflect from './Reflect';
import useAudioPlayer from "../../../Common/UI/Player/hooks/useAudioPlayer";
import * as C from '../constants';

export default function Headspaces({ stepIdx, ...props }) {
    const {mouse} = useThree();
    const [ref, headspaces] = useResource()
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

    useFrame(() => {
        if (!headspaces) return;
        headspaces.position.x = mouse.x / 6.;
        headspaces.position.y = mouse.y / 6.;
    })

    return (
        <group ref={ref}>
            {headspaces &&
                <>
                    {headspace == C.EXPLODE && <Explode gltf={lowPolyTwoFace} />}
                    {headspace == C.SPIN && <Spin gltf={lowPolyTwoFace} />}
                    {headspace == C.REFLECT && <Reflect gltf={lowPolyOneFace} />}
                </>
            }
        </group>
    )
}
