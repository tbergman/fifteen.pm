import React, { useContext, useEffect, useRef, useState } from 'react';
import { BuildingsContext } from './BuildingsContext';
import { generateTileset } from './tiles';

export default function Buildings({ surface, neighborhoods }) {
    const instancedBuildings = useRef()
    const { buildings, loaded } = useContext(BuildingsContext);
    const [meshes, setMeshes] = useState();
    useEffect(() => {
        if (loaded) {
            setMeshes(generateTileset({
                surface,
                buildings,
                neighborhoods
            }));    
        }
    }, [loaded]);

    return <>
        {meshes && Object.keys(meshes).map(meshName => {
            return <primitive key={meshName}
                object={meshes[meshName]}
            />
        })
        }
    </>
}
