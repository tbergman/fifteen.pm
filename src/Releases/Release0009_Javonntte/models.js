import { useEffect, useState, useRef, useMemo } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { BUILDINGS_URL } from "./constants";

function loadGLTF(url, onSuccess) {
    return Promise.resolve(
        new Promise((resolve, reject) => {
            new GLTFLoader().load(url, resolve, null, reject)
        }).then(gltf => onSuccess(gltf)));
}

// When you make this loadbuildings logic global, it always works, without errors :/
function loadBuildingsOrig() {
    const buildingsLoader = new GLTFLoader();
    let buildings = {}
    buildingsLoader.load(BUILDINGS_URL, gltf => {
        gltf.scene.traverse(child => child.isMesh && (buildings[child.name] = child.geometry.clone()))
    })
    return buildings;
}

export const loadBuildings = () => {
    const [buildings, setBuildings] = useState(false);
    const loader = useMemo(() => loadGLTF(BUILDINGS_URL, (gltf) => {
        const geometries = {}
        gltf.scene.traverse(child => {
            if (child.isMesh) {
                geometries[child.name] = child.geometry.clone();
            }
        })
        return geometries;
    }), [buildings]);
    useEffect(() => void loader.then(b => setBuildings(b)), [setBuildings])
    return buildings;
}

export const useBuildings = () => {
    const [buildings, setBuildings] = useState(false);
    const loader = useMemo(() => loadGLTF(BUILDINGS_URL, (gltf) => {
        const geometries = {}
        gltf.scene.traverse(child => {
            if (child.isMesh) {
                geometries[child.name] = child.geometry.clone();
            }
        })
        setBuildings(geometries)
        return geometries;
    }), [buildings]);
    useEffect(() => void loader, [buildings])
    return buildings;
}

export const useModel = (url) => {
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
            console.log("MODEL LOADED:", model);
            setModel((...args) => console.log('setmodel',...args, model) || model);
            setLoading(false);
        })();
    }, [url]);

    return [loading, model]
}