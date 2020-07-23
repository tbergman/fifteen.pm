import React, { useEffect, useState } from 'react';
import { useResource } from 'react-three-fiber';
import * as THREE from 'three';
import DiscoBall01 from '../../Common/Materials/DiscoBall01';
import FoamGrip from '../../Common/Materials/FoamGrip';
import NaiveGlass from '../../Common/Materials/NaiveGlass';
import PolishedSpeckledMarbleTop from '../../Common/Materials/PolishedSpeckledMarbleTop';
import ScuffedPlastic from '../../Common/Materials/ScuffedPlastic';

const MaterialsContext = React.createContext([{}, () => { }]);

const MaterialsProvider = ({ ...props }) => {
    const [loaded, setLoaded] = useState(false);
    const [wireframeRef, wireframe] = useResource()
    const [polishedSpeckledMarbleTopRef, polishedSpeckledMarbleTop] = useResource();
    const [platformPolishedSpeckledMarbleTopRef, platformPolishedSpeckledMarbleTop] = useResource();
    const [foamGripRef, foamGrip] = useResource();
    const [scuffedPlasticRedRef, scuffedPlasticRed] = useResource();
    const [naiveGlassRef, naiveGlass] = useResource();
    const [discoBall01Ref, discoBall01] = useResource();
    
    const materials = {
        polishedSpeckledMarbleTop,
        wireframe,
        platformPolishedSpeckledMarbleTop,
        foamGrip,
        scuffedPlasticRed,
        naiveGlass,
        discoBall01,
    }

    useEffect(() => {
        const allMats = Object.values(materials);
        const loadedMats = allMats.filter(mat => mat);
        setLoaded(allMats.length == loadedMats.length);
    })

    return <MaterialsContext.Provider value={{ loaded, ...materials }}>
        <PolishedSpeckledMarbleTop
            materialRef={polishedSpeckledMarbleTopRef}
            textureRepeat={{ x: 16, y: 16 }}
            skinning={true}
        />
        <PolishedSpeckledMarbleTop
            materialRef={platformPolishedSpeckledMarbleTopRef}
            textureRepeat={{ x: 8, y: 8 }}
            side={THREE.BackSide}
        />
        <FoamGrip
            materialRef={foamGripRef}
            color={0xff00af}
            specular={0x00ff00}
        />
        <ScuffedPlastic
            materialRef={scuffedPlasticRedRef}
            color={0xf00}
            emissive={"pink"}
            skinning={true}
        />
        <meshStandardMaterial
            ref={wireframeRef}
            wireframe={true}
        />
        <NaiveGlass
            materialRef={naiveGlassRef}
            skinning={true}
        />
        <DiscoBall01
            materialRef={discoBall01Ref}
            skinning={true}
        />
        {props.children}
    </MaterialsContext.Provider>
}

export { MaterialsContext, MaterialsProvider };

