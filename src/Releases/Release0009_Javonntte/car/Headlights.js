import React, { useMemo } from 'react';
import { useResource } from 'react-three-fiber';

export default function Headlights({ colors }) {
    const [leftTargetRef, leftTarget] = useResource();
    const [rightTargetRef, rightTarget] = useResource();
    const [intensity, angle, penumbra] = useMemo(() => [20, 0.25, 0.25])
    return (
        <>
            <group ref={leftTargetRef} position={[-1.25, 0, -3.5]} />
            <group ref={rightTargetRef} position={[1.25, 0, -3.5]} />
            {leftTarget &&
                <spotLight
                    color={colors[0]}
                    castShadow
                    intensity={intensity}
                    angle={angle}
                    penumbra={penumbra}
                    target={leftTarget}
                />
            }
            {rightTarget &&
                <spotLight
                    castShadow
                    color={colors[1]}
                    intensity={intensity}
                    angle={angle}
                    penumbra={penumbra}
                    target={rightTarget}
                />
            }
            
        </>
    )
}