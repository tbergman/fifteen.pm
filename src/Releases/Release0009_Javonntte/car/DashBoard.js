import React, { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useResource, useFrame } from 'react-three-fiber';
import useMusicPlayer from '../../../UI/Player/hooks';
import * as C from '../constants';
import { SurfaceImperfections08, EmissiveScuffedPlasticMaterial } from '../../../Utils/materials';

export default function Dashboard({ gltf, onTrackSelect }) {
    const { currentTrackName } = useMusicPlayer();
    const [selectedButtonMaterialRef, selectedButtonMaterial] = useResource();
    const [defaultButtonMaterialRef, defaultButtonMaterial] = useResource();
    const materials = [selectedButtonMaterial, defaultButtonMaterial];
    const [materialsLoaded, setMaterialsLoaded] = useState(false);
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
        if (materials.filter(material => material ? true : false).length == materials.length){
            setMaterialsLoaded(true)
        }
    })

    function pickMaterial(geometry) {
        const isCurTrack = currentTrackName && currentTrackName.toLowerCase().includes(geometry.name);
        return isCurTrack ? selectedButtonMaterial : defaultButtonMaterial;
    }

    return <>
        <EmissiveScuffedPlasticMaterial materialRef={selectedButtonMaterialRef} />
        <EmissiveScuffedPlasticMaterial materialRef={defaultButtonMaterialRef} />
            {materialsLoaded && Object.keys(dashboardButtons).map(buttonName => {
                const geometry = dashboardButtons[buttonName];
                return (
                    <mesh
                        ref={buttonRefs[buttonName]}
                        key={buttonName}
                        onClick={e => {
                            const curActionName = buttonName + "Action";
                            actions.current[curActionName].play();
                            // onTrackSelect(C.TRACK_LOOKUP[geometry.name])
                        }}
                        material={pickMaterial(geometry)}
                    >
                        <bufferGeometry attach="geometry" {...geometry} />
                    </mesh>
                )
            })}
        <pointLight
            position={[.8, -.75, 2]}
            intensity={.5}
        />
    </>
}