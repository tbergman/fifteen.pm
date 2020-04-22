
import React from 'react';

export default function FixedLights() {
    return <>
        <ambientLight args={[0x111111, 5]} />
        <hemisphereLight
            skyColor={0xd4af37}
            groundColor={0xd4af37}
        />
        <pointLight args={[0xff440, 1.5]} position={[0, 0, 0]} />
    </>;
}