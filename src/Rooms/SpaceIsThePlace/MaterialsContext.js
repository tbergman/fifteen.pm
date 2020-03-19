import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { useResource } from 'react-three-fiber';
import { FoamGripMaterial } from '../../Utils/materials';

const MaterialsContext = React.createContext([{}, () => { }]);

const MaterialsProvider = ({ ...props }) => {
    const [loaded, setLoaded] = useState(false);

    const [foamGripPurpleRef, foamGripPurple] = useResource();

    const materials = {
        foamGripPurple,
    }

    useEffect(() => {
        const allMats = Object.values(materials);
        const loadedMats = allMats.filter(mat => mat);
        setLoaded(allMats.length == loadedMats.length);
    })
    
    return <MaterialsContext.Provider value={{ loaded, ...materials }}>
        <FoamGripMaterial materialRef={foamGripPurpleRef} color={0xff00af} specular={0x00ff00} side={THREE.DoubleSide} />
        {props.children}
    </MaterialsContext.Provider>
}

export { MaterialsContext, MaterialsProvider };

