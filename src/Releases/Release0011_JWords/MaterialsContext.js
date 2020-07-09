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

    const [purpleTron2Ref, purpleTron2] = useResource();
    const [blackBGRef, blackBG] = useResource();
    const [orangeTron2Ref, orangeTron2] = useResource();
    const [noise1Ref, noise1] = useResource();
    const [wireframey1Ref, wireframey1] = useResource();
    const [naiveGlass1Ref, naiveGlass1] = useResource();
    const [noise2Ref, noise2] = useResource();
    const [wireframey2Ref, wireframey2] = useResource();
    const [naiveGlass2Ref, naiveGlass2] = useResource();

    const materials = {
        purpleTron2,
        blackBG,
        orangeTron2,
        noise1,
        naiveGlass1,
        wireframey1,
        noise2,
        naiveGlass2,
        wireframey2,
    }

    useEffect(() => {
        const allMats = Object.values(materials);
        const loadedMats = allMats.filter(mat => mat);
        setLoaded(allMats.length == loadedMats.length);
    })

    return <MaterialsContext.Provider value={{ loaded, ...materials }}>
        {/* background textures */}
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
        {/* head textures */}
        <NaiveGlass
            materialRef={naiveGlass1Ref}
            envMapURL={assetPath("11/textures/env-maps/old-cathedral-jamescastle-24128368@N00_49318613712.jpg")}
        />
        <meshStandardMaterial
            ref={wireframey1Ref}
            transparent={true}
            opacity={.9}
            wireframe={true}
        />
        <Noise
            materialRef={noise1Ref}
            noiseScale={.35}
            alpha={.5}
            wireframe={false}
        />
         <NaiveGlass
            materialRef={naiveGlass2Ref}
            envMapURL={assetPath("11/textures/env-maps/old-cathedral-jamescastle-24128368@N00_49318613712.jpg")}
        />
        <meshStandardMaterial
            ref={wireframey2Ref}
            transparent={true}
            opacity={.9}
            wireframe={true}
        />
        <Noise
            materialRef={noise2Ref}
            noiseScale={.35}
            alpha={.5}
            wireframe={false}
        />
        {props.children}
    </MaterialsContext.Provider>
}

export { MaterialsContext, MaterialsProvider };

