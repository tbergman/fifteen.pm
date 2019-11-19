import React, { useMemo } from 'react';
import { useResource } from 'react-three-fiber';

export default function Headlights({ color }) {
    const [leftTargetRef, leftTarget] = useResource();
    const [rightTargetRef, rightTarget] = useResource();
    const [intensity, angle, penumbra] = useMemo(() => [5, 0.25, 0.25])
    return (
        <>
            <group ref={leftTargetRef} position={[-1.25, -.5, -3.5]} />
            <group ref={rightTargetRef} position={[1.25, -.5, -3.5]} />
            {leftTarget &&
                <spotLight
                    color={color}
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
                    color={color}
                    intensity={intensity}
                    angle={angle}
                    penumbra={penumbra}
                    target={rightTarget}
                />
            }
        </>
    )
}