import React from 'react';
import { useResource } from 'react-three-fiber';
import * as THREE from 'three';
import { EmissiveMaterial, Metal03Material, TronMaterial } from '../../../Utils/materials';
import * as C from '../constants';

export default function Dash({ dashGeoms, onLightsButtonClicked, ...props }) {
    const [dashRef, dash] = useResource();
    const [buttonRef, button] = useResource();
    const [metal03MaterialRef, metal03Material] = useResource();
    const [emissiveMaterialRef, emissiveMaterial] = useResource();
    const [tronMaterialRef, tronMaterial] = useResource();
    const dashPos = new THREE.Vector3(8, 12.5, -1);//.add(position);

    // TODO button animation https://github.com/react-spring/react-three-fiber/blob/799d21878a472f7f2bfb2c7051c5f84a56bc491f/examples/components/GltfAnimation.js
    return <>
        <Metal03Material
            materialRef={metal03MaterialRef}
            textureRepeat={{ x: 1, y: 1 }}
            roughness={0}
        />
        <EmissiveMaterial
            materialRef={emissiveMaterialRef}
        />
        <TronMaterial
            materialRef={tronMaterialRef}
            bpm={120} // TODO
        />
        {metal03Material && emissiveMaterial && tronMaterial &&
            <group
                ref={dashRef}
                position={dashPos}
            >
                {dashGeoms.map(geom => {
                    if (C.DASH_BUTTONS.includes(geom.name)) {
                        return <mesh
                            onPointerOver={self => onLightsButtonClicked()}
                            key={geom.name}>
                            <primitive attach="geometry" object={geom} />
                        </mesh>
                    }
                    else if (geom.name == C.LIGHTS_BUTTON_TEXT) {
                        return <mesh
                            key={geom.name}
                            geometry={geom}
                            material={emissiveMaterial}
                        />
                    }
                    else if (geom.name == C.SPEEDOMETER) {
                        return <mesh
                            key={geom.name}
                            geometry={geom}
                            material={tronMaterial}
                        />
                    }
                    else {
                        return <mesh
                            key={geom.name}
                            geometry={geom}
                            material={metal03Material}
                        />
                    }
                })}
            </group>

        }
        {props.children}
        {/* React.Children.toArray(props.children).map(element => {
            return React.cloneElement(element, { road: road.current })
        })} */}
    </>
}