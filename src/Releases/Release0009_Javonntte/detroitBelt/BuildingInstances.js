
import React, { useContext, useEffect, useState } from 'react';
import { BuildingsContext } from './BuildingsContext';
import { generateTilesets } from './tiles';

export default function BuildingInstances({ setContentReady, neighborhoods }) {
    const { buildings, loaded: buildingsLoaded } = useContext(BuildingsContext);
    const [meshes, setMeshes] = useState();

    useEffect(() => {
        if (buildingsLoaded) {
            setMeshes(generateTilesets({
                buildings,
                neighborhoods,
            }));
            setContentReady(true)
        }
    }, [buildingsLoaded, neighborhoods]);


    return <>
        {/* {
            meshes && Object.keys(meshes).map(meshName => {
                return <primitive key={meshName} object={meshes[meshName]} />
            })
        } */}
    </>
}