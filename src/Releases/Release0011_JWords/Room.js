import React, { useContext, useEffect, useState } from 'react';
import * as THREE from 'three';
import { MaterialsContext } from './MaterialsContext';
import useAudioPlayer from '../../Common/UI/Player/hooks/useAudioPlayer';
import * as C from './constants';

export default function Room({ }) {
    const { purpleTron2, darkTron2, bwTron2 } = useContext(MaterialsContext);
    const { currentTrackName } = useAudioPlayer();
    const [material, setMaterial] = useState()

    useEffect(() => {
        if (!material) setMaterial(purpleTron2)
    })

    useEffect(() => {
        if (!currentTrackName) return;
        const materialName = C.TRACKS_CONFIG[currentTrackName].steps[0].room
        if (materialName == C.PURPLE_TRON2) {
            setMaterial(purpleTron2)
        } else if (materialName == C.DARK_TRON2) {
            setMaterial(darkTron2)
        } else if (materialName == C.BW_TRON2) {
            setMaterial(bwTron2)
        }
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
