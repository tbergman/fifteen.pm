

import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { useResource } from 'react-three-fiber';
import { BlackLeather12, CloudMaterial, Facade04Material, Facade10Material, Facade12Material, FoamGripMaterial, Metal03Material, OrnateBrass2, Rock19, ScuffedPlasticMaterial, Tiles36, Tiles60, Windows1Material, TronMaterial, Ground29Material } from '../../Utils/materials';

const MaterialsContext = React.createContext([{}, () => { }]);

const MaterialsProvider = ({ ...props }) => {
    const [loaded, setLoaded] = useState(false);
    const [foamGripSilverRef, foamGripSilver] = useResource();


    const materials = {
        foamGripSilver,
    }

    useEffect(() => {
        const allMats = Object.values(materials);
        const loadedMats = allMats.filter(mat => mat);
        setLoaded(allMats.length == loadedMats.length);
    })

    return <MaterialsContext.Provider value={{loaded, ...materials }}>
        <FoamGripMaterial materialRef={foamGripSilverRef} color={0x0000af} />
        {props.children}
    </MaterialsContext.Provider>
}

export { MaterialsContext, MaterialsProvider };
