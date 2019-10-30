import React, { useMemo, useEffect } from 'react';
import { useResource } from 'react-three-fiber';
import * as C from '../constants';

export default function Dashboard({ gltf, onTrackSelect }) {
    // const [defaultTextMaterialRef, defaultTextMaterial] = useResource();
    // const [selectedTextMaterialRef, selectedTextMaterial] = useResource();
    // const [buttonMaterial]

    const dashboard = useMemo(() => {
        const geometries = [];
        gltf.scene.traverse(child => {
            Object.keys(C.TRACK_LOOKUP).forEach(trackShorthand => {
                if (child.name.includes(trackShorthand)) {
                    child.geometry.name = trackShorthand;
                    child.geometry.userData = {isText: child.name.includes("text")}
                    geometries.push(child.geometry);
                }
            })
        });
        return geometries;
    });

    return <>
        {dashboard.map((geometry, index) => {
            return (
                <mesh
                    key={index}
                    onPointerUp={() => onTrackSelect(C.TRACK_LOOKUP[geometry.name])}
                >
                    <bufferGeometry attach="geometry" {...geometry} />
                </mesh>
            )
        })}
    </>
}