

import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { useResource } from 'react-three-fiber';
import { BlackLeather12, CloudMaterial, Facade04Material, Facade10Material, Facade12Material, FoamGripMaterial, Metal03Material, OrnateBrass2, Rock19, ScuffedPlasticMaterial, Tiles36, Tiles60, Windows1Material, TronMaterial, Ground29Material, SunsetGradient, NightGradient, DreamGradient as DreamGradient, DayGradient, PockedStone2 } from '../../Utils/materials';

const MaterialsContext = React.createContext([{}, () => { }]);

const MaterialsProvider = ({ ...props }) => {
    const [loaded, setLoaded] = useState(false);

    const [cloudRef, cloud] = useResource();
    const [foamGripSilverRef, foamGripSilver] = useResource();
    const [foamGripPurpleRef, foamGripPurple] = useResource();
    const [foamGripBlackRef, foamGripBlack] = useResource();
    const [windows1Ref, windows1] = useResource();
    const [facade04Ref, facade04] = useResource();
    const [facade10Ref, facade10] = useResource();
    const [facade12Ref, facade12] = useResource();
    const [metal03Ref, metal03] = useResource();
    const [metal03BlackRef, metal03Black] = useResource();
    const [tiles60Ref, tiles60] = useResource();
    const [tiles36Ref, tiles36] = useResource();
    const [rock19Ref, rock19] = useResource();
    const [ornateBrass2Ref, ornateBrass2] = useResource();
    const [ornateBrass2Tiledx10Ref, ornateBrass2Tiledx10] = useResource();
    const [scuffedPlasticRedRef, scuffedPlasticRed] = useResource();
    const [scuffedPlasticBlackRef, scuffedPlasticBlack] = useResource();
    const [scuffedPlasticGlowingRef, scuffedPlasticGlowing] = useResource();
    const [blackLeather12Ref, blackLeather12] = useResource();
    const [tronRef, tron] = useResource();
    const [ground29PurpleRef, ground29Purple] = useResource();
    const [ground29BlackRef, ground29Black] = useResource();
    const [pockedStone2Ref, pockedStone2] = useResource();
    const [sunsetRef, sunset] = useResource();
    const [nightRef, night] = useResource();
    const [dreamRef, dream] = useResource();
    const [naturalRef, natural] = useResource();

    const materials = {
        cloud,
        foamGripSilver,
        foamGripPurple,
        foamGripBlack,
        windows1,
        facade04,
        facade10,
        facade12,
        metal03,
        metal03Black,
        tiles60,
        tiles36,
        rock19,
        ornateBrass2,
        ornateBrass2Tiledx10,
        scuffedPlasticRed,
        scuffedPlasticGlowing,
        scuffedPlasticBlack,
        blackLeather12,
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
        <FoamGripMaterial materialRef={foamGripSilverRef} specular={0x000} refractionRatio={0.0} color={0x000} />
        <FoamGripMaterial materialRef={foamGripBlackRef} color="black" />
        <CloudMaterial materialRef={cloudRef} emissive={0xd4af37} />
        <Windows1Material materialRef={windows1Ref} />
        <Facade10Material materialRef={facade10Ref} shininess={100} textureRepeat={{ x: 1, y: 1 }} />
        <Facade04Material materialRef={facade04Ref} textureRepeat={{ x: 1, y: 1 }} color={0xc0c0c0} />
        <Facade12Material materialRef={facade12Ref} />
        <Metal03Material materialRef={metal03Ref} textureRepeat={{ x: 2, y: 2 }} />
        <Metal03Material materialRef={metal03BlackRef} color="black" />
        <Tiles60 materialRef={tiles60Ref} />
        <Tiles36 materialRef={tiles36Ref} shininess={100} color="black" />
        <Rock19 materialRef={rock19Ref} displacementScale={0.05} />
        <OrnateBrass2 materialRef={ornateBrass2Ref} textureRepeat={{x: 2, y: 2}} color="black" />
        <OrnateBrass2 materialRef={ornateBrass2Tiledx10Ref} textureRepeat={{x: 10, y: 10}} color="black" />
        <ScuffedPlasticMaterial materialRef={scuffedPlasticRedRef} />
        <ScuffedPlasticMaterial materialRef={scuffedPlasticBlackRef} color={0x000000} />
        <ScuffedPlasticMaterial materialRef={scuffedPlasticGlowingRef} color="yellow" emissive="pink" />
        <BlackLeather12 materialRef={blackLeather12Ref} />
        <TronMaterial materialRef={tronRef} side={THREE.BackSide} />
        <Ground29Material materialRef={ground29PurpleRef} color={0xf0f} />
        <Ground29Material materialRef={ground29BlackRef} color={0x000} />
        <PockedStone2 materialRef={pockedStone2Ref} />
        <SunsetGradient materialRef={sunsetRef} side={THREE.BackSide} />
        <NightGradient materialRef={nightRef} side={THREE.BackSide} />
        <DreamGradient materialRef={dreamRef} side={THREE.BackSide} />
        <DayGradient materialRef={naturalRef} side={THREE.BackSide} />
        {props.children}
    </MaterialsContext.Provider>
}

export { MaterialsContext, MaterialsProvider };
