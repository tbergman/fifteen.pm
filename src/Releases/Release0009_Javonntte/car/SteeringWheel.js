import React, { useContext, useMemo } from 'react';
import { useFrame, useResource } from 'react-three-fiber';
import * as C from '../constants';
import { MaterialsContext } from '../MaterialsContext';

export default function SteeringWheel({ gltf, rotation }) {
    const [wheelRef, wheel] = useResource()
    const {metal03Black} = useContext(MaterialsContext);

    const wheelParts = useMemo(() => {
        return gltf.__$.filter(elt => C.STEERING_WHEEL_PARTS.includes(elt.name))
    })

    // const wheelMaterial = useMemo(() => {
    //     return {
    //         "gloves": foamGrip,
    //         "sleeves": foamGrip,
    //         "wheel": foamGrip,
    //         "wheel_internal": metal03,
    //     }
    // })

    useFrame(() => {
        if (!wheel) return;
        wheel.rotation.z = rotation.z * .1;
    })

    return <group ref={wheelRef}>
        {wheelParts.map((wheelPart, index) => {
            return <mesh
                key={index}
                name={wheelPart.name}
                material={metal03Black}
                >
                <bufferGeometry attach="geometry" {...wheelPart.geometry} />
            </mesh>
        })}
    </group>
}