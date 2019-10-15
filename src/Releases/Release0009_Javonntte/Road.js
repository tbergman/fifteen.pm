import React, { useRef, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useRender, useResource, useThree } from 'react-three-fiber';
import { CloudMaterial } from '../../Utils/materials';


export default function Road({ curCamera, closed, scale, extrusionSegments, radius, radiusSegments, offset, numSteps }) {

    const [lastUpdateTime, setLastUpdateTime] = useState(0);
    const [approachingEnd, setApproachingEnd] = useState(false);
    const [generatingRoad, setGeneratingRoad] = useState(false);
    const road = useRef();
    const nextSection = useRef();
    const steps = useRef();
    const step = useRef();
    const [cloudMaterialRef, cloudMaterial] = useResource();
    const normal = new THREE.Vector3();//0, 0, 0);
    const binormal = new THREE.Vector3();//0, 1, 0);

    useEffect(() => {
        const nextSteps = [];
        const steps = [
            new THREE.Vector3(0, - 40, - 40),
            new THREE.Vector3(0, 40, - 40),
            new THREE.Vector3(0, 140, - 40),
            new THREE.Vector3(0, 40, 40),
            new THREE.Vector3(0, - 40, 40)
        ];
        var closedSpline = new THREE.CatmullRomCurve3(steps);
        closedSpline.closed = true;
        closedSpline.curveType = 'catmullrom';
        const tubeGeometry = new THREE.TubeBufferGeometry(closedSpline, extrusionSegments, radius, radiusSegments, closed);
        road.current = tubeGeometry;
    }, [])


    // useEffect(() => {
    //     if (approachingEnd) {
    //         road.current = nextSection.current;
    //         nextSection.current = undefined;
    //         setApproachingEnd(false)
    //     }
    // }, [approachingEnd])

    // Drive camera along road
    // let shouldRenderNextSection = true;
    // let shouldSwapSections = true;
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
        curCamera.rotation.setFromRotationMatrix(curCamera.matrix);//, camera.rotation.order);
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
        {/* {React.cloneElement(props.children, {...props})} */}

        {/* {nextSection.current &&
            <mesh
                geometry={nextSection.current}
                material={cloudMaterial}
                scale={[scale, scale, scale]}
            />
        } */}
    </>
}