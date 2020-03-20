import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { useResource } from 'react-three-fiber';
import { FoamGripMaterial, LinedCement, NaiveGlass, Transluscent } from '../../Utils/materials';

const MaterialsContext = React.createContext([{}, () => { }]);

const MaterialsProvider = ({ ...props }) => {
    const [loaded, setLoaded] = useState(false);

    const [foamGripPurpleRef, foamGripPurple] = useResource();
    const [linedCementRef, linedCement] = useResource();
    const [transulscentRef, transluscent] = useResource();
    const [naiveGlassRef, naiveGlass] = useResource();

    const materials = {
        foamGripPurple,
        linedCement,
        transluscent,
        naiveGlass,
    }

    useEffect(() => {
        const allMats = Object.values(materials);
        const loadedMats = allMats.filter(mat => mat);
        setLoaded(allMats.length == loadedMats.length);
    })

    return <MaterialsContext.Provider value={{ loaded, ...materials }}>
        <FoamGripMaterial materialRef={foamGripPurpleRef} color={0x0000} specular={0x00ff00} side={THREE.DoubleSide} />
        <LinedCement materialRef={linedCementRef} side={THREE.DoubleSide} textureRepeat={{ x: 8, y: 8 }} />
        <Transluscent materialRef={transulscentRef} side={THREE.DoubleSide} />
        <NaiveGlass materialRef={naiveGlassRef} side={THREE.DoubleSide} opacity={.4} shininess={100} color={"yellow"}/>
        {props.children}
    </MaterialsContext.Provider>
}

export { MaterialsContext, MaterialsProvider };

