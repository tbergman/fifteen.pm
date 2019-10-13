import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useRender, useResource, useThree } from 'react-three-fiber';
import { CloudMaterial } from '../../Utils/materials';


export function Road({ scale, extrusionSegments, radius, radiusSegments, closed, loopTime, offset, ...props }) {
    console.log("extra road PROPS", props)
    const { camera } = useThree();
    const road = useRef();
    const [cloudMaterialRef, cloudMaterial] = useResource();
    const normal = new THREE.Vector3(0, 0, 0);
    const binormal = new THREE.Vector3(0, 1, 0);

    useEffect(() => {
        var closedSpline = new THREE.CatmullRomCurve3(props.centroids);
        const tubeGeometry = new THREE.TubeBufferGeometry(closedSpline, extrusionSegments, radius, radiusSegments, closed);
        road.current = tubeGeometry;
    })

    // Drive camera along road
    useRender((state, time) => {
        if (!road.current) return;
        var t = (time % loopTime) / loopTime;
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
        camera.position.copy(pos);
        // Using arclength for stablization in look ahead.
        var lookAt = road.current.parameters.path.getPointAt((t + 30 / road.current.parameters.path.getLength()) % 1).multiplyScalar(scale);
        // Camera Orientation 2 - up orientation via normal
        lookAt.copy(pos).add(dir);
        camera.matrix.lookAt(camera.position, lookAt, normal);
        camera.rotation.setFromRotationMatrix(camera.matrix, camera.rotation.order);
    })

    return <>
        <CloudMaterial materialRef={cloudMaterialRef} emissive={0xd4af37} />
        {cloudMaterialRef &&
            <mesh
                geometry={road.current}
                material={cloudMaterial}
                scale={[scale, scale, scale]}
            />
        }
    </>
}