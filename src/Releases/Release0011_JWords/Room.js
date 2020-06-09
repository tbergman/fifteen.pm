import React, { useContext, useEffect, useState } from 'react';
import useAudioPlayer from '../../Common/UI/Player/hooks/useAudioPlayer';
import * as C from './constants';
import { MaterialsContext, setMaterial } from './MaterialsContext';

export default function Room({ step, stepIdx }) {
    const { currentTrackName } = useAudioPlayer();
    const [material, setMaterial] = useState()

    const { purpleTron2, blackBG, orangeTron2 } = useContext(MaterialsContext);

    function _setMaterial(materialName, setter) {
        if (materialName == C.PURPLE_TRON2) {
            setMaterial(purpleTron2)
        } else if (materialName == C.BLACK_BG) {
            setMaterial(blackBG)
        } else if (materialName == C.ORANGE_TRON2) {
            setMaterial(orangeTron2)
        } else {
            console.error("no match for materialName", materialName);
        }
    }

    useEffect(() => {
        if (!material) _setMaterial(step.room);
    })

    useEffect(() => {
        if (!currentTrackName) return;
        _setMaterial(step.room);
    }, [stepIdx])

    useEffect(() => {
        if (!currentTrackName) return;
        _setMaterial(step.room);
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
