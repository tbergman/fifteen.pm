// buildings={{
//     geometries: buildingGeometries,
//     materials: [metal03Material, foamGripMaterial, facade10Material],
//     loaded: !loadingBuildings,
// }}

import React, { useState, useMemo } from 'react';
import { CloudMaterial, Facade04Material, Facade10Material, Facade12Material, FoamGripMaterial, Metal03Material, Windows1Material } from '../../Utils/materials';
import * as C from './constants';

const BuildingsContext = React.creatContext([{}, () => { }]);

const BuildingsProvider = ({ ...props }) => {
    const gltf = useLoader(GLTFLoader, C.BUILDINGS_URL, loader => {
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco-gltf/')
        loader.setDRACOLoader(dracoLoader)
    })

    const building = {
        material: undefined,
        name: undefined,
        geometry: undefined,
    }


    const [cloudMaterialRef, cloudMaterial] = useResource();
    const [foamGripMaterialRef, foamGripMaterial] = useResource();
    const [windows1MaterialRef, windows1Material] = useResource();
    const [facade04MaterialRef, facade04Material] = useResource();
    const [facade10MaterialRef, facade10Material] = useResource();
    const [facade12MaterialRef, facade12Material] = useResource();
    const [metal03MaterialRef, metal03Material] = useResource();

    const [state, setState] = useState({

    })

    return <BuildingsContext.Provider value={[state, setState]}>
        <FoamGripMaterial materialRef={foamGripMaterialRef} color={0x0000af} />
        <CloudMaterial materialRef={cloudMaterialRef} emissive={0xd4af37} />
        <Windows1Material materialRef={windows1MaterialRef} />
        <Facade10Material materialRef={facade10MaterialRef} />
        <Facade04Material materialRef={facade04MaterialRef} />
        <Facade12Material materialRef={facade12MaterialRef} />
        <Metal03Material materialRef={metal03MaterialRef} />
        {props.children}
    </BuildingsContext.Provider>
}

export { BuildingsContext, BuildingsProvider }