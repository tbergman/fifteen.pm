import React, { useRef } from 'react';
import * as THREE from 'three';
import { extend, useThree, useRender, Canvas } from 'react-three-fiber';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

extend({ OrbitControls });

function Controls() {
    const ref = useRef();
    const { camera } = useThree();
    useRender(() => ref.current && ref.current.update());
    return (
        <orbitControls
            ref={ref}
            args={[camera]}
            enableDamping
            dampingFactor={0.1}
            rotateSpeed={0.1}
        />
    );
}


//https://codesandbox.io/s/vigorous-poitras-0e02y
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

const glConfig = {
    gammaInput: true,
    gammaOutput: true
    //physicallyCorrectLights: true
};

export default function Release0009_Javonntte({ }) {
    return (
        <Canvas
            gl={glConfig}
        >
            <Thing vertices={[[-1, 0, 0], [0, 1, 0], [1, 0, 0], [0, -1, 0], [-1, 0, 0]]} />
            <Controls />
        </Canvas>
    );
}