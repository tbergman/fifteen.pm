import { useEffect, useState } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function loadGLTF(url, onSuccess) {
    return Promise.resolve(
        new Promise((resolve, reject) => {
            new GLTFLoader().load(url, resolve, null, reject)
        }).then(gltf => onSuccess(gltf)));
}

// TODO -- maybe use this it looks sturdy https://github.com/react-spring/react-three-fiber/blob/799d21878a472f7f2bfb2c7051c5f84a56bc491f/src/hooks.ts#L94
export const useGLTF = (url, onSuccess) => {
    if (!onSuccess) onSuccess = (gltf) => gltf;
    const [loading, setLoading] = useState(false);
    const [model, setModel] = useState(false);
    useEffect(() => {
        (async () => {
            setLoading(true);
            const model = await loadGLTF(url, onSuccess);
            setModel(model);
            setLoading(false);
        })();
    }, [url]);
    return [loading, model]
}