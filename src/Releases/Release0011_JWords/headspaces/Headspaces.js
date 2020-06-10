import React, { useState, useContext, useMemo, useEffect } from 'react';
import { useLoader, useFrame, useResource, useThree } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import Single from './Single';
import Asymmetrical from './Asymmetrical';
import Symmetrical from './Symmetrical';
import useAudioPlayer from "../../../Common/UI/Player/hooks/useAudioPlayer";
import * as C from '../constants';
import { MaterialsContext } from '../MaterialsContext';

function _headspaceName({ headspace, complexity, material }) {
    return `${headspace}__${complexity}__${material}`
}

function _extractHeadParts(gltf, materials) {
    const materialNames = Object.keys(materials).filter(name => C.HEAD_MATERIALS.indexOf(name) >= 0);
    let head;
    const headMaterials = {}
    gltf.scene.traverse(child => {
        if (child.name == "Object_0") {
            head = child.clone()
            for (const name of materialNames) {
                headMaterials[name] = materials[name]
                // assign the original image map to the material so we can see jen
                if (name == C.NOISE1) {
                    headMaterials[name].uniforms.map = { value: child.material.map }
                } else {
                    headMaterials[name].map = child.material.map;
                }

            }
        }
    })
    return { mesh: head, materials: headMaterials };
}

export default function Headspaces({ step }) {
    const [ref, headspaces] = useResource()
    const { currentTrackName } = useAudioPlayer();
    const [headspaceName, setHeadspaceName] = useState(_headspaceName(C.TRACKS_CONFIG[C.FIRST_TRACK].steps[0]))
    const materials = useContext(MaterialsContext);
    const lowPolyTwoFace = useLoader(GLTFLoader, C.HEADSPACE_9_PATH, loader => {
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco-gltf/')
        loader.setDRACOLoader(dracoLoader)
    });

    const lowPolyOneFace = useLoader(GLTFLoader, C.HEADSPACE_10_PATH, loader => {
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco-gltf/')
        loader.setDRACOLoader(dracoLoader)
    });

    const oneFace = useMemo(() => _extractHeadParts(lowPolyOneFace, materials), [lowPolyOneFace]);
    const twoFace = useMemo(() => _extractHeadParts(lowPolyTwoFace, materials), [lowPolyTwoFace]);


    useEffect(() => {
        if (!currentTrackName) return;
        setHeadspaceName(_headspaceName(step))
    }, [step])

    return (
        <group ref={ref}>
            {headspaces &&
                <>
                    {headspaceName == _headspaceName({ headspace: C.SYMMETRICAL, complexity: C.SMALL, material: C.NOISE1 }) &&
                        <Symmetrical
                            mesh={oneFace.mesh}
                            complexity={C.SMALL}
                            material={oneFace.materials[C.NOISE1]}
                        />
                    }
                    {headspaceName == _headspaceName({ headspace: C.SINGLE, complexity: C.SMALL, material: C.NAIVE_GLASS }) &&
                        <Single
                            mesh={oneFace.mesh}
                            complexity={C.SMALL}
                            material={oneFace.materials[C.NAIVE_GLASS]}
                        />
                    }
                    {headspaceName == _headspaceName({ headspace: C.SINGLE, complexity: C.SMALL, material: C.WIREFRAMEY }) &&
                        <Single
                            mesh={oneFace.mesh}
                            complexity={C.SMALL}
                            material={oneFace.materials[C.WIREFRAMEY]}
                        />
                    }
                    {headspaceName == _headspaceName({ headspace: C.ASYMMETRICAL, complexity: C.SMALL, material: C.WIREFRAMEY }) &&
                        <Asymmetrical
                            mesh1={oneFace.mesh}
                            mesh2={twoFace.mesh}
                            complexity={C.SMALL}
                            material1={oneFace.materials[C.WIREFRAMEY]}
                            material2={twoFace.materials[C.WIREFRAMEY]}
                        />

                    }
                    {headspaceName == _headspaceName({ headspace: C.ASYMMETRICAL, complexity: C.SMALL, material: C.NOISE1 }) &&
                        <Asymmetrical
                            mesh1={oneFace.mesh}
                            mesh2={twoFace.mesh}
                            complexity={C.SMALL}
                            material1={oneFace.materials[C.NOISE1]}
                            material2={twoFace.materials[C.NOISE1]}
                        />

                    }

                    {/* {headspaceName == C.SINGLE && <Single gltf={lowPolyTwoFace} material={material} />} */}
                    {/* {headspaceName == C.ASYMMETRICAL && <Asymmetrical gltf1={lowPolyTwoFace} gltf2={lowPolyOneFace} material={material} />} */}
                    {/* {headspaceName == C.SYMMETRICAL && <Symmetrical gltf={lowPolyOneFace} material={material} />} */}
                </>
            }
        </group>
    )
}
