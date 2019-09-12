import React, { useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useThree, useRender, useResource } from 'react-three-fiber';
import { faceCentroid, triangleFromFace } from '../../Utils/geometry';
import { SphereTiles, tileId } from '../../Utils/SphereTiles';
import "./index.css";
import { CloudMaterial, TronMaterial, customDepthMaterial } from '../../Utils/materials';
import { Stars } from './stars';
import { tileFormationRatios, pickTileFormation } from './tiles';
import { cryptoRandom } from '../../Utils/random';


// TODO tilt and rotationSpeed
export function generateWorldGeometry(radius, sides, tiers, maxHeight) {
    const geometry = new THREE.SphereGeometry(radius, sides, tiers);
    geometry.computeBoundingSphere();
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
    return geometry;
}

// TODO this function needs to be passed to the SphereTileGenerator and folded into its logic somehow so that 
// we aren't creating tileIds in two locations and leaving room for errors
export function generateWorldTilePatterns(sphereGeometry, surfaceGeometries) {
    const vertices = sphereGeometry.vertices;
    // const ratios = tileFormationRatios();
    // const totalFaces = sphereGeometry.faces.length;
    // Object.keys(ratios).forEach((formation, idx) => {
    //     console.log(ratios[idx])
    // })
    const faces = sphereGeometry.faces;
    const numDowntowns = 10;
    const numFaces = faces.length;
    const downtownIndices = [];
    // TODO why doesn't map work here?
    cryptoRandom(numDowntowns).forEach(randNum => {
        const randIdx = randNum % numFaces;
        const centroid = faceCentroid(faces[randIdx], vertices);
        downtownIndices.push(centroid);
    });
    const lookup = {};
    // faces.forEach((face, idx) => {
    //     const centroid = faceCentroid(face, vertices);
    //     const tId = tileId(centroid);
    //     lookup[tId] = [];
    // })
    faces.forEach((face, index) => {
        // TODO one way to pass this logic into SphereTileGenerator is to just use this part
        // but need to decide if knowledge of neighbor patterns matters (for now, no...)
        const centroid = faceCentroid(face, vertices);
        const tId = tileId(centroid);
        // downtownIndices.forEach(downtownCentroid => {
            // if (centroid.distanceTo(downtownCentroid) < sphereGeometry.parameters.radius/2) {
                // const centroid = faceCentroid(face, vertices);
                const triangle = triangleFromFace(face, vertices);
                // if (!lookup[tId].length) {
                    lookup[tId] = pickTileFormation({ triangle, centroid, geometries: surfaceGeometries })
                // }
            // }
        // })
    })
    return lookup;

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
    const [materialRef, material] = useResource();
    
    return <>
        <TronMaterial
            materialRef={materialRef}
            bpm={bpm}
            side={THREE.DoubleSide}
        />
        {material && <mesh
            geometry={geometry}
            material={material}
            // material-customDepthMaterial={customDepthMaterial(material)}
            receiveShadow
            material-opacity={0.1}
            material-reflectivity={.1}
        />}
    </>
}

export function World({ sphereGeometry, track, geometries, ...props }) {
    const { camera, scene } = useThree();
    const [worldRef, world] = useResource();
    const [tilePatternsLoaded, setTilePatternsLoaded] = useState(false);
    const [renderTiles, setRenderTiles] = useState(true);
    const radius = sphereGeometry.parameters.radius
    const distThreshold = radius + radius * .15;


    // useEffect(() => {
    //     // TODO the tileElement data structure needs to be generated at this level rather than in scene
    //     if (renderTiles) {
    //         props.tileElements.lookup = generateWorldTilePatterns(sphereGeometry, geometries);
    //         console.log("SETIT UP", props.tileElements.lookup)
    //         setTilePatternsLoaded(true);
    //     }
    // }, [tilePatternsLoaded]);
    useEffect(() => {
        if (renderTiles && track) {
            scene.fog = track.theme.fogColor ? new THREE.FogExp2(track.theme.fogColor, 0.1) : null;
            scene.background = new THREE.Color(track.theme.backgroundColor);
        }
    }, [track])
    useRender((state, time) => {
        if ((time % .5).toFixed(1) == 0) {
            const distToCenter = camera.position.distanceTo(sphereGeometry.boundingSphere.center);
            const tooFarAway = distToCenter > distThreshold;
            setRenderTiles(!tooFarAway);
        }
    })
    useRender(() => {
        // if (worldRef.current) {
        //     worldRef.current.rotation.x += .001;
        // } 
    })
    return <group ref={worldRef}>
        {world && <>
            <Stars
                radius={radius}
                colors={track.theme.starColors}
            />
            <WorldSurface
                geometry={sphereGeometry}
                bpm={track && track.bpm}
            />
            {renderTiles ?
                <SphereTiles
                    rotation={worldRef.current.rotation}
                    sphereGeometry={sphereGeometry}
                    {...props}
                />
                :
                <AtmosphereGlow
                    radius={distThreshold - .2}
                />
            }
        </>
        }
    </group>
}