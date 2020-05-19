

import React, { useEffect, useState } from 'react';
import { useResource } from 'react-three-fiber';
import FoamGrip from '../../Common/Materials/FoamGrip';
import Noise from '../../Common/Materials/Noise';
import { assetPath } from '../../Common/Utils/assets';
// import {SunsetGradient} from '../../Common/Materials/SunsetGradient';

const MaterialsContext = React.createContext([{}, () => { }]);

const MaterialsProvider = ({ ...props }) => {
    const [loaded, setLoaded] = useState(false);

    const [foamGripPurpleRef, foamGripPurple] = useResource();
    const [head1MatRef, head1Mat] = useResource();
    const [head2MatRef, head2Mat] = useResource();

    const materials = {
        foamGripPurple,
        head1Mat,
        head2Mat
    }

    useEffect(() => {
        const allMats = Object.values(materials);
        const loadedMats = allMats.filter(mat => mat);
        setLoaded(allMats.length == loadedMats.length);
    })

    return <MaterialsContext.Provider value={{ loaded, ...materials }}>
        <FoamGrip materialRef={foamGripPurpleRef} color={0xff00af} specular={0x00ff00} />
        <Noise materialRef={head1MatRef} timeScale={.000075} imagePath={assetPath("11/objects/headspace8/texture.png")} />
        <Noise materialRef={head2MatRef} timeScale={.0001} imagePath={assetPath("11/objects/headspace6/texture_png.png")} />
        {props.children}
    </MaterialsContext.Provider>
}

export { MaterialsContext, MaterialsProvider };

