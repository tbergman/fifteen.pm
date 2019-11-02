import React, { useMemo, useContext } from 'react';
import { MaterialsContext } from '../MaterialsContext';

export default function Chassis({ gltf }) {
    const chassis = useMemo(() => {
        return gltf.__$.filter(elt => elt.name == "chassis")[0];
    })
    const { foamGripBlack } = useContext(MaterialsContext);
    return <>
        <mesh
            name="chassis"
            material={foamGripBlack}
        >
            <bufferGeometry attach="geometry" {...chassis.geometry} />
        </mesh>

    </>;
}