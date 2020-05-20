

import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { useResource } from 'react-three-fiber';
import FoamGrip from '../../Common/Materials/FoamGrip';
import Noise from '../../Common/Materials/Noise';
import { assetPath } from '../../Common/Utils/assets';
// import {SunsetGradient} from '../../Common/Materials/SunsetGradient';
import TronMaterial2 from '../../Common/Materials/TronMaterial2';

const MaterialsContext = React.createContext([{}, () => { }]);

const MaterialsProvider = ({ ...props }) => {
    const [loaded, setLoaded] = useState(false);

    const [foamGripPurpleRef, foamGripPurple] = useResource();
    const [head1MatRef, head1Mat] = useResource();
    const [head2MatRef, head2Mat] = useResource();
    const [tron2Ref, tron2] = useResource();
    const materials = {
        foamGripPurple,
        head1Mat,
        head2Mat,
        tron2,
    }

    useEffect(() => {
        const allMats = Object.values(materials);
        const loadedMats = allMats.filter(mat => mat);
        setLoaded(allMats.length == loadedMats.length);
    })

    return <MaterialsContext.Provider value={{ loaded, ...materials }}>
        <TronMaterial2
            materialRef={tron2Ref}
            side={THREE.BackSide}
        />
        <FoamGrip
            materialRef={foamGripPurpleRef}
            color={0xff00af}
            specular={0x00ff00}
            side={THREE.BackSide}
        />
        <Noise
            materialRef={head1MatRef}
            noiseScale={.35}
            timeScale={.00009}
            alpha={.5}
            wireframe={false}
            imagePath={assetPath("11/objects/headspace8/texture.png")}
        />
        <Noise materialRef={head2MatRef} noiseScale={1.} timeScale={.000075} imagePath={assetPath("11/objects/headspace6/texture_png.png")} />
        {props.children}
    </MaterialsContext.Provider>
}

export { MaterialsContext, MaterialsProvider };

