import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useResource } from 'react-three-fiber';
import * as THREE from 'three';
import useMusicPlayer from '../../../UI/Player/hooks';
import { EmissiveScuffedPlasticMaterial } from '../../../Utils/materials';
import * as C from '../constants';

export default function Dashboard({ gltf, onTrackSelect }) {
    const { currentTrackName } = useMusicPlayer();
    const [selectedButtonMaterialRef, selectedButtonMaterial] = useResource();
    const [defaultButtonMaterialRef, defaultButtonMaterial] = useResource();
    const materials = [selectedButtonMaterial, defaultButtonMaterial];
    const [materialsLoaded, setMaterialsLoaded] = useState(false);
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

    // animation setup
    const buttonRefs = {}
    C.DASH_BUTTONS.forEach(buttonName => buttonRefs[buttonName] = useRef());
    const actions = useRef()
    const [mixer] = useState(() => new THREE.AnimationMixer());
    useFrame((state, delta) => mixer.update(delta))
    useEffect(() => {
        if (!materialsLoaded) return;
        actions.current = {};
        gltf.animations.forEach(animationClip => {
            const buttonName = animationClip.name.split("Action")[0];
            const action = mixer.clipAction(animationClip, buttonRefs[buttonName].current);
            action.setLoop(THREE.LoopOnce);
            actions.current[animationClip.name] = action;
        })
        return () => gltf.animations.forEach(clip => mixer.uncacheClip(clip))
    }, [materialsLoaded])

    useEffect(() => {
        if (materials.filter(material => material ? true : false).length == materials.length) {
            setMaterialsLoaded(true)
        }
    })

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
        <EmissiveScuffedPlasticMaterial materialRef={selectedButtonMaterialRef} color="yellow" emissive="pink" />
        <EmissiveScuffedPlasticMaterial materialRef={defaultButtonMaterialRef} />
        {materialsLoaded && Object.keys(dashboardButtons).map(buttonName => {
            const geometry = dashboardButtons[buttonName];
            return (
                <mesh
                    ref={buttonRefs[buttonName]}
                    key={buttonName}
                    onClick={e => {
                        const curActionName = buttonName + "Action";
                        console.log("BLAHBLAHBLAH", curActionName);
                        actions.current[curActionName].play();
                        const trackShorthand = buttonName.split("button_")[1];
                        // onTrackSelect(C.TRACK_LOOKUP[trackShorthand])
                    }}
                    material={selectedButton === buttonName ? selectedButtonMaterial : defaultButtonMaterial}
                >
                    <bufferGeometry attach="geometry" {...geometry} />
                </mesh>
            )
        })}
    </>
}