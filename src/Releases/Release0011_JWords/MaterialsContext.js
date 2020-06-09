import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { useResource } from 'react-three-fiber';
import Noise from '../../Common/Materials/Noise';
import { assetPath } from '../../Common/Utils/assets';
import TronMaterial2 from '../../Common/Materials/TronMaterial2';
import NaiveGlass from '../../Common/Materials/NaiveGlass';

const MaterialsContext = React.createContext([{}, () => { }]);

const MaterialsProvider = ({ ...props }) => {
    const [loaded, setLoaded] = useState(false);

    const [noise1Ref, noise1] = useResource();
    const [wireframeyRef, wireframey] = useResource();
    const [purpleTron2Ref, purpleTron2] = useResource();
    const [blackBGRef, blackBG] = useResource();
    const [orangeTron2Ref, orangeTron2] = useResource();
    const [naiveGlassRef, naiveGlass] = useResource();

    const materials = {
        purpleTron2,
        blackBG,
        orangeTron2,
        noise1,
        naiveGlass,
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
            side={THREE.BackSide}
            colorOffset={new THREE.Vector3(0.5, -0.2, 0.5)}
        />
        <meshBasicMaterial
            ref={blackBGRef}
            side={THREE.BackSide}
            color={new THREE.Color("black")}
        />
        <TronMaterial2
            materialRef={orangeTron2Ref}
            side={THREE.BackSide}
            colorOffset={new THREE.Vector3(.1, 0., 0.1)}
        />
        <NaiveGlass
            materialRef={naiveGlassRef}
            envMapURL={assetPath("11/textures/env-maps/old-cathedral-jamescastle-24128368@N00_49318613712.jpg")}
        />
        <meshStandardMaterial
            ref={wireframeyRef}
            wireframe={false}
        />
        <Noise
            materialRef={noise1Ref}
            noiseScale={.35}
            alpha={.5}
            wireframe={false}
        />
        {props.children}
    </MaterialsContext.Provider>
}

export { MaterialsContext, MaterialsProvider };

