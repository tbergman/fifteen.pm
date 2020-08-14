import React, { useEffect, useState } from 'react';
import { useResource, useFrame } from 'react-three-fiber';
import * as THREE from 'three';
import DiscoBall01 from '../../Common/Materials/DiscoBall01';
import FoamGrip from '../../Common/Materials/FoamGrip';
import NaiveGlass from '../../Common/Materials/NaiveGlass';
import PolishedSpeckledMarbleTop from '../../Common/Materials/PolishedSpeckledMarbleTop';
import ScuffedPlastic from '../../Common/Materials/ScuffedPlastic';
import { TronMaterial } from '../../Common/Materials/TronMaterial';
import { Sunflare } from '../../Common/Materials/Sunflare';
import Ground29 from '../../Common/Materials/Ground29';
import clothingEnv from '../../Common/assets/textures/env-maps/color-spectrum.jpg'

const MaterialsContext = React.createContext([{}, () => { }]);

const MaterialsProvider = ({ ...props }) => {
    const [loaded, setLoaded] = useState(false);
    const [wireframeRef, wireframe] = useResource()
    const [polishedSpeckledMarbleTopRef, polishedSpeckledMarbleTop] = useResource();
    const [platformPolishedSpeckledMarbleTopRef, platformPolishedSpeckledMarbleTop] = useResource();
    const [foamGripRef, foamGrip] = useResource();
    const [scuffedPlasticRedRef, scuffedPlasticRed] = useResource();
    const [naiveGlassRef, naiveGlass] = useResource();
    const [naiveGlass2Ref, naiveGlass2] = useResource();
    const [discoBall01Ref, discoBall01] = useResource();
    const [tronRef, tron] = useResource();
    const [sunflareRef, sunflare] = useResource();
const [ground29Ref, ground29] = useResource();
    const materials = {
        polishedSpeckledMarbleTop,
        wireframe,
        platformPolishedSpeckledMarbleTop,
        foamGrip,
        scuffedPlasticRed,
        naiveGlass,
        naiveGlass2,
        discoBall01,
        tron,
        sunflare,
        ground29,
    }

    useEffect(() => {
        const allMats = Object.values(materials);
        const loadedMats = allMats.filter(mat => mat);
        setLoaded(allMats.length == loadedMats.length);
    })

    // useEffect(() => {
    //     if (!naiveGlass2) return;
    //     naiveGlass2.envMap.center.x = 1.;
    //     naiveGlass.envMap.flipY = true;
    // }, [naiveGlass2])

    return <MaterialsContext.Provider value={{ loaded, ...materials }}>
        <PolishedSpeckledMarbleTop
            materialRef={polishedSpeckledMarbleTopRef}
            textureRepeat={{ x: 16, y: 16 }}
            skinning={true}
            // useEnvMap={false}
        />
        <PolishedSpeckledMarbleTop
            materialRef={platformPolishedSpeckledMarbleTopRef}
            textureRepeat={{ x: 8, y: 8 }}
            side={THREE.BackSide}
            useEnvMap={false}
        />
        <Sunflare
            materialRef={sunflareRef}
            transparent={true}
            textureRepeat={{ x: 8, y: 8 }}
            side={THREE.DoubleSide}
        />
        <Ground29
            materialRef={ground29Ref}
            />
        <FoamGrip
            materialRef={foamGripRef}
            color={0xff00af}
            specular={0x00ff00}
            side={THREE.DoubleSide}
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
            envMapURL={clothingEnv}
        />
        <NaiveGlass
            materialRef={naiveGlass2Ref}
            skinning={true}
        />
        <DiscoBall01
            materialRef={discoBall01Ref}
            skinning={true}
        />
        <TronMaterial
            materialRef={tronRef}
        />
        {props.children}
    </MaterialsContext.Provider>
}

export { MaterialsContext, MaterialsProvider };

