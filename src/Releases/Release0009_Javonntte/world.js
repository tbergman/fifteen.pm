import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRender, useResource, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { CloudMaterial, Ground29Material, TronMaterial } from '../../Utils/materials';
import { SphereTiles } from '../../Utils/SphereTiles';
import * as C from './constants';
import "./index.css";
import { Stars } from './stars';
import { generateInstanceGeometriesByName, generateInstancedTilesOnGrid } from "./instances";
import InfiniteTiles from '../../Utils/InfiniteTiles';
import { SkyCityTile } from './tiles';
import { cloneDeep } from 'lodash';
import Road from './Road';

function forwardStep(curStep, stepSize) {
    const stepVec = new THREE.Vector3(0, 0, stepSize);
    // stepVec.y = (Math.random() - .5) * stepSize;
    if (Math.random() - .5 > 0) stepVec.x += stepSize;
    else stepVec.x -= stepSize;
    return curStep.clone().addVectors(curStep, stepVec);
}

function backStep(step, stepSize, index) {
    const stepVec = new THREE.Vector3();
    stepVec.x = step.x - stepSize;
    stepVec.y = 0;//Math.random() - .5 * stepSize;
    stepVec.z = step.z;// * Math.random() * 1.5;
    return stepVec;
}

function buildPath({ startPos, stepSize, numPathSteps }) {
    const prevStep = startPos.clone();
    const steps = [prevStep.clone()]
    for (let i = 0; i < numPathSteps / 2; i++) {
        const forward = forwardStep(prevStep, stepSize);
        steps.push(forward);
        prevStep.copy(forward);

    }
    for (let i = steps.length - 1; i > 2; i--) {
        const back = backStep(steps[i], stepSize, i);
        steps.push(back);
    }
    console.log("NUM STEPS", steps.length)
    return steps;
}

// TODO tilt and rotationSpeed
// https://github.com/mrdoob/three.js/blob/master/examples/js/math/ConvexHull.js
export function generateSphereWorldGeometry(radius, sides, tiers, maxHeight) {
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
    geometry.computeBoundingBox();
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
            color={0x0000af}
        />
        {tronMaterial && ground29Material &&
            <group>
                {/* <mesh
                    geometry={geometry}
                    material={tronMaterial}
                /> */}
                <mesh
                    geometry={geometry}
                    material={ground29Material}
                    receiveShadow
                />
            </group>
        }
    </>
}

export function SphereWorld({ track, buildings, ...props }) {
    const { camera, scene } = useThree();
    const [worldRef, world] = useResource();
    const [curTrackName, setCurTrackName] = useState();
    const outerTileInstances = useRef();
    const [renderTiles, setRenderTiles] = useState(true);
    const sphereGeometry = useMemo(() => {
        return generateSphereWorldGeometry(
            C.WORLD_RADIUS,
            C.SIDES,
            C.TIERS,
            C.MAX_WORLD_FACE_HEIGHT,
        );
    });


    useEffect(() => {
        if (buildings.loaded) {
            console.log('buildings going in', buildings)
            // TODO this is the naive approach but we need to combine alike geometries from both spheres at the time of instancing to reduce draw calls.
            outerTileInstances.current = generateInstanceGeometriesByName({ surfaceGeometry: sphereGeometry, buildings, neighborhoodProps: C.NEIGHBORHOOD_PROPS });
            
            // innerTileInstances.current = generateInstanceGeometriesTileSet({ surfaceGeometry: innerSphereGeometry, buildings, ...C.NEIGHBORHOOD_PROPS })
        }
    }, [])

    useEffect(() => {
        if (worldRef){
            worldRef.current.rotation.z -= Math.PI;
        }        
        // if (track.current) {
        //     track.current && setCurTrackName(track.current.name)
        // }
    })

    // TODO use state for cur track here
    useEffect(() => {
        // if (track.current) {
        // scene.fog = track.theme.fogColor ? new THREE.FogExp2(track.theme.fogColor, 0.1) : null;
        // }
    }, [curTrackName])


    useRender(() => {
        if (worldRef.current) {
            // worldRef.current.rotation.x += .001;
        }
    })

    return <group ref={worldRef}>
        {world && <>
            {/* <WorldSurface
                geometry={innerSphereGeometry}
                bpm={track && track.bpm}
            /> */}
            {/* // Half face data structure for path creation? https://github.com/mrdoob/three.js/blob/master/examples/js/math/ConvexHull.js */}
            <WorldSurface
                geometry={sphereGeometry}
                bpm={track && track.bpm}
            />
            {outerTileInstances.current &&
                Object.keys(outerTileInstances.current).map(instanceName => {
                    return <primitive key={instanceName}
                        object={outerTileInstances.current[instanceName]}
                    />
                })
            }
            {/* {innerTileFormations.current &&
                Object.keys(innerTileFormations.current).map(instanceName => {
                    return <primitive key={instanceName}
                        object={innerTileFormations.current[instanceName]}
                    />
                })
            } */}
            {/* <AtmosphereGlow
                    // radius={distThreshold - .2}
                /> */}
        </>
        }
    </group>
}


function InfiniteTilesTemp({ ...props }) {
    const [inNextGrid, setInNextGrid] = useState();

    return <group>
        {React.cloneElement(props.children, { ...props })}
    </group>
}

