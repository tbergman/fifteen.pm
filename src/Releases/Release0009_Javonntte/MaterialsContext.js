

import React, { useEffect, useState } from 'react';
import { useResource } from 'react-three-fiber';
import { BlackLeather12, CloudMaterial, Facade04Material, Facade10Material, Facade12Material, FoamGripMaterial, Metal03Material, OrnateBrass2, Rock19, ScuffedPlasticMaterial, Tiles36, Tiles60, Windows1Material } from '../../Utils/materials';

const MaterialsContext = React.createContext([{}, () => { }]);

const MaterialsProvider = ({ ...props }) => {
    const [loaded, setLoaded] = useState(false);

    const [cloudRef, cloud] = useResource();
    const [foamGripSilverRef, foamGripSilver] = useResource();
    const [foamGripPurpleRef, foamGripPurple] = useResource();
    const [windows1Ref, windows1] = useResource();
    const [facade04Ref, facade04] = useResource();
    const [facade10Ref, facade10] = useResource();
    const [facade12Ref, facade12] = useResource();
    const [metal03Ref, metal03] = useResource();
    const [tiles60Ref, tiles60] = useResource();
    const [tiles36Ref, tiles36] = useResource();
    const [rock19Ref, rock19] = useResource();
    const [ornateBrass2Ref, ornateBrass2] = useResource();
    const [scuffedPlasticRef, scuffedPlastic] = useResource();
    const [blackLeather12Ref, blackLeather12] = useResource();

    const materials = {
        cloud,
        foamGripSilver,
        foamGripPurple,
        windows1,
        facade04,
        facade10,
        facade12,
        metal03,
        tiles60,
        tiles36,
        rock19,
        ornateBrass2,
        scuffedPlastic,
        blackLeather12,
    }

    useEffect(() => {
        const allMats = Object.values(materials);
        const loadedMats = allMats.filter(mat => mat);
        setLoaded(allMats.length == loadedMats.length);
    })

    return <MaterialsContext.Provider value={{loaded, ...materials }}>
        <FoamGripMaterial materialRef={foamGripPurpleRef} color={0xff00af} specular={0x00ff00} />
        <FoamGripMaterial materialRef={foamGripSilverRef} color={0x0000af} />
        <CloudMaterial materialRef={cloudRef} emissive={0xd4af37} />
        <Windows1Material materialRef={windows1Ref} />
        <Facade10Material materialRef={facade10Ref} shininess={100} textureRepeat={{ x: 1, y: 1 }} />
        <Facade04Material materialRef={facade04Ref} textureRepeat={{ x: 1, y: 1 }} color={0xc0c0c0} />
        <Facade12Material materialRef={facade12Ref} />
        <Metal03Material materialRef={metal03Ref} textureRepeat={{ x: 2, y: 2 }} />
        <Tiles60 materialRef={tiles60Ref} />
        <Tiles36 materialRef={tiles36Ref} shininess={100} />
        <Rock19 materialRef={rock19Ref} displacementScale={0.05} />
        <OrnateBrass2 materialRef={ornateBrass2Ref} />
        <ScuffedPlasticMaterial materialRef={scuffedPlasticRef} color={0x000000} />
        <BlackLeather12 materialRef={blackLeather12Ref} />
        {props.children}
    </MaterialsContext.Provider>
}

export { MaterialsContext, MaterialsProvider };
