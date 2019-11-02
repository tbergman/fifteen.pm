

import React, { useEffect, useMemo, useState } from 'react';
import { useLoader, useResource } from 'react-three-fiber';
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Tiles60, Tiles36, CloudMaterial, Facade04Material, Facade10Material, Facade12Material, FoamGripMaterial, Metal03Material, Windows1Material, Rock19, OrnateBrass2, ScuffedPlasticMaterial, BlackLeather12 } from '../../../Utils/materials';
import * as C from '../constants';


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
    const [foamGripSilverRef, foamGripSilver] = useResource();
    const [foamGripPurpleRef, foamGripPurple] = useResource();
    const [windows1Ref, windows1] = useResource();
    const [facade04Ref, facade04] = useResource();
    const [facade10Ref, facade10] = useResource();
    const [facade12Ref, facade12] = useResource();
    const [metal03Ref, metal03] = useResource();
    const [tiles60Ref, tiles60] = useResource();
    const [tiles36Ref, tiles36] = useResource();
    const [rock19Ref, rock19] = useResource();
    const [ornateBrass2Ref, ornateBrass2] = useResource();
    const [scuffedPlasticRef, scuffedPlastic] = useResource();
    const [blackLeather12Ref, blackLeather12] = useResource();
    const attributes = useMemo(() => {
        return {
            "large_short_low_present_boxy": { material: blackLeather12 },
            "large_short_low_present_factory": { material: metal03 },
            "large_tall_low_michigancentralstation": { material: foamGripSilver },
            "large_tall_tower_present_bookcadillachotel": { material: foamGripSilver },
            "large_tall_tower_present_penobscot": { material: metal03 },
            "medium_short_diamond_future_diamondhull_geo001": { material: foamGripSilver },
            "medium_tall_diamond_future_diamondhull_geo": { material: foamGripSilver },
            "medium_tall_diamond_future_disco1": { material: foamGripSilver },
            "medium_tall_diamond_future_shinyhull1": { material: foamGripSilver },
            "medium_tall_diamond_future_unlithull_geo": { material: foamGripSilver },
            "medium_tall_diamond_future_unlithull_geo001": { material: foamGripSilver },
            "medium_tall_ribbony_future_celvinyl_geo003": { material: foamGripSilver },
            "medium_tall_ribbony_future_celvinyl_geo002": { material: foamGripSilver },
            "medium_tall_tower_future_talltower": { material: facade10 },
            "medium_tall_tower_present_broderick": { material: facade12 },
            "medium_tall_tower_present_fancytower": { material: facade10 },
            "medium_tall_tower_present_tower": { material: tiles36 },
            "small_short_twirly_future_disco1_small_cactus": { material: scuffedPlastic },
            "small_short_twirly_future_disco1_small_worm": { material: foamGripPurple },
            "small_tall_diamond_future_diamondhull_geo002": { material: metal03 },
            "small_tall_diamond_future_toongeo1": { material: scuffedPlastic },
            "small_tall_tower_future_lightwire1": { material: ornateBrass2 },
            "small_tall_tower_present_needle": { material: foamGripPurple },
            "small_tall_twirly_future_comet_geo": { material: foamGripSilver },
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
                // TODO TMP rm this conditional!
                if (Object.keys(attributes).includes(building.name)) {
                    building.geometry = geometry;
                    building.material = attributes[building.name].material;
                    const [maxWidthBucket, maxHeightBucket, category, era, name] = child.name.split("_");
                    building.footprint = maxWidthBucket;
                    // TODO separate out all "present" and "future" era and use present for asteroids and future for city
                    building.era = era;
                    _b.push(building);
                }


            }
        })
        return _b;
    }, [loaded])

    useEffect(() => {
        const allMats = Object.values(attributes);
        const loadedMats = allMats.filter(mat => mat);
        setLoaded(allMats.length == loadedMats.length && gltf);
    })

    return <BuildingsContext.Provider value={{ buildings, loaded }}>
        <FoamGripMaterial materialRef={foamGripPurpleRef} color={0xff00af} specular={0x00ff00} />
        <FoamGripMaterial materialRef={foamGripSilverRef} color={0x0000af} />
        <CloudMaterial materialRef={cloudRef} emissive={0xd4af37} />
        <Windows1Material materialRef={windows1Ref} />
        <Facade10Material materialRef={facade10Ref} shininess={100} textureRepeat={{ x: 1, y: 1 }} />
        <Facade04Material materialRef={facade04Ref} textureRepeat={{ x: 1, y: 1 }} color={0xc0c0c0} />
        <Facade12Material materialRef={facade12Ref} />
        <Metal03Material materialRef={metal03Ref} textureRepeat={{ x: 2, y: 2 }} />
        <Tiles60 materialRef={tiles60Ref} />
        <Tiles36 materialRef={tiles36Ref} shininess={100} />
        <Rock19 materialRef={rock19Ref} displacementScale={0.05} />
        <OrnateBrass2 materialRef={ornateBrass2Ref} />
        <ScuffedPlasticMaterial materialRef={scuffedPlasticRef} color={0x000000} />
        <BlackLeather12 materialRef={blackLeather12Ref} />
        {props.children}
    </BuildingsContext.Provider>
}

export { BuildingsContext, BuildingsProvider };
