import React from 'react';

export function buildingName(building, position) {
    return [building.name,
    position.x,
    position.y,
    position.z,
    ].join("_")
}

export function Building({ geometry, centroid, normal, color, visible }) {
    // TODO getting the buildings to sit on the curve properly will work with use of 'Spherical'
    return <>
        <mesh
            onUpdate={self => {
                self.lookAt(normal)
                self.visible = visible
            }}
            geometry={geometry}
            position={centroid}
        // lookAt={normal} // TODO dunno if this is working
        >
            <meshBasicMaterial attach="material" color={color} />
        </mesh>
    </>
}

export function onBuildingsLoaded(gltf) {
    const geometries = {
        mid: [],
        wide: [],
        narrow: []
    }
    gltf.scene.traverse(child => {
        if (child.isMesh) {
            // child.geometry.center();
            // child.position.set(0, 0, 0);//new THREE.Vector3(0, 0, 0);
            const geometry = child.geometry.clone();
            // this makes the 'lookAt(normal)' easier to use later on by flipping the default blender output for expected placement on the sphere
            // geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI));
            if (child.name.startsWith("MID")) {
                geometries.mid.push(geometry);
            } else if (child.name.startsWith("WIDE")) {
                geometries.wide.push(geometry);
            } else if (child.name.startsWith("NARROW")) {
                geometries.narrow.push(geometry);
            }
        }
    })
    return geometries;
}