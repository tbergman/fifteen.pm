import React, { useRef } from 'react';
import * as THREE from 'three';
import { SMALL, MEDIUM, LARGE } from "./constants";

// TODO rm me
function random(seed) {
    var x = Math.sin(seed) * 10000;
    var r = x - Math.floor(x);
    return r;
}

// TODO rm me
function getRandomColor(centroid) {
    var letters = '0123456789ABCDEF';
    var color = '#';
    var seed = random(centroid.x * centroid.y * centroid.z) * 10000;
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(random(seed++) * 16)];
    }
    return color;
}

function buildingName(building, position) {
    return [building.name,
    position.x,
    position.y,
    position.z,
    ].join("_")
}

function Building({ geometry, material, centroid, normal, color, visible }) {
    return <mesh
        onUpdate={self => {
            self.lookAt(normal);
            self.visible = visible
        }}
        geometry={geometry}
        position={centroid}
        material={material}
    // TODO random rotations
    />
}

export function getRandomBuilding(geometries) {
    const array = new Uint32Array(geometries.length);
    window.crypto.getRandomValues(array);
    const idx = array[THREE.Math.randInt(0, geometries.length - 1)] % geometries.length;
    return geometries[idx];
}

export function Buildings({ material, subdivisions, normal }) {
    const buildingGroupRef = useRef();
    return <group>
        {subdivisions.map(subdivision => {
            return <group
                ref={buildingGroupRef}
                key={buildingName(subdivision.geometry, subdivision.centroid)}
            >
                <Building
                    material={material}
                    normal={normal}
                    geometry={subdivision.geometry}
                    centroid={subdivision.centroid}
                />
            </group>
        })}
    </group>;
}

export function onBuildingsLoaded(gltf) {
    // size as measured by footprint

    const geometries = {
        small: [],
        medium: [],
        large: []
    }
    gltf.scene.traverse(child => {
        if (child.isMesh) {
            // For devving minimal number of faces
            // if (child.name === "MEDIUM_penobscot") {
            //     console.log("GOT THE GEOMETRY")
            //     child.position.set(0, 0, 0);
            //     const geometry = child.geometry.clone();
            //     geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI));
            //     geometries.medium.push(geometry)
            // }
            child.position.set(0, 0, 0);
            const geometry = child.geometry.clone();
            // this makes the 'lookAt(normal)' function as expected on the sphere by flipping the default blender output
            geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI));
            if (child.name.startsWith(MEDIUM)) {
                geometries.medium.push(geometry);
            } else if (child.name.startsWith(LARGE)) {
                geometries.large.push(geometry);
            } else if (child.name.startsWith(SMALL)) {
                geometries.small.push(geometry);
            }
        }
    })
    return geometries;
}