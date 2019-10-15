import React, { useEffect, useRef, useState } from 'react';
import { useRender, useResource } from 'react-three-fiber';
import * as THREE from 'three';
import { CloudMaterial } from '../../Utils/materials';
import * as C from './constants';

export default function Road({ curCamera, closed, scale, extrusionSegments, radius, radiusSegments, offset, numSteps }) {

    const road = useRef();
    const [cloudMaterialRef, cloudMaterial] = useResource();
    const normal = new THREE.Vector3();
    const binormal = new THREE.Vector3();

    useEffect(() => {
        const elevationOffset = 10;
        const maxElevation = elevationOffset + C.WORLD_RADIUS;
        const steps = [
            // new THREE.Vector3(0, -maxElevation, -maxElevation),
            // new THREE.Vector3(0, maxElevation, -maxElevation),
            // new THREE.Vector3(0, maxElevation, maxElevation),
            // new THREE.Vector3(0, -maxElevation, maxElevation),
            new THREE.Vector3(-maxElevation, 0, -maxElevation),
            new THREE.Vector3(maxElevation, 0, -maxElevation),
            new THREE.Vector3(maxElevation, 0,  maxElevation),
            new THREE.Vector3(-maxElevation, 0,  maxElevation),
        ];
        var closedSpline = new THREE.CatmullRomCurve3(steps);
        closedSpline.closed = true;
        closedSpline.curveType = 'catmullrom';
        const tubeGeometry = new THREE.TubeBufferGeometry(closedSpline, extrusionSegments, radius, radiusSegments, closed);
        console.log(tubeGeometry);
        
        road.current = tubeGeometry;
    }, [])

    useRender((state, time) => {
        var t = (time % numSteps) / numSteps;
        // console.log(t)
        var pos = road.current.parameters.path.getPointAt(t);
        pos.multiplyScalar(scale);
        // interpolation
        var segments = road.current.tangents.length;
        var pickt = t * segments;
        var pick = Math.floor(pickt);
        var pickNext = (pick + 1) % segments;
        binormal.subVectors(road.current.binormals[pickNext], road.current.binormals[pick]);
        binormal.multiplyScalar(pickt - pick).add(road.current.binormals[pick]);
        var dir = road.current.parameters.path.getTangentAt(t);
        normal.copy(binormal).cross(dir);
        // We move on a offset on its binormal
        pos.add(normal.clone().multiplyScalar(offset));
        curCamera.position.copy(pos);
        // console.log(pos, camera.position)
        // Using arclength for stablization in look ahead.
        var lookAt = road.current.parameters.path.getPointAt((t + 30 / road.current.parameters.path.getLength()) % 1).multiplyScalar(scale);
        // Camera Orientation 2 - up orientation via normal
        lookAt.copy(pos).add(dir);
        curCamera.matrix.lookAt(curCamera.position, lookAt, normal);
        curCamera.rotation.setFromRotationMatrix(curCamera.matrix);
        curCamera.rotation.z -= Math.PI / 2; // TODO added code - can it be baked into matrix rotation?
        
        
    })

    // if (road.current) console.log('road array idx 0:', road.current.attributes.position.array[0])
    return <>
        <CloudMaterial materialRef={cloudMaterialRef} emissive={0xd4af37} />
        {cloudMaterialRef && road.current &&
            <mesh
                geometry={road.current}
                material={cloudMaterial}
                scale={[scale, scale, scale]}
            />
        }
    </>
}