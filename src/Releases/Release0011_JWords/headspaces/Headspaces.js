import React, { useState, useContext, useMemo, useEffect } from 'react';
import { useLoader, useFrame, useResource, useThree } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import Explode from './Explode';
import Spin from './Spin';
import Reflect from './Reflect';
import useAudioPlayer from "../../../Common/UI/Player/hooks/useAudioPlayer";
import * as C from '../constants';
import {MaterialsContext} from '../MaterialsContext';

export default function Headspaces({ stepIdx, step, colorMap, ...props }) {
    const { mouse } = useThree();
    const [ref, headspaces] = useResource()
    const { audioStream, currentTime, currentTrackName } = useAudioPlayer();
    const [headspace, setHeadspace] = useState(C.TRACKS_CONFIG[C.FIRST_TRACK].steps[0].headspace)
    const {wireframey, noise1, naiveGlass} = useContext(MaterialsContext);
    const [material, setMaterial] = useState()
   
    function _setMaterial(materialName, setter) {
        if (materialName == C.NOISE1) {
            setMaterial(noise1)
        } else if (materialName == C.NAIVE_GLASS) {
            setMaterial(naiveGlass)
        } else if (materialName == C.WIREFRAMEY) {
            // TODO grab the maps after gltf load so we can assign them at this step
            setMaterial(wireframey)
        } else {
            console.error("no match for materialName", materialName);
        }
    }

    useEffect(() => {
        if (!material) _setMaterial(step.headmat);
    })

    useEffect(() => {
        if (!currentTrackName) return;
        _setMaterial(step.headmat);
    }, [stepIdx])

    useEffect(() => {
        if (!currentTrackName) return;
        if (!headspace) {
            setHeadspace(C.TRACKS_CONFIG[currentTrackName].steps[0].headspace);
        }
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

    useFrame(() => {
        if (!headspaces) return;
        headspaces.position.x = mouse.x / 6.;
        headspaces.position.y = mouse.y / 6.;
    })

    return (
        <group ref={ref}>
            {headspaces &&
                <>
                    {headspace == C.EXPLODE && <Explode gltf={lowPolyTwoFace} material={material} />}
                    {headspace == C.SPIN && <Spin gltf1={lowPolyTwoFace} gltf2={lowPolyOneFace} material1={material} material2={material.copy()} />}
                    {headspace == C.REFLECT && <Reflect gltf={lowPolyOneFace} material={material}/>}
                </>
            }
        </group>
    )
}
