import React, { useEffect, useState } from 'react';
import { useResource } from 'react-three-fiber';
import PolishedSpeckledMarbleTop from '../../Common/Materials/PolishedSpeckledMarbleTop';
import LinedCement from '../../Common/Materials/LinedCement';

const MaterialsContext = React.createContext([{}, () => { }]);

const MaterialsProvider = ({ ...props }) => {
    const [loaded, setLoaded] = useState(false);
const[wireframeRef, wireframe] = useResource()
    const [linedCementRef, linedCement] = useResource();
    const [polishedSpeckledMarbleTopRef, polishedSpeckledMarbleTop] = useResource();
    const [platformPolishedSpeckledMarbleTopRef, platformPolishedSpeckledMarbleTop] = useResource();
    const materials = {
        linedCement,
        polishedSpeckledMarbleTop,
        wireframe,
        platformPolishedSpeckledMarbleTop,
    }

    useEffect(() => {
        const allMats = Object.values(materials);
        const loadedMats = allMats.filter(mat => mat);
        setLoaded(allMats.length == loadedMats.length);
    })

    return <MaterialsContext.Provider value={{ loaded, ...materials }}>
        <PolishedSpeckledMarbleTop
            materialRef={polishedSpeckledMarbleTopRef}
            textureRepeat={{ x: 16, y: 16 }}
            skinning={true}
        />
        <PolishedSpeckledMarbleTop
            materialRef={platformPolishedSpeckledMarbleTopRef}
            textureRepeat={{ x: 8, y: 8 }}
        /> 
        <LinedCement 
            materialRef={linedCementRef}
        />
        <meshStandardMaterial
            ref={wireframeRef}
            wireframe={true}
        />
        {props.children}
    </MaterialsContext.Provider>
}

export { MaterialsContext, MaterialsProvider };

