import React, { useRef } from 'react';
import * as THREE from 'three';
import { randomClone, subdivideTriangle } from "./utils";


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


// TODO material updates/dynamic not just sitting here in the wrong place
// import { initPinkRockMaterial } from '../../Utils/materials';
// const pinkRockMat = initPinkRockMaterial(new THREE.TextureLoader());
function Building({ geometry, material, centroid, normal, color, visible }) {
    return <mesh
        onUpdate={self => {
            self.lookAt(normal);
            self.visible = visible
        }}
        geometry={geometry}
        position={centroid}
        material={material}
        // material={pinkRockMat}
    // TODO random rotations
    />
}

export function Buildings({ formation, triangle, centroid, normal, geometries, material, ...props }) {
    const buildingGroupRef = useRef();
    // get centroids based on formation type
    const subdivisions = subdivideTriangle(triangle, centroid, formation);
    const color = getRandomColor(centroid); // TODO temporary color to help debug
    // const [hasRendered, setHasRendered] = useState(0)
    return <group>
        {subdivisions.map(subdivision => {
            const geometry = randomClone(geometries[subdivision.size]);
            // const geometry = geometries.medium[0];
            return <group ref={buildingGroupRef} key={buildingName(geometry, subdivision.centroid)}>
                <Building geometry={geometry} material={material} centroid={subdivision.centroid} normal={normal} color={color} />
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
            if (child.name.startsWith("MEDIUM")) { // TODO these were names i made in blender so would need to update them there to match small, medium, large
                geometries.medium.push(geometry);
            } else if (child.name.startsWith("LARGE")) {
                geometries.large.push(geometry);
            } else if (child.name.startsWith("SMALL")) {
                geometries.small.push(geometry);
            }
        }
    })
    return geometries;
}