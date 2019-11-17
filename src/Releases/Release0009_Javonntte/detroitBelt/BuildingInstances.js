
import React from 'react';

export default function BuildingInstances({ themeName, meshes }) {
    console.log("MESHES!", meshes)
    return <>
        {Object.keys(meshes[themeName]).map(meshName => {
            return <primitive key={meshName} object={meshes[themeName][meshName]} />
        })}
    </>
}