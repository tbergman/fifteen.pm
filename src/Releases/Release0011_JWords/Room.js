import React, { useContext, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from 'react-three-fiber';
import { MaterialsContext } from './MaterialsContext';
import useAudioPlayer from '../../Common/UI/Player/hooks/useAudioPlayer';
import * as C from './constants';

export default function Room({ stepIdx }) {
    const { purpleTron2, darkTron2, bwTron2 } = useContext(MaterialsContext);
    const { currentTrackName, currentTime, audioPlayer } = useAudioPlayer();
    const [material, setMaterial] = useState()

    function _setMaterial(materialName) {
        if (materialName == C.PURPLE_TRON2) {
            setMaterial(purpleTron2)
        } else if (materialName == C.DARK_TRON2) {
            setMaterial(darkTron2)
        } else if (materialName == C.BW_TRON2) {
            setMaterial(bwTron2)
        } else {
            console.error("no match for materialName", materialName);
        }
    }

    useEffect(() => {
        if (!material) setMaterial(purpleTron2);
    })

    useEffect(() => {
        if (!currentTrackName) return;
        _setMaterial(C.TRACKS_CONFIG[currentTrackName].steps[stepIdx].room);
    }, [stepIdx])

    useEffect(() => {
        if (!currentTrackName) return;
        _setMaterial(C.TRACKS_CONFIG[currentTrackName].steps[0].room);
    }, [currentTrackName])

    return (
        <>
            {material &&
                <mesh scale={[10, 10, 10]} position={[0, 0, 0,]} material={material}>
                    <sphereBufferGeometry attach="geometry" />
                </mesh >
            }
        </>
    )
}
