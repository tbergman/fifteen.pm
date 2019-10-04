import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRender, useResource, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { CloudMaterial, Ground29Material, TronMaterial } from '../../Utils/materials';
import { SphereTiles } from '../../Utils/SphereTiles';
import * as C from './constants';
import "./index.css";
import { Stars } from './stars';
import { generateInstanceGeometries as generateInstanceGeometries } from "./instances";

// TODO tilt and rotationSpeed
export function generateWorldGeometry(radius, sides, tiers, maxHeight) {
    const geometry = new THREE.SphereGeometry(radius, sides, tiers);
    // variate sphere heights
    var vertexIndex;
    var vertexVector = new THREE.Vector3();
    var nextVertexVector = new THREE.Vector3();
    var firstVertexVector = new THREE.Vector3();
    var offset = new THREE.Vector3();
    var currentTier = 1;
    var lerpValue = 0.5;
    var heightValue;
    for (var j = 1; j < tiers - 2; j++) {
        currentTier = j;
        for (var i = 0; i < sides; i++) {
            vertexIndex = (currentTier * sides) + 1;
            vertexVector = geometry.vertices[i + vertexIndex].clone();
            if (j % 2 !== 0) {
                if (i == 0) {
                    firstVertexVector = vertexVector.clone();
                }
                nextVertexVector = geometry.vertices[i + vertexIndex + 1].clone();
                if (i == sides - 1) {
                    nextVertexVector = firstVertexVector;
                }
                lerpValue = (Math.random() * (0.75 - 0.25)) + 0.25;
                vertexVector.lerp(nextVertexVector, lerpValue);
            }
            heightValue = (Math.random() * maxHeight) - (maxHeight / 2);
            offset = vertexVector.clone().normalize().multiplyScalar(heightValue);
            geometry.vertices[i + vertexIndex] = (vertexVector.add(offset));
        }
    }
    geometry.verticesNeedUpdate = true;
    geometry.computeBoundingSphere();
    return geometry;
}

function AtmosphereGlow({ radius }) {
    const geometry = useMemo(() => new THREE.SphereGeometry(radius, radius / 3, radius / 3))
    const [materialRef, material] = useResource();
    return <>
        <CloudMaterial materialRef={materialRef} />
        {material && <mesh
            geometry={geometry}
            material={material}
        />}
    </>
}

export function WorldSurface({ geometry, bpm }) {
    const [tronMaterialRef, tronMaterial] = useResource();
    const [ground29MaterialRef, ground29Material] = useResource();
    return <>
        <TronMaterial
            materialRef={tronMaterialRef}
            bpm={bpm}
            side={THREE.BackSide}
        />
        <Ground29Material
            materialRef={ground29MaterialRef}
            side={THREE.FrontSide}
        />
        {tronMaterial && ground29Material &&
            <group>
                <mesh
                    geometry={geometry}
                    material={tronMaterial}
                // material-opacity={0.1}
                // material-reflectivity={.1}
                />
                <mesh
                    geometry={geometry}
                    material={ground29Material}
                // receiveShadow
                // material-opacity={0.1}
                // material-reflectivity={.1}
                />
            </group>
        }
    </>
}

export function World({ track, buildings, ...props }) {
    const { camera, scene } = useThree();
    const [worldRef, world] = useResource();
    const [curTrackName, setCurTrackName] = useState();
    const tileFormations = useRef();
    const [renderTiles, setRenderTiles] = useState(true);
    const sphereGeometry = useMemo(() => {
        //numStartingPoints, neighborhoodSize, neighborhoodRadius;
        return generateWorldGeometry(
            C.WORLD_RADIUS,
            C.SIDES,
            C.TIERS,
            C.MAX_WORLD_FACE_HEIGHT,
        );
    });
    

    useEffect(() => {
        if (buildings.loaded) {
            tileFormations.current = generateInstanceGeometries(sphereGeometry, buildings, C.NEIGHBORHOOD_PROPS);
        }
    }, [])

    useEffect(() => {
        if (track.current) {
            track.current && setCurTrackName(track.current.name)
        }
    })

    // TODO use state for cur track here
    useEffect(() => {
        // if (track.current) {
            // scene.fog = track.theme.fogColor ? new THREE.FogExp2(track.theme.fogColor, 0.1) : null;
            // scene.background = new THREE.Color(track.current.theme.backgroundColor);

        // }
    }, [curTrackName])


    useRender(() => {
        if (worldRef.current) {
            // worldRef.current.rotation.x += .001;
        } 
    })

    return <group ref={worldRef}>
        {world && <>
            <WorldSurface
                geometry={sphereGeometry}
                bpm={track && track.bpm}
            />
            {tileFormations.current &&
                Object.keys(tileFormations.current).map(tId => {
                    return <primitive key={tId}
                        object={tileFormations.current[tId]}
                    />
                })
            }
            {/* {renderTiles ?
                <SphereTiles
                    rotation={worldRef.current.rotation}
                    sphereGeometry={sphereGeometry}
                    tileComponent={SkyCityTile}
                    tileElements={{
                       // buildings: buildings // TODO
                        formations: tileFormations.current,
                    }}
                    {...props}
                />
                :
                <AtmosphereGlow
                    radius={distThreshold - .2}
                />
            } */}
        </>
        }
    </group>
}