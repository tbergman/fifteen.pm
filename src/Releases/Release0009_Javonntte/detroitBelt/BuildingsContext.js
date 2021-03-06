

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useLoader } from 'react-three-fiber';
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as C from '../constants';
import { MaterialsContext } from '../MaterialsContext';

const BuildingsContext = React.createContext([{}, () => { }]);

const BuildingsProvider = ({ ...props }) => {
    const gltf = useLoader(GLTFLoader, C.BUILDINGS_URL, loader => {
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco-gltf/')
        loader.setDRACOLoader(dracoLoader)
    })

    const [loaded, setLoaded] = useState(false);

    const {
        loaded: materialsLoaded,
        metal03,
        scuffedPlasticBlack,
        facade10,
        ornateBrass2 } = useContext(MaterialsContext)

    const attributes = useMemo(() => {
        return {
            "large_short_low_present_boxy": { material: scuffedPlasticBlack },
            "large_short_low_present_factory": { material: scuffedPlasticBlack },
            "large_tall_low_present_michigancentralstation": { material: scuffedPlasticBlack },
            // "large_tall_tower_present_bookcadillachotel": { material: scuffedPlasticBlack },
            "large_tall_tower_present_penobscot": { material: scuffedPlasticBlack },
            // "medium_tall_diamond_future_disco1": { material: scuffedPlasticBlack },
            // "medium_tall_diamond_future_shinyhull1": { material: scuffedPlasticBlack },
            // "medium_tall_ribbony_future_celvinyl_geo003": { material: scuffedPlasticBlack },
            // "medium_tall_ribbony_future_celvinyl_geo002": { material: scuffedPlasticBlack },
            "medium_tall_tower_present_talltower": { material: facade10 },
            // "medium_tall_tower_present_broderick": { material: facade12 },
            // "medium_tall_tower_present_fancytower": { material: facade10 },
            // "medium_tall_tower_present_tower": { material: tiles36 },
            // "medium_tall_tower_future_needle7": { material: scuffedPlasticBlack },
            // "small_short_twirly_future_disco1_small_cactus": { material: scuffedPlasticBlack },
            // "small_short_twirly_future_disco1_small_worm": { material: foamGripPurple },
            // "small_tall_diamond_future_diamondhull_geo002": { material: metal03 },
            // "small_tall_diamond_future_toongeo1": { material: scuffedPlasticBlack },
            // "small_tall_tower_future_needle3": { material: ornateBrass2 },
            "small_tall_tower_future_needle4": { material: ornateBrass2 },
            "small_tall_tower_future_needle6": { material: ornateBrass2 },
            // "small_tall_tower_future_lightwire1": { material: ornateBrass2 },
            // "small_tall_tower_present_needle": { material: scuffedPlasticBlack },
            "small_tall_twirly_future_comet_geo": { material: metal03 },
        }
    });

    const buildings = useMemo(() => {
        if (!loaded) return;
        // build an array of buildings
        const _b = [];
        const geometrySize = new THREE.Vector3();
        gltf.scene.traverse(child => {
            if (child.isMesh) {
                const building = {
                    name: undefined,
                    geometry: undefined,
                    material: undefined,
                }
                child.position.set(0, 0, 0);
                const geometry = child.geometry.clone();
                geometry.toNonIndexed();
                geometry.computeBoundingBox();
                geometry.boundingBox.getSize(geometrySize);
                building.name = child.name;
                if (Object.keys(attributes).includes(building.name)) {
                    building.geometry = geometry;
                    building.material = attributes[building.name].material;
                    const [maxWidthBucket, maxHeightBucket, category, era, name] = child.name.split("_");
                    building.footprint = maxWidthBucket;
                    building.category = category;
                    building.era = era;
                    _b.push(building);
                }
            }
        })
        return _b;
    }, [loaded])

    useEffect(() => {
        setLoaded(materialsLoaded && gltf);
    }, [materialsLoaded])

    return <BuildingsContext.Provider value={{ buildings, loaded }}>
        {props.children}
    </BuildingsContext.Provider>
}

export { BuildingsContext, BuildingsProvider };
