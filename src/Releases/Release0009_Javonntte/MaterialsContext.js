

import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { useResource } from 'react-three-fiber';
import { BlackLeather12, CloudMaterial, Facade04Material, Facade10Material, Facade12Material, FoamGripMaterial, Metal03Material, OrnateBrass2, Rock19, ScuffedPlasticMaterial, Tiles36, Tiles60, Windows1Material, TronMaterial, Ground29Material, SunsetGradient, NightGradient, DreamGradient as DreamGradient, DayGradient, PockedStone2 } from '../../Utils/materials';

const MaterialsContext = React.createContext([{}, () => { }]);

const MaterialsProvider = ({ ...props }) => {
    const [loaded, setLoaded] = useState(false);

    const [foamGripPurpleRef, foamGripPurple] = useResource();
    const [foamGripBlackRef, foamGripBlack] = useResource();
    const [facade10Ref, facade10] = useResource();
    const [facade12Ref, facade12] = useResource();
    const [metal03Ref, metal03] = useResource();
    const [metal03BlackRef, metal03Black] = useResource();
    const [tiles36Ref, tiles36] = useResource();
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
        foamGripBlack,
        facade10,
        facade12,
        metal03,
        metal03Black,
        tiles36,
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
        <FoamGripMaterial materialRef={foamGripPurpleRef} color={0xff00af} specular={0x00ff00} />
        <FoamGripMaterial materialRef={foamGripBlackRef} color="black" />
        <Facade10Material materialRef={facade10Ref} shininess={100} color={0x00000f} textureRepeat={{ x: 1, y: 1 }} />
        <Facade12Material materialRef={facade12Ref} />
        <Metal03Material materialRef={metal03Ref} textureRepeat={{ x: 2, y: 2 }} />
        <Metal03Material materialRef={metal03BlackRef} color="black" />
        <Tiles36 materialRef={tiles36Ref} shininess={100} color="black" />
        <Rock19 materialRef={rock19Ref} displacementScale={0.05} />
        <OrnateBrass2 materialRef={ornateBrass2Ref} textureRepeat={{ x: 1, y: 1 }} color="black" />
        <ScuffedPlasticMaterial materialRef={scuffedPlasticRedRef} />
        <ScuffedPlasticMaterial materialRef={scuffedPlasticBlackRef} color={0x000000} />
        <ScuffedPlasticMaterial materialRef={scuffedPlasticGlowingRef} color="yellow" emissive="pink" />
        <TronMaterial materialRef={tronRef} side={THREE.BackSide} />
        <Ground29Material materialRef={ground29PurpleRef} color={0xf0f} />
        <Ground29Material materialRef={ground29BlackRef} color={0xfff} />
        <PockedStone2 materialRef={pockedStone2Ref} />
        <SunsetGradient materialRef={sunsetRef} side={THREE.BackSide} />
        <NightGradient materialRef={nightRef} side={THREE.BackSide} />
        <DreamGradient materialRef={dreamRef} side={THREE.BackSide} />
        <DayGradient materialRef={naturalRef} side={THREE.BackSide} />
        {props.children}
    </MaterialsContext.Provider>
}

export { MaterialsContext, MaterialsProvider };
