

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
    const [noise1Ref, noise1] = useResource();
    const [purpleTron2Ref, purpleTron2] = useResource();
    const [darkTron2Ref, darkTron2] = useResource();
    const [bwTron2Ref, bwTron2] = useResource();
    const [wireframeyRef, wireframey] = useResource();
    const materials = {
        purpleTron2,
        darkTron2,
        bwTron2,
        noise1,
        foamGripPurple,
        wireframey,
    }

    useEffect(() => {
        const allMats = Object.values(materials);
        const loadedMats = allMats.filter(mat => mat);
        setLoaded(allMats.length == loadedMats.length);
    })

    return <MaterialsContext.Provider value={{ loaded, ...materials }}>
        <TronMaterial2
            materialRef={purpleTron2Ref}
            colorOffset={new THREE.Vector3(0, .9, 0.6)}
            side={THREE.BackSide}
        />
        <TronMaterial2
            materialRef={darkTron2Ref}
            side={THREE.BackSide}
            colorOffset={new THREE.Vector3(0, 1., 0.)}
        />
        <TronMaterial2
            materialRef={bwTron2Ref}
            side={THREE.BackSide}
            colorOffset={new THREE.Vector3(.9, 0., 0.6)}
        />
        <FoamGrip
            materialRef={foamGripPurpleRef}
            color={0xff00af}
            specular={0x00ff00}
            side={THREE.BackSide}
        />
        <meshStandardMaterial materialRef={wireframeyRef} wireframe={true} />
        <Noise
            materialRef={noise1Ref}
            noiseScale={.35}
            alpha={.5}
            wireframe={false}
            // imagePath={assetPath("11/objects/headspace8/texture.png")}
        />
        {props.children}
    </MaterialsContext.Provider>
}

export { MaterialsContext, MaterialsProvider };

