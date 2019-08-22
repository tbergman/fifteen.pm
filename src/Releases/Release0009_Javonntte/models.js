import { useEffect, useState } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { BUILDINGS_URL } from "./constants";

function loadGLTF(url, onSuccess) {
    return Promise.resolve(
        new Promise((resolve, reject) => {
            new GLTFLoader().load(url, resolve, null, reject)
        }).then(gltf => onSuccess(gltf)));
}

// When you make this loadbuildings logic global, it always works, without errors :/
function loadBuildings() {
    const buildingsLoader = new GLTFLoader();
    let buildings = {}
    buildingsLoader.load(BUILDINGS_URL, gltf => {
        gltf.scene.traverse(child => child.isMesh && (buildings[child.name] = child.geometry.clone()))
    })
    return buildings;
}

export const useBuildings = () => {
    const [buildings, setBuildings] = useState(false);
    useEffect(() => void loadGLTF(BUILDINGS_URL, onSuccess).then(b => setBuildings(b)), [setBuildings])
    const onSuccess = (gltf) => {
        const geometries = {}
        gltf.scene.traverse(child => {
            if (child.isMesh) {
                geometries[child.name] = child.geometry.clone();
            }
        })
        return geometries;
    }
    return buildings
}