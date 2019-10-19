
import React from 'react';
import { useFrame, useResource, useThree } from 'react-three-fiber';
import { BlackLeather12 } from '../../../Utils/materials';


export default function SteeringWheel({ curCamera, steeringWheelGeoms }) {
    const { camera } = useThree();
    const [steeringWheelRef, steeringWheel] = useResource();
    const [blackLeather12MaterialRef, blackLeather12Material] = useResource();
    useFrame((state, time) => {
        if (!steeringWheel) return;
        steeringWheel.rotation.y = camera.rotation.y * .2;
        // cadillacRef.current.rotation.x = cameraRef.current.rotation.x * .01;
        // cadillacRef.current.rotation.y = cameraRef.current.rotation.y * .01;
    })
    return <group ref={steeringWheelRef}>
        <BlackLeather12
            materialRef={blackLeather12MaterialRef}
            textureRepeat={{ x: 4, y: 1 }}
        />
        {blackLeather12Material && steeringWheelGeoms.map(geometry => {
            // if (geometry.name == "Gloves") {
            return <mesh
                key={geometry.name}
                ref={steeringWheelRef}
                geometry={geometry}
                material={blackLeather12Material}
            />
            // } else {
            //     return <mesh
            //         key={geometry.name}
            //         ref={steeringWheelRef}
            //         geometry={geometry}
            //     />
            // }
        })}
    </group>
}
