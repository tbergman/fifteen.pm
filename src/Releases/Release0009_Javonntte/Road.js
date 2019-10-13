import React, { useRef, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useRender, useResource, useThree } from 'react-three-fiber';
import { CloudMaterial } from '../../Utils/materials';


function nextStep(curStep, stepSize) {
    const stepVec = new THREE.Vector3(0, 0, stepSize);
    // stepVec.y = (Math.random() - .5) * stepSize;
    if (Math.random() - .5 > 0) stepVec.x += stepSize;
    else stepVec.x -= stepSize;
    return curStep.clone().addVectors(curStep, stepVec);
}

function buildPath({ startPos, stepSize, numPathSteps }) {
    const prevStep = startPos.clone();
    const steps = [prevStep.clone()]
    for (let i = 0; i < numPathSteps; i++) {
        const step = nextStep(prevStep, stepSize);
        steps.push(step);
        prevStep.copy(step);
    }
    return steps;
}

export default function Road({ tubeProps: { scale, extrusionSegments, radius, radiusSegments, closed, offset }, ...props }) {

    const { camera } = useThree();
    const stepSize = 10;
    const numPathSteps = 20;
    const numSteps = 20000;
    // const threshold = numSteps * stepSize * .9; // TODO naming and pass val in as prop

    const [lastUpdateTime, setLastUpdateTime] = useState(0);
    const [generatingRoad, setGeneratingRoad] = useState(false);
    const road = useRef();
    const steps = useRef();
    const step = useRef();
    const [cloudMaterialRef, cloudMaterial] = useResource();
    const normal = new THREE.Vector3(0, 0, 0);
    const binormal = new THREE.Vector3(0, 1, 0);
    const boundary = useRef({ x: 0, z: 0 }); // trigger tile generation on load

    function shouldAddRoad() {
        if (!steps.current) return true;
        if (generatingRoad) return false;
        const prevPos = boundary.current;
        const curPos = camera.position;
        const xMove = Math.abs(curPos.x - prevPos.x);
        const zMove = Math.abs(curPos.z - prevPos.z);
        return xMove >= threshold || zMove >= threshold;
    }

    useEffect(() => {
        // boundary.current = { x: camera.position.x, z: camera.position.z };
        const startPos = steps.current ? steps.current[steps.current.length - 1] : camera.position;
        steps.current = buildPath({ startPos, stepSize, numPathSteps })
        console.log("ADD ROAD w", steps.current)
        var closedSpline = new THREE.CatmullRomCurve3(steps.current);
        const tubeGeometry = new THREE.TubeBufferGeometry(closedSpline, extrusionSegments, radius, radiusSegments, closed);
        road.current = tubeGeometry;
        setGeneratingRoad(false);
    }, [generatingRoad])

    // Drive camera along road
    useRender((state, time) => {
        // if (!step.current) step.current = 0;
        // var timeN = Date.now(); 
        var t = (time % numSteps) / numSteps;
        if (t == 1 && !generatingRoad) {
            console.log("GENERATING ROAD")
        //     setGeneratingRoad(true);
        //     t = 0;
        }
        var pos = road.current.parameters.path.getPointAt(t);
        // console.log('pos on road', pos, 'cam pos', camera.position);
        pos.multiplyScalar(scale);
        // interpolation
        var segments = road.current.tangents.length;
        var pickt = t * segments;
        var pick = Math.floor(pickt);
        var pickNext = (pick + 1) % segments;
        console.log("t", t, 'pickNext', pickNext, 'pick', pick, 'pickt', pickt, 'num segs', segments)
        binormal.subVectors(road.current.binormals[pickNext], road.current.binormals[pick]);
        binormal.multiplyScalar(pickt - pick).add(road.current.binormals[pick]);
        var dir = road.current.parameters.path.getTangentAt(t);
        normal.copy(binormal).cross(dir);
        // We move on a offset on its binormal
        pos.add(normal.clone().multiplyScalar(offset));
        // console.log("POS IS NOW", pos)
        camera.position.copy(pos);
        // Using arclength for stablization in look ahead.
        // var lookAt = road.current.parameters.path.getPointAt((step.current + 1) / numSteps).multiplyScalar(scale);
        var lookAt = road.current.parameters.path.getPointAt((t + 30 / road.current.parameters.path.getLength()) % 1).multiplyScalar(scale);
        // Camera Orientation 2 - up orientation via normal
        lookAt.copy(pos).add(dir);
        camera.matrix.lookAt(camera.position, lookAt, normal);
        camera.rotation.setFromRotationMatrix(camera.matrix, camera.rotation.order);
        // if (step.current == numSteps) step.current = 0;
        // else step.current += 1;
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