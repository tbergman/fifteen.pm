import React, { useEffect, useMemo, useRef, useState, useContext } from 'react';
import { useFrame, useResource } from 'react-three-fiber';
import * as THREE from 'three';
import useAudioPlayer from '../../../Common/UI/Player/hooks/useAudioPlayer';
import { MaterialsContext } from '../MaterialsContext';
import * as C from '../constants';

export default function Dashboard({ gltf, onThemeSelect }) {
    const { currentTrackName } = useAudioPlayer();
    const { scuffedPlasticGlowing: selectedButtonMaterial,
        scuffedPlasticRed: defaultButtonMaterial } = useContext(MaterialsContext);

    const [selectedButton, setSelectedButton] = useState(null);
    const dashboardButtons = useMemo(() => {
        const buttons = {};
        gltf.scene.traverse(child => {
            C.DASH_BUTTONS.forEach(buttonName => {
                if (child.name == buttonName) {
                    child.geometry.name = buttonName;
                    buttons[buttonName] = child.geometry.clone();
                }
            })
        });
        return buttons;
    });

    useEffect(() => {
        if (!currentTrackName) return;
        C.DASH_BUTTONS.forEach(buttonName => {
            const songShortHand = buttonName.split("button_")[1];
            if (currentTrackName.toLowerCase().includes(songShortHand)) {
                setSelectedButton(buttonName)
            }
        })
    }, [currentTrackName])

    return <>
        {Object.keys(dashboardButtons).map(buttonName => {
            const geometry = dashboardButtons[buttonName];
            return (
                <mesh
                    key={buttonName}
                    onClick={e => {
                        const trackShorthand = buttonName.split("button_")[1];
                        onThemeSelect(C.TRACK_LOOKUP[trackShorthand])
                    }}
                    material={selectedButton === buttonName ? selectedButtonMaterial : defaultButtonMaterial}
                >
                    <bufferGeometry attach="geometry" {...geometry} />
                </mesh>
            )
        })}
    </>
}