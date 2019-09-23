import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRender, useResource, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { faceCentroid, triangleFromFace } from '../../Utils/geometry';
import { CloudMaterial, TronMaterial } from '../../Utils/materials';
import { SphereTiles, tileId } from '../../Utils/SphereTiles';
import * as C from './constants';
import "./index.css";
import { Stars } from './stars';
import { pickTileFormation, SkyCityTile } from "./tiles";

/* eslint import/no-webpack-loader-syntax: off */
import fragInstanced from '!raw-loader!glslify-loader!../../Shaders/fragInstanced.glsl';
/* eslint import/no-webpack-loader-syntax: off */
import vertInstanced from '!raw-loader!glslify-loader!../../Shaders/vertInstanced.glsl';

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

var updateMatrix = function () {
    var position = new THREE.Vector3();
    const scale = new THREE.Vector3(1., 1., 1.);
    const rotation = new THREE.Euler(0, 0, THREE.Math.randFloat(-2 * Math.PI, 2 * Math.PI));
    const quaternion = new THREE.Quaternion().setFromEuler(rotation);
    return function (matrix, centroid) {
        position.x = centroid.x;
        position.y = centroid.y;
        position.z = centroid.z;
        matrix.compose(position, quaternion, scale);
    };
}();

// TODO this function needs to be passed to the SphereTileGenerator and folded into its logic somehow
export function generateWorldTileGeometries(sphereGeometry, geometries) {
    const vertices = sphereGeometry.vertices;
    const faces = sphereGeometry.faces;
    const formations = {};
    let prevFormationId = 0;
    // TODO here is a hacky version of allocating tiles by type.
    let prevTileId;
    faces.forEach((face, index) => {
        const centroid = faceCentroid(face, vertices);
        const tId = tileId(centroid);

        const triangle = triangleFromFace(face, vertices);
        formations[tId] = pickTileFormation({ triangle, centroid, geometries, prevFormationId })
        prevFormationId = formations[tId].id;
        prevTileId = tId;
    })
    // TODO hacking
    console.log(prevTileId);
    const geo = formations[prevTileId].geometry.geometry; // just need one geometry
    var igeo = new THREE.InstancedBufferGeometry();
    var posVertices = geo.attributes.position.clone();
    igeo.addAttribute('position', posVertices);
    const instanceCount = faces.length;
    var mcol0 = new THREE.InstancedBufferAttribute(
        new Float32Array(instanceCount * 3), 3
    );
    var mcol1 = new THREE.InstancedBufferAttribute(
        new Float32Array(instanceCount * 3), 3
    );
    var mcol2 = new THREE.InstancedBufferAttribute(
        new Float32Array(instanceCount * 3), 3
    );
    var mcol3 = new THREE.InstancedBufferAttribute(
        new Float32Array(instanceCount * 3), 3
    );
    var matrix = new THREE.Matrix4();
    var me = matrix.elements;
    Object.keys(formations).forEach((tId, idx) => {
        const centroid = formations[tId].centroid;
        updateMatrix(matrix, centroid);
        // for (var i = 0, ul = mcol0.count; i < ul; i++) {
        for (let j = 0; j < 2; j++) {
            let i = idx * 3 + j;
            var object = new THREE.Object3D();
            // objectCount++;
            object.applyMatrix(matrix);
            // pickingData[i + 1] = object;
            // matrices.set( matrix.elements, i * 16 );
            mcol0.setXYZ(i, me[0], me[1], me[2]);
            mcol1.setXYZ(i, me[4], me[5], me[6]);
            mcol2.setXYZ(i, me[8], me[9], me[10]);
            mcol3.setXYZ(i, me[12], me[13], me[14]);
        }
    })
    igeo.addAttribute('mcol0', mcol0);
    igeo.addAttribute('mcol1', mcol1);
    igeo.addAttribute('mcol2', mcol2);
    igeo.addAttribute('mcol3', mcol3);
    var randCol = function () {
        return Math.random();
    };
    var colors = new THREE.InstancedBufferAttribute(
        new Float32Array(instanceCount * 3), 3
    );
    for (var i = 0, ul = colors.count; i < ul; i++) {
        colors.setXYZ(i, randCol(), randCol(), randCol());
    }
    igeo.addAttribute('color', colors);
    var col = new THREE.Color();
    var pickingColors = new THREE.InstancedBufferAttribute(
        new Float32Array(instanceCount * 3), 3
    );
    for (var i = 0, ul = pickingColors.count; i < ul; i++) {
        col.setHex(i + 1);
        pickingColors.setXYZ(i, col.r, col.g, col.b);
    }
    igeo.addAttribute('pickingColor', pickingColors);
    var material = new THREE.RawShaderMaterial( {
        vertexShader: vertInstanced,
        fragmentShader: fragInstanced,
    } );
    // mesh
    var mesh = new THREE.Mesh(igeo, material);
    // return formations;
    return mesh;
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
            receiveShadow
            material-opacity={0.1}
            material-reflectivity={.1}
        />}
    </>
}

export function World({ track, buildings, ...props }) {
    const { camera, scene } = useThree();
    const [worldRef, world] = useResource();
    const tileFormations = useRef();
    const [renderTiles, setRenderTiles] = useState(true);
    const sphereGeometry = useMemo(() => {
        return generateWorldGeometry(C.WORLD_RADIUS, C.SIDES, C.TIERS, C.MAX_FACE_HEIGHT);
    }, [C.WORLD_RADIUS, C.SIDES, C.TIERS, C.MAX_FACE_HEIGHT]);
    const radius = sphereGeometry.parameters.radius
    const distThreshold = radius + radius * .15;

    useEffect(() => {
        if (buildings.loaded) {
            tileFormations.current = generateWorldTileGeometries(sphereGeometry, buildings.geometries);
        }
    }, [])

    useEffect(() => {
        if (renderTiles && track) {
            // scene.fog = track.theme.fogColor ? new THREE.FogExp2(track.theme.fogColor, 0.1) : null;
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

    console.log(tileFormations.current);
    return <group ref={worldRef}>
        {world && <>
            {/* <Stars
                radius={radius}
                colors={track.theme.starColors}
            /> */}
            {/* <WorldSurface
                geometry={sphereGeometry}
                bpm={track && track.bpm}
            /> */}
            {tileFormations.current &&
                <primitive object={tileFormations.current} />
            }
            {/* {renderTiles ?
                <SphereTiles
                    rotation={worldRef.current.rotation}
                    sphereGeometry={sphereGeometry}
                    tileComponent={SkyCityTile}
                    tileElements={{
                        buildings: buildings,
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