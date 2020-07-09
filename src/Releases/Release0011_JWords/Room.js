import React, { useContext, useEffect, useState } from 'react';
import useAudioPlayer from '../../Common/UI/Player/hooks/useAudioPlayer';
import * as C from './constants';
import { MaterialsContext, setMaterial } from './MaterialsContext';

export default function Room({ step, stepIdx }) {
    const { currentTrackName } = useAudioPlayer();
    const [material, setMaterial] = useState()
    const { purpleTron2, blackBG, orangeTron2 } = useContext(MaterialsContext);

    return (
        <>
            {step.room == C.BLACK_BG &&
                <mesh scale={[10, 10, 10]} position={[0, 0, 0,]} material={blackBG}>
                    <sphereBufferGeometry attach="geometry" />
                </mesh >
            }
            {step.room == C.PURPLE_TRON2 &&
                <mesh scale={[10, 10, 10]} position={[0, 0, 0,]} material={purpleTron2}>
                    <sphereBufferGeometry attach="geometry" />
                </mesh >
            }
            {step.room == C.ORANGE_TRON2 &&
                <mesh scale={[10, 10, 10]} position={[0, 0, 0,]} material={orangeTron2}>
                    <sphereBufferGeometry attach="geometry" />
                </mesh >
            }
        </>
    )
}
