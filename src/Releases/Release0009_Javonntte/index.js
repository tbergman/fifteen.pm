import React from 'react';
import * as THREE from 'three';
import { Canvas } from 'react-three-fiber';

function Thing({ vertices }) {

    return (
        <group ref={ref => console.log('we have access to the instance')}>
            <line>
                <geometry
                    attach="geometry"
                    vertices={vertices.map(v => new THREE.Vector3(...v))}
                    onUpdate={self => (self.verticesNeedUpdate = true)}
                />
                <lineBasicMaterial attach="material" color="black" />
            </line>
            <mesh
                onClick={e => console.log('click')}
                onPointerOver={e => console.log('hover')}
                onPointerOut={e => console.log('unhover')}>
                <circleGeometry attach="geometry" />
                <meshBasicMaterial attach="material" color="white" opacity={0.5} transparent />
            </mesh>
        </group>
    )
}

export default function Release0009_Javonntte({ }) {
    return (
        <Canvas>
            <Thing vertices={[[-1, 0, 0], [0, 1, 0], [1, 0, 0], [0, -1, 0], [-1, 0, 0]]} />
        </Canvas>
    );
}