import React from 'react';

export function FixedLights() {
    return <>
        <ambientLight/>
        <hemisphereLight
            skyColor={0xd4af37}
            groundColor={0xd4af37}
        />
    </>;
}