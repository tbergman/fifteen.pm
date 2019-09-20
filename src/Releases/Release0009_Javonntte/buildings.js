import React, { useRef } from 'react';
import * as THREE from 'three';
import * as C from './constants';
import { randFloat } from '../../Utils/random';
import { cloneDeep } from 'lodash';

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
            self.rotation.z = THREE.Math.randFloat(-2 * Math.PI, 2 * Math.PI);
            self.visible = visible
        }}
        geometry={geometry}
        position={centroid}
        material={material}
    />
}

export function Buildings({ material, formation, normal }) {
    const buildingGroupRef = useRef();
    return <group>
        {formation.subdivisions.map(subdivision => {
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
    const period = {
        future: [],
        present: [],
    }
    const heights = {
        short: cloneDeep(period),
        tall: cloneDeep(period),
    }
    const geometries = {
        small: cloneDeep(heights),
        medium:  cloneDeep(heights),
        large: cloneDeep(heights),
        xlarge: cloneDeep(heights),
        arch: [],
    }

    gltf.scene.traverse(child => {
        if (child.isMesh) {
            // For devving minimal number of faces
            // if (child.name === "large_disco_geo001") {
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
            // This is where the sausage gets made :P

        
            console.log(child.name);
            if (child.name.startsWith(C.ARCH)) {
                geometries.arch.push(geometry);
            } else if (child.name.startsWith(C.MEDIUM) && child.name.includes(C.TALL) && child.name.includes(C.PRESENT)) {
                geometries.medium.tall.present.push(geometry);
            } else if (child.name.startsWith(C.MEDIUM) && child.name.includes(C.TALL) && child.name.includes(C.FUTURE)) {
                geometries.medium.tall.future.push(geometry);
            } else if (child.name.startsWith(C.MEDIUM) && child.name.includes(C.SHORT) && child.name.includes(C.PRESENT)) {
                geometries.medium.short.present.push(geometry);
            } else if (child.name.startsWith(C.MEDIUM) && child.name.includes(C.SHORT) && child.name.includes(C.FUTURE)) {
                geometries.medium.short.future.push(geometry);
            } else if (child.name.startsWith(C.SMALL) && child.name.includes(C.TALL) && child.name.includes(C.PRESENT)) {
                geometries.small.tall.present.push(geometry);
            } else if (child.name.startsWith(C.SMALL) && child.name.includes(C.TALL) && child.name.includes(C.FUTURE)) {
                geometries.small.tall.future.push(geometry);
            } else if (child.name.startsWith(C.SMALL) && child.name.includes(C.SHORT) && child.name.includes(C.PRESENT)) {
                geometries.small.short.present.push(geometry);
            } else if (child.name.startsWith(C.SMALL) && child.name.includes(C.SHORT) && child.name.includes(C.FUTURE)) {
                geometries.small.short.future.push(geometry);
            } else if (child.name.startsWith(C.LARGE) && child.name.includes(C.TALL) && child.name.includes(C.PRESENT)) {
                geometries.large.tall.present.push(geometry);
            } else if (child.name.startsWith(C.LARGE) && child.name.includes(C.TALL) && child.name.includes(C.FUTURE)) {
                geometries.large.tall.future.push(geometry);
            } else if (child.name.startsWith(C.LARGE) && child.name.includes(C.SHORT) && child.name.includes(C.PRESENT)) {
                geometries.large.short.present.push(geometry);
            } else if (child.name.startsWith(C.LARGE) && child.name.includes(C.SHORT) && child.name.includes(C.FUTURE)) {
                geometries.large.short.future.push(geometry);
            } else if (child.name.startsWith(C.EXTRA_LARGE) && child.name.includes(C.TALL) && child.name.includes(C.PRESENT)) {
                geometries.xlarge.tall.present.push(geometry);
            } else if (child.name.startsWith(C.EXTRA_LARGE) && child.name.includes(C.TALL) && child.name.includes(C.FUTURE)) {
                geometries.xlarge.tall.future.push(geometry);
            } else if (child.name.startsWith(C.EXTRA_LARGE) && child.name.includes(C.SHORT) && child.name.includes(C.PRESENT)) {
                geometries.xlarge.short.present.push(geometry);
            } else if (child.name.startsWith(C.EXTRA_LARGE) && child.name.includes(C.SHORT) && child.name.includes(C.FUTURE)) {
                geometries.xlarge.short.future.push(geometry);
            }
        }
    })

    console.log(
        geometries[C.MEDIUM][C.SHORT][C.FUTURE].length,
        geometries[C.SMALL][C.SHORT][C.FUTURE].length,
        geometries[C.SMALL][C.SHORT][C.PRESENT].length)
    return geometries;
}