

import React, { useEffect, useState } from 'react';
import { useResource } from 'react-three-fiber';
import * as THREE from 'three';
import { Facade10Material } from "../../Common/Materials/Facade10Material";
import { Metal03Material } from "../../Common/Materials/Metal03Material";
import { TronMaterial } from "../../Common/Materials/TronMaterial";
import { Rock19 } from "../../Common/Materials/Rock19";
import { PockedStone2 } from "../../Common/Materials/PockedStone2";
import { OrnateBrass2 } from "../../Common/Materials/OrnateBrass2";
import { DreamGradient } from "../../Common/Materials/DreamGradient";
import { DayGradient } from "../../Common/Materials/DayGradient";
import { NightGradient } from "../../Common/Materials/NightGradient";
import { SunsetGradient } from "../../Common/Materials/SunsetGradient";
import FoamGrip from '../../Common/Materials/FoamGrip';
import ScuffedPlastic from '../../Common/Materials/ScuffedPlastic';
import Ground29 from '../../Common/Materials/Ground29';

const MaterialsContext = React.createContext([{}, () => { }]);

const MaterialsProvider = ({ ...props }) => {
    const [loaded, setLoaded] = useState(false);

    const [foamGripPurpleRef, foamGripPurple] = useResource();
    const [facade10Ref, facade10] = useResource();
    const [metal03Ref, metal03] = useResource();
    const [metal03BlackRef, metal03Black] = useResource();
    const [rock19Ref, rock19] = useResource();
    const [ornateBrass2Ref, ornateBrass2] = useResource();
    const [scuffedPlasticRedRef, scuffedPlasticRed] = useResource();
    const [scuffedPlasticBlackRef, scuffedPlasticBlack] = useResource();
    const [scuffedPlasticGlowingRef, scuffedPlasticGlowing] = useResource();
    const [tronRef, tron] = useResource();
    const [ground29PurpleRef, ground29Purple] = useResource();
    const [ground29BlackRef, ground29Black] = useResource();
    const [pockedStone2Ref, pockedStone2] = useResource();
    const [sunsetRef, sunset] = useResource();
    const [nightRef, night] = useResource();
    const [dreamRef, dream] = useResource();
    const [naturalRef, natural] = useResource();

    const materials = {
        foamGripPurple,
        facade10,
        metal03,
        metal03Black,
        rock19,
        ornateBrass2,
        scuffedPlasticRed,
        scuffedPlasticGlowing,
        scuffedPlasticBlack,
        tron,
        ground29Purple,
        ground29Black,
        pockedStone2,
        sunset,
        night,
        dream,
        natural,
    }

    useEffect(() => {
        const allMats = Object.values(materials);
        const loadedMats = allMats.filter(mat => mat);
        setLoaded(allMats.length == loadedMats.length);
    })

    return <MaterialsContext.Provider value={{ loaded, ...materials }}>
        <FoamGrip materialRef={foamGripPurpleRef} color={0xff00af} specular={0x00ff00} />
        <Facade10Material materialRef={facade10Ref} shininess={100} color={0x00000f} textureRepeat={{ x: 1, y: 1 }} />
        <Metal03Material materialRef={metal03Ref} textureRepeat={{ x: 2, y: 2 }} />
        <Metal03Material materialRef={metal03BlackRef} color="black" />
        <Rock19 materialRef={rock19Ref} displacementScale={0.05} />
        <OrnateBrass2 materialRef={ornateBrass2Ref} textureRepeat={{ x: 1, y: 1 }} color="black" />
        <ScuffedPlastic materialRef={scuffedPlasticRedRef} />
        <ScuffedPlastic materialRef={scuffedPlasticBlackRef} color={0x000000} />
        <ScuffedPlastic materialRef={scuffedPlasticGlowingRef} color="yellow" emissive="pink" />
        <TronMaterial materialRef={tronRef} side={THREE.BackSide} />
        <Ground29 materialRef={ground29PurpleRef} color={0xf0f} />
        <Ground29 materialRef={ground29BlackRef} color={0xfff} />
        <PockedStone2 materialRef={pockedStone2Ref} />
        <SunsetGradient materialRef={sunsetRef} side={THREE.BackSide} />
        <NightGradient materialRef={nightRef} side={THREE.BackSide} />
        <DreamGradient materialRef={dreamRef} side={THREE.BackSide} />
        <DayGradient materialRef={naturalRef} side={THREE.BackSide} />
        {props.children}
    </MaterialsContext.Provider>
}

export { MaterialsContext, MaterialsProvider };

