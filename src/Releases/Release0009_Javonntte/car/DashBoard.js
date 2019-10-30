import React, { useMemo } from 'react';
import { useResource } from 'react-three-fiber';
import useMusicPlayer from '../../../UI/Player/hooks';
import * as C from '../constants';

export default function Dashboard({ gltf, onTrackSelect }) {
    const { currentTrackName } = useMusicPlayer();
    const [defaultTextMaterialRef, defaultTextMaterial] = useResource();
    const [selectedTextMaterialRef, selectedTextMaterial] = useResource();
    const [selectedButtonMaterialRef, selectedButtonMaterial] = useResource();
    const [defaultButtonMaterialRef, defaultButtonMaterial] = useResource();
    const materials = [defaultTextMaterial, selectedTextMaterial, selectedButtonMaterial, defaultButtonMaterial];
    const dashboard = useMemo(() => {
        const geometries = [];
        gltf.scene.traverse(child => {
            Object.keys(C.TRACK_LOOKUP).forEach(trackShorthand => {
                if (child.name.includes(trackShorthand)) {
                    child.geometry.name = trackShorthand;
                    child.geometry.userData = { isText: child.name.includes("text") }
                    geometries.push(child.geometry);
                }
            })
        });
        return geometries;
    });

    function materialsLoaded() {
        return materials.filter(material => material ? true : false).length == materials.length;
    }

    function pickMaterial(geometry) {
        const isCurTrack = currentTrackName && currentTrackName.toLowerCase().includes(geometry.name);
        if (geometry.userData.isText) {
            return isCurTrack ? selectedTextMaterial : defaultTextMaterial;
        } else {
            return isCurTrack ? selectedButtonMaterial : defaultButtonMaterial;
        }
    }

    return <>
        <meshLambertMaterial ref={selectedTextMaterialRef} color="white" />
        <meshBasicMaterial ref={defaultTextMaterialRef} color="black" />
        <meshLambertMaterial ref={selectedButtonMaterialRef} color="yellow" />
        <meshBasicMaterial ref={defaultButtonMaterialRef} color="red" />
        {materialsLoaded() && dashboard.map((geometry, index) => {
            return (
                <mesh
                    key={index}
                    onPointerUp={() => onTrackSelect(C.TRACK_LOOKUP[geometry.name])}
                    material={pickMaterial(geometry)}
                >
                    <bufferGeometry attach="geometry" {...geometry} />
                </mesh>
            )
        })}
    </>
}