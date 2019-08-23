import { useEffect, useState } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function loadGLTF(url, onSuccess) {
    return Promise.resolve(
        new Promise((resolve, reject) => {
            new GLTFLoader().load(url, resolve, null, reject)
        }).then(gltf => onSuccess(gltf)));
}

export const useGLTF = (url) => {
    const [loading, setLoading] = useState(false);
    const [model, setModel] = useState(false);
    const onSuccess = (gltf) => {
        const geometries = {}
        gltf.scene.traverse(child => {
            if (child.isMesh) {
                geometries[child.name] = child.geometry.clone();
            }
        })
        return geometries;
    }
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