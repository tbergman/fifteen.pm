
// TODO the move-along-a-path code from three.js example here should be pulled and improved for re-use, it is a common thing to do
import React, { useContext, useRef, useState, useMemo } from 'react';
import { useLoader, useResource, useFrame } from 'react-three-fiber';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as C from './constants';
import { MaterialsContext } from './MaterialsContext';


function Box(props) {
    // This reference will give us direct access to the mesh
    const mesh = useRef()

    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)

    // Rotate mesh every frame, this is outside of React without overhead
    useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))

    return (
        <mesh
            {...props}
            ref={mesh}
            scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
            onClick={e => setActive(!active)}
            onPointerOver={e => setHover(true)}
            onPointerOut={e => setHover(false)}>
            <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
            <meshStandardMaterial attach="material" color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    )
}

export default function Hall({ }) {
    const gltf = useLoader(GLTFLoader, C.HALL_URL, loader => {
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco-gltf/')
        loader.setDRACOLoader(dracoLoader)
    })
    const [ref, room] = useResource()
    const { foamGripPurple } = useContext(MaterialsContext);
    const geometry = useMemo(() => {
        gltf.scene.traverse(child => {
            if (child.name == "Hall") {
                child.geometry.name = child.name;
                return child.geometry.clone();
            }
        })
    });

    useFrame(() => {
        console.log("foamGripPurple:", foamGripPurple)
    })



    

    return <group ref={ref}>
        {room && foamGripPurple &&
            <mesh material={foamGripPurple} >
                <bufferGeometry attach="geometry" {...geometry} />
            </mesh>
        }
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        {/* <Box position={[-1.2, 0, 0]} /> */}
        {/* <Box position={[1.2, 0, 0]} /> */}
    </group>

}
