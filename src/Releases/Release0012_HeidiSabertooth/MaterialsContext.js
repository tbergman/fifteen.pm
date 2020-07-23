import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { useResource } from 'react-three-fiber';
import PolishedSpeckledMarbleTop from '../../Common/Materials/PolishedSpeckledMarbleTop';
import LinedCement from '../../Common/Materials/LinedCement';
import FoamGrip from '../../Common/Materials/FoamGrip';
import ScuffedPlastic from '../../Common/Materials/ScuffedPlastic';
import NaiveGlass from '../../Common/Materials/NaiveGlass';
import DiscoBall01 from '../../Common/Materials/DiscoBall01';
import { PockedStone2 } from "../../Common/Materials/PockedStone2";
import { assetPath } from "../../Common/Utils/assets"

const MaterialsContext = React.createContext([{}, () => { }]);

const MaterialsProvider = ({ ...props }) => {
    const [loaded, setLoaded] = useState(false);
    const [wireframeRef, wireframe] = useResource()
    const [linedCementRef, linedCement] = useResource();
    const [polishedSpeckledMarbleTopRef, polishedSpeckledMarbleTop] = useResource();
    const [platformPolishedSpeckledMarbleTopRef, platformPolishedSpeckledMarbleTop] = useResource();
    const [foamGripRef, foamGrip] = useResource();
    const [scuffedPlasticRedRef, scuffedPlasticRed] = useResource();
    const [naiveGlassRef, naiveGlass] = useResource();
    const [discoBall01Ref, discoBall01] = useResource();
    const [pockedStone2Ref, pockedStone2] = useResource();
    const materials = {
        linedCement,
        polishedSpeckledMarbleTop,
        wireframe,
        platformPolishedSpeckledMarbleTop,
        foamGrip,
        scuffedPlasticRed,
        naiveGlass,
        discoBall01,
        pockedStone2,
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
        <PockedStone2 materialRef={pockedStone2Ref} />
        <LinedCement
            materialRef={linedCementRef}
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

