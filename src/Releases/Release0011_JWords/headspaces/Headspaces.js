import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useLoader, useResource } from 'react-three-fiber';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import useAudioPlayer from "../../../Common/UI/Player/hooks/useAudioPlayer";
import * as C from '../constants';
import { MaterialsContext } from '../MaterialsContext';
import Asymmetrical from './Asymmetrical';
import Single from './Single';
import Symmetrical from './Symmetrical';

function _headspaceName({ headspace, complexity, material1, material2 }) {
    if (material2) {
        return `${headspace}__${complexity}__${material1}__${material2}`
    } else {
        return `${headspace}__${complexity}__${material1}`
    }
}

function _extractHead(gltf, materials, materialNames) {
    const head = {}
    gltf.scene.traverse(child => {
        if (child.name == "Object_0") {
            for (const name of materialNames) {
                head[name] = child.clone()
                head[name].material = materials[name]
                // assign the original image map to the material so we can see jen
                if (name == C.NOISE1) {
                    head[name].material.uniforms.map = { value: child.material.map }
                } else {
                    head[name].material.map = child.material.map;
                }
            }
        }
    })
    return head;
}

export default function Headspaces({ step }) {
    const [ref, headspaces] = useResource()
    const { currentTrackName } = useAudioPlayer();
    const [headspaceName, setHeadspaceName] = useState(_headspaceName(C.TRACKS_CONFIG[C.FIRST_TRACK].steps[0]))
    const { noise1,
        naiveGlass1,
        wireframey1,
        noise2,
        naiveGlass2,
        wireframey2 } = useContext(MaterialsContext);
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

    const oneFace = useMemo(() => _extractHead(
        lowPolyOneFace,
        { noise1, naiveGlass1, wireframey1 },
        C.HEAD_MATERIALS1,
    ), [lowPolyOneFace]);
    const twoFace = useMemo(() => _extractHead(
        lowPolyTwoFace,
        { noise2, naiveGlass2, wireframey2 },
        C.HEAD_MATERIALS2,
    ), [lowPolyTwoFace]);


    useEffect(() => {
        if (!currentTrackName) return;
        setHeadspaceName(_headspaceName(step))
    }, [step])

    return (
        <group ref={ref}>
            {headspaces &&
                <>

                    {headspaceName == _headspaceName({ headspace: C.SINGLE, complexity: C.SMALL, material1: C.NAIVE_GLASS1 }) &&
                        <Single
                            head={oneFace[C.NAIVE_GLASS1]}
                            complexity={C.SMALL}
                        />
                    }
                    {headspaceName == _headspaceName({ headspace: C.SINGLE, complexity: C.SMALL, material1: C.WIREFRAMEY1 }) &&
                        <Single
                            head={oneFace[C.WIREFRAMEY1]}
                            complexity={C.SMALL}
                        />
                    }
                    {headspaceName == _headspaceName({ headspace: C.SINGLE, complexity: C.SMALL, material1: C.NOISE1 }) &&
                        <Single
                            head={oneFace[C.NOISE1]}
                            complexity={C.SMALL}
                        />
                    }
                    {headspaceName == _headspaceName({ headspace: C.SINGLE, complexity: C.MEDIUM, material1: C.NOISE1 }) &&
                        <Single
                            head={oneFace[C.NOISE1]}
                            complexity={C.MEDIUM}
                        />
                    }
                    {headspaceName == _headspaceName({ headspace: C.SINGLE, complexity: C.MEDIUM, material1: C.NAIVE_GLASS1 }) &&
                        <Single
                            head={oneFace[C.NAIVE_GLASS1]}
                            complexity={C.MEDIUM}
                        />
                    }
                    {headspaceName == _headspaceName({ headspace: C.SINGLE, complexity: C.LARGE, material1: C.NOISE1 }) &&
                        <Single
                            head={oneFace[C.NOISE1]}
                            complexity={C.LARGE}
                        />
                    }
                    {headspaceName == _headspaceName({ headspace: C.SINGLE, complexity: C.LARGE, material1: C.NAIVE_GLASS1 }) &&
                        <Single
                            head={oneFace[C.NAIVE_GLASS1]}
                            complexity={C.LARGE}
                        />
                    }
                    {headspaceName == _headspaceName({ headspace: C.SINGLE, complexity: C.LARGE, material1: C.WIREFRAMEY1 }) &&
                        <Single
                            head={oneFace[C.WIREFRAMEY1]}
                            complexity={C.LARGE}
                        />
                    }
                    {headspaceName == _headspaceName({ headspace: C.ASYMMETRICAL, complexity: C.SMALL, material1: C.NAIVE_GLASS1, material2: C.NAIVE_GLASS2 }) &&
                        <Asymmetrical
                            head1={oneFace[C.NAIVE_GLASS1]}
                            head2={twoFace[C.NAIVE_GLASS2]}
                            complexity={C.SMALL}
                        />
                    }
                    {headspaceName == _headspaceName({ headspace: C.ASYMMETRICAL, complexity: C.SMALL, material1: C.WIREFRAMEY1, material2: C.WIREFRAMEY2 }) &&
                        <Asymmetrical
                            head1={oneFace[C.WIREFRAMEY1]}
                            head2={twoFace[C.WIREFRAMEY2]}
                            complexity={C.SMALL}
                        />
                    }
                    {headspaceName == _headspaceName({ headspace: C.ASYMMETRICAL, complexity: C.SMALL, material1: C.NOISE1, material2: C.NAIVE_GLASS2 }) &&
                        <Asymmetrical
                            head1={oneFace[C.NOISE1]}
                            head2={twoFace[C.NAIVE_GLASS2]}
                            complexity={C.SMALL}
                        />
                    }
                    {headspaceName == _headspaceName({ headspace: C.ASYMMETRICAL, complexity: C.SMALL, material1: C.NOISE1, material2: C.NOISE2 }) &&
                        <Asymmetrical
                            head1={oneFace[C.NOISE1]}
                            head2={twoFace[C.NOISE2]}
                            complexity={C.SMALL}
                        />
                    }
                    {headspaceName == _headspaceName({ headspace: C.ASYMMETRICAL, complexity: C.SMALL, material1: C.NOISE1, material2: C.WIREFRAMEY2 }) &&
                        <Asymmetrical
                            head1={oneFace[C.NOISE1]}
                            head2={twoFace[C.WIREFRAMEY2]}
                            complexity={C.SMALL}
                        />
                    }
                    {headspaceName == _headspaceName({ headspace: C.ASYMMETRICAL, complexity: C.SMALL, material1: C.NAIVE_GLASS1, material2: C.NOISE2 }) &&
                        <Asymmetrical
                            head1={oneFace[C.NAIVE_GLASS1]}
                            head2={twoFace[C.NOISE2]}
                            complexity={C.SMALL}
                        />
                    }
                    {headspaceName == _headspaceName({ headspace: C.ASYMMETRICAL, complexity: C.MEDIUM, material1: C.NOISE1, material2: C.NOISE2 }) &&
                        <Asymmetrical
                            head1={oneFace[C.NOISE1]}
                            head2={twoFace[C.NOISE2]}
                            complexity={C.MEDIUM}
                        />
                    }
                    {headspaceName == _headspaceName({ headspace: C.ASYMMETRICAL, complexity: C.MEDIUM, material1: C.WIREFRAMEY1, material2: C.NOISE2 }) &&
                        <Asymmetrical
                            head1={oneFace[C.WIREFRAMEY1]}
                            head2={twoFace[C.NOISE2]}
                            complexity={C.MEDIUM}
                        />
                    }
                    {headspaceName == _headspaceName({ headspace: C.ASYMMETRICAL, complexity: C.LARGE, material1: C.NOISE1, material2: C.NOISE2 }) &&
                        <Asymmetrical
                            head1={oneFace[C.NOISE1]}
                            head2={twoFace[C.NOISE2]}
                            complexity={C.LARGE}
                        />
                    }
                    {headspaceName == _headspaceName({ headspace: C.SYMMETRICAL, complexity: C.SMALL, material1: C.NAIVE_GLASS1 }) &&
                        <Symmetrical
                            head={oneFace[C.NAIVE_GLASS1]}
                            complexity={C.SMALL}
                        />
                    }
                    {headspaceName == _headspaceName({ headspace: C.SYMMETRICAL, complexity: C.SMALL, material1: C.WIREFRAMEY1 }) &&
                        <Symmetrical
                            head={oneFace[C.WIREFRAMEY1]}
                            complexity={C.SMALL}
                        />
                    }
                    {headspaceName == _headspaceName({ headspace: C.SYMMETRICAL, complexity: C.SMALL, material1: C.NOISE1 }) &&
                        <Symmetrical
                            head={oneFace[C.NOISE1]}
                            complexity={C.SMALL}
                        />
                    }
                    {headspaceName == _headspaceName({ headspace: C.SYMMETRICAL, complexity: C.MEDIUM, material1: C.NOISE1 }) &&
                        <Symmetrical
                            head={oneFace[C.NOISE1]}
                            complexity={C.MEDIUM}
                        />
                    }
                    {headspaceName == _headspaceName({ headspace: C.SYMMETRICAL, complexity: C.MEDIUM, material1: C.NOISE1 }) &&
                        <Symmetrical
                            head={oneFace[C.NOISE1]}
                            complexity={C.MEDIUM}
                        />
                    }
                    {headspaceName == _headspaceName({ headspace: C.SYMMETRICAL, complexity: C.MEDIUM, material1: C.WIREFRAMEY1 }) &&
                        <Symmetrical
                            head={oneFace[C.WIREFRAMEY1]}
                            complexity={C.MEDIUM}
                        />
                    }
                    {headspaceName == _headspaceName({ headspace: C.SYMMETRICAL, complexity: C.MEDIUM, material1: C.NAIVE_GLASS1 }) &&
                        <Symmetrical
                            head={oneFace[C.NAIVE_GLASS1]}
                            complexity={C.MEDIUM}
                        />
                    }
                    {headspaceName == _headspaceName({ headspace: C.SYMMETRICAL, complexity: C.LARGE, material1: C.NOISE1 }) &&
                        <Symmetrical
                            head={oneFace[C.NOISE1]}
                            complexity={C.LARGE}
                        />
                    }
                </>
            }
        </group>
    )
}
