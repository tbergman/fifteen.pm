import React, { useMemo } from 'react';
import { useResource } from 'react-three-fiber';
import { FoamGripMaterial } from '../../../Utils/materials';

export default function Chassis({ gltf }) {
    const chassis = useMemo(() => {
        return gltf.__$.filter(elt => elt.name == "chassis")[0];
    })
    const [foamGripRef, foamGrip] = useResource();
    return <>
        <FoamGripMaterial materialRef={foamGripRef} />
        {foamGrip &&
            <mesh
                name="chassis"
                material={foamGrip}
            >
                <bufferGeometry attach="geometry" {...chassis.geometry} />
            </mesh>
        }
    </>;
}