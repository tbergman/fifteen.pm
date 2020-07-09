import React, { useEffect, useState } from 'react';
import { useResource } from 'react-three-fiber';
import PolishedSpeckledMarbleTop from '../../Common/Materials/PolishedSpeckledMarbleTop';


const MaterialsContext = React.createContext([{}, () => { }]);

const MaterialsProvider = ({ ...props }) => {
    const [loaded, setLoaded] = useState(false);

    const [polishedSpeckledMarbleTopRef, polishedSpeckledMarbleTop] = useResource();

    const materials = {
        polishedSpeckledMarbleTop,
    }

    useEffect(() => {
        const allMats = Object.values(materials);
        const loadedMats = allMats.filter(mat => mat);
        setLoaded(allMats.length == loadedMats.length);
    })

    return <MaterialsContext.Provider value={{ loaded, ...materials }}>
        <PolishedSpeckledMarbleTop
            materialRef={polishedSpeckledMarbleTopRef}
            skinning={true}
        />
        {props.children}
    </MaterialsContext.Provider>
}

export { MaterialsContext, MaterialsProvider };

