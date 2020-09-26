import React, { useEffect, useState } from 'react';
import { useResource } from 'react-three-fiber';
import * as THREE from 'three';
import clothingEnv from '../../Common/assets/textures/env-maps/color-spectrum.png';
import NaiveGlass from '../../Common/Materials/NaiveGlass';
import PolishedSpeckledMarbleTop from '../../Common/Materials/PolishedSpeckledMarbleTop';
import FoamGrip from '../../Common/Materials/FoamGrip';
import { Sunflare } from '../../Common/Materials/Sunflare';

const MaterialsContext = React.createContext([{}, () => { }]);

const MaterialsProvider = ({ ...props }) => {
    const [loaded, setLoaded] = useState(false);
    const [polishedSpeckledMarbleTopRef, polishedSpeckledMarbleTop] = useResource();
    const [platformPolishedSpeckledMarbleTopRef, platformPolishedSpeckledMarbleTop] = useResource();
    const [naiveGlassRef, naiveGlass] = useResource();
    // const [naiveGlass2Ref, naiveGlass2] = useResource();
    const [sunflareRef, sunflare] = useResource();
    const [foamGripRef, foamGrip] = useResource();

    const materials = {
        polishedSpeckledMarbleTop,
        platformPolishedSpeckledMarbleTop,
        naiveGlass,
        // naiveGlass2,
        sunflare,
        foamGrip,
    }

    useEffect(() => {
        const allMats = Object.values(materials);
        const loadedMats = allMats.filter(mat => mat);
        setLoaded(allMats.length == loadedMats.length);
    })

    return <MaterialsContext.Provider value={{ loaded, ...materials }}>
        <FoamGrip
            materialRef={foamGripRef}
            useAOGreen={true}
            useDarkEnv={true}
        />
        <PolishedSpeckledMarbleTop
            materialRef={polishedSpeckledMarbleTopRef}
            textureRepeat={{ x: 16, y: 16 }}
            skinning={true}
        // useMetallicLight={true}
        // useAlbedoGreen={true}
        />
        <PolishedSpeckledMarbleTop
            materialRef={platformPolishedSpeckledMarbleTopRef}
            textureRepeat={{ x: 8, y: 8 }}
            side={THREE.BackSide}
            // useMetallicLight={true}
            // useAlbedoGreen={true}
            useEnvMap={false}
        />
        <Sunflare
            materialRef={sunflareRef}
            transparent={true}
            textureRepeat={{ x: 8, y: 8 }}
            side={THREE.DoubleSide}
        />
        <NaiveGlass
            materialRef={naiveGlassRef}
            skinning={true}
            envMapURL={clothingEnv}
        />
        {/* <NaiveGlass
            materialRef={naiveGlass2Ref}
            skinning={true}
        /> */}
        {props.children}
    </MaterialsContext.Provider>
}

export { MaterialsContext, MaterialsProvider };

