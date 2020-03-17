
// TODO the move-along-a-path code from three.js example here should be pulled and improved for re-use, it is a common thing to do
import React, { useEffect, useMemo, useContext, useRef } from 'react';
import { useFrame, useLoader, useResource, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import useAudioPlayer from '../../../UI/Player/hooks/useAudioPlayer';
import { useKeyPress } from '../../../Utils/hooks';
import * as C from './constants';
import { MaterialsContext } from './MaterialsContext';

export default function Hall({ }) {
    const gltf = useLoader(GLTFLoader, C.BIG_ROOM_URL, loader => {
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco-gltf/')
        loader.setDRACOLoader(dracoLoader)
    })
    const [ref, room] = useResource()
    const { foamGripMaterial } = useContext(MaterialsContext);
    const geometry = useMemo(() => {
        gltf.scene.traverse(child => {
            if (child.name == "Hall") {
                child.geometry.name = child.name;
                buttons[buttonName] = child.geometry.clone();
            }
        })
    });
    return <group ref={ref}>
        {room &&
            <>
                <mesh
                    material={foamGripMaterial}
                >
                    <bufferGeometry attach="geometry" {...geometry} />
                </mesh>
                {/* <HallLights /> */}
            </>
        }
    </group>

}

