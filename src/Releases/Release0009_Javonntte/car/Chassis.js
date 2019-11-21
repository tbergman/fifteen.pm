import React, { useMemo, useContext } from 'react';
import { MaterialsContext } from '../MaterialsContext';

export default function Chassis({ gltf }) {
    const chassis = useMemo(() => {
        return gltf.__$.filter(elt => elt.name == "chassis")[0];
    })
    const { foamGripPurple } = useContext(MaterialsContext);
    return <>
        <mesh
            name="chassis"
            material={foamGripPurple}
        >
            <bufferGeometry attach="geometry" {...chassis.geometry} />
        </mesh>

    </>;
}