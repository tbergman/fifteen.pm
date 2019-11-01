

import React, { useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useLoader, useResource } from 'react-three-fiber';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { CloudMaterial, Facade04Material, Facade10Material, Facade12Material, FoamGripMaterial, Metal03Material, Windows1Material } from '../../Utils/materials';
import * as C from './constants';


const BuildingsContext = React.createContext([{}, () => { }]);

const BuildingsProvider = ({ ...props }) => {
    const gltf = useLoader(GLTFLoader, C.BUILDINGS_URL, loader => {
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco-gltf/')
        loader.setDRACOLoader(dracoLoader)
    })

    const [loaded, setLoaded] = useState(false);

    // TODO organization of materials
    const [cloudRef, cloud] = useResource();
    const [foamGripRef, foamGrip] = useResource();
    const [windows1Ref, windows1] = useResource();
    const [facade04Ref, facade04] = useResource();
    const [facade10Ref, facade10] = useResource();
    const [facade12Ref, facade12] = useResource();
    const [metal03Ref, metal03] = useResource();

    const mats = [metal03, foamGrip, facade10]


    const buildingMaterial = useMemo(() => {
        return {
            "large_short_low_present_boxy": foamGrip,
            "large_short_low_present_boxy": foamGrip,
            "large_short_low_present_factory": foamGrip,
            "large_short_low_present_factory": foamGrip,
            "large_tall_low_michigancentralstation": foamGrip,
            "large_tall_low_michigancentralstation": foamGrip,
            "large_tall_tower_present_bookcadillachotel": foamGrip,
            "large_tall_tower_present_bookcadillachotel": foamGrip,
            "large_tall_tower_present_penobscot": foamGrip,
            "large_tall_tower_present_penobscot": foamGrip,
            "large_tall_tower_present_talltower": foamGrip,
            "large_tall_tower_present_talltower": foamGrip,
            "medium_short_diamond_future_diamondhull_geo001": foamGrip,
            "medium_short_diamond_future_diamondhull_geo001": foamGrip,
            "medium_tall_diamond_future_diamondhull_geo": foamGrip,
            "medium_tall_diamond_future_diamondhull_geo": foamGrip,
            "medium_tall_diamond_future_disco1": foamGrip,
            "medium_tall_diamond_future_disco1": foamGrip,
            "medium_tall_diamond_future_shinyhull1": foamGrip,
            "medium_tall_diamond_future_shinyhull1": foamGrip,
            "medium_tall_diamond_future_unlithull_geo": foamGrip,
            "medium_tall_diamond_future_unlithull_geo": foamGrip,
            "medium_tall_diamond_future_unlithull_geo001": foamGrip,
            "medium_tall_diamond_future_unlithull_geo001": foamGrip,
            "medium_tall_ribbony_fture_celvinyl_geo003": foamGrip,
            "medium_tall_ribbony_fture_celvinyl_geo003": foamGrip,
            "medium_tall_ribbony_future_celvinyl_geo002": foamGrip,
            "medium_tall_ribbony_future_celvinyl_geo002": foamGrip,
            "medium_tall_tower_present_broderick": foamGrip,
            "medium_tall_tower_present_broderick": foamGrip,
            "medium_tall_tower_present_fancytower": foamGrip,
            "medium_tall_tower_present_fancytower": foamGrip,
            "medium_tall_tower_present_tower": foamGrip,
            "medium_tall_tower_present_tower": foamGrip,
            "small_short_twirly_future_disco1_small_cactus": foamGrip,
            "small_short_twirly_future_disco1_small_cactus": foamGrip,
            "small_short_twirly_future_disco1_small_worm": foamGrip,
            "small_short_twirly_future_disco1_small_worm": foamGrip,
            "small_tall_diamond_future_diamondhull_geo002": foamGrip,
            "small_tall_diamond_future_diamondhull_geo002": foamGrip,
            "small_tall_diamond_future_toongeo1": foamGrip,
            "small_tall_diamond_future_toongeo1": foamGrip,
            "small_tall_tower_present_lightwire1": foamGrip,
            "small_tall_tower_present_lightwire1": foamGrip,
            "small_tall_tower_present_needle": foamGrip,
            "small_tall_tower_present_needle": foamGrip,
            "small_tall_twirly_future_comet_geo": foamGrip,
            "small_tall_twirly_future_comet_geo": foamGrip,
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
                building.geometry = geometry;
                building.material = buildingMaterial[building.name];
                const [maxWidthBucket, maxHeightBucket, category, name] = child.name.split("_");
                building.footprint = maxWidthBucket;
                _b.push(building);
            }
        })
        return _b;
    }, [loaded])

    useEffect(() => {
        const allMats = Object.values(buildingMaterial);
        const loadedMats = allMats.filter(mat => mat);
        setLoaded(allMats.length == loadedMats.length && gltf);
    })

    return <BuildingsContext.Provider value={{buildings, loaded}}>
        <FoamGripMaterial materialRef={foamGripRef} color={0x0000af} />
        <CloudMaterial materialRef={cloudRef} emissive={0xd4af37} />
        <Windows1Material materialRef={windows1Ref} />
        <Facade10Material materialRef={facade10Ref} />
        <Facade04Material materialRef={facade04Ref} />
        <Facade12Material materialRef={facade12Ref} />
        <Metal03Material materialRef={metal03Ref} />
        {props.children}
    </BuildingsContext.Provider>
}

export { BuildingsContext, BuildingsProvider }