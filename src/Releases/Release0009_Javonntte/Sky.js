import React, { useContext, useMemo } from 'react';
import { MaterialsContext } from './MaterialsContext';

export default function Sky({ theme, scale }) {
    const { sunset, night, hell, day } = useContext(MaterialsContext);
    
    const materials = useMemo(() => {
        return {
            night: night,
            sunset: sunset,
            hell: hell,
            day: day,
        }
    })

    return (
        <mesh material={materials[theme]} scale={[scale, scale, scale]}>
            <sphereBufferGeometry attach="geometry" args={[1, 10, 10]} />
        </mesh>
    )
}