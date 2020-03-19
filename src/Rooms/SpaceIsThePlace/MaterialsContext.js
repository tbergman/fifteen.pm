import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { useResource } from 'react-three-fiber';
import { FoamGripMaterial, PockedStone2 } from '../../Utils/materials';

const MaterialsContext = React.createContext([{}, () => { }]);

const MaterialsProvider = ({ ...props }) => {
    const [loaded, setLoaded] = useState(false);

    const [foamGripPurpleRef, foamGripPurple] = useResource();
    const [pockedStoneRef2, pockedStone2] = useResource();

    const materials = {
        foamGripPurple,
        pockedStone2,
    }

    useEffect(() => {
        const allMats = Object.values(materials);
        const loadedMats = allMats.filter(mat => mat);
        setLoaded(allMats.length == loadedMats.length);
    })
    
    return <MaterialsContext.Provider value={{ loaded, ...materials }}>
        <FoamGripMaterial materialRef={foamGripPurpleRef} color={0x0000} specular={0x00ff00} side={THREE.DoubleSide} />
        <PockedStone2 materialRef={pockedStoneRef2} color={0x000000} side={THREE.DoubleSide} />
        {props.children}
    </MaterialsContext.Provider>
}

export { MaterialsContext, MaterialsProvider };

