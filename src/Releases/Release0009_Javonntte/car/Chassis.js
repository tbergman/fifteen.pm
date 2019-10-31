import React, { useMemo } from 'react';
import { useResource } from 'react-three-fiber';
import { Metal03Material, EmissiveScuffedPlasticMaterial } from '../../../Utils/materials';

export default function Chassis({ gltf }) {
    const chassis = useMemo(() => {
        return gltf.__$.filter(elt => elt.name == "chassis")[0];
    })
    const [scuffedPlasticMaterialRef, scuffedPlasticMaterial] = useResource();
    return <>
        <EmissiveScuffedPlasticMaterial materialRef={scuffedPlasticMaterialRef} color="black" />
        {scuffedPlasticMaterial &&
            <mesh
                name="chassis"
                material={scuffedPlasticMaterial}
            >
                <bufferGeometry attach="geometry" {...chassis.geometry} />
            </mesh>
        }
    </>;
}