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
    const stepSize = 100;
    const numPathSteps = 10;
    const numSteps = 20000;
    // const threshold = numSteps * stepSize * .9; // TODO naming and pass val in as prop

    const [lastUpdateTime, setLastUpdateTime] = useState(0);
    const [generatingRoad, setGeneratingRoad] = useState(false);
    const curSection = useRef();
    const nextSection = useRef();
    const steps = useRef();
    const step = useRef();
    const [cloudMaterialRef, cloudMaterial] = useResource();
    const normal = new THREE.Vector3(0, 0, 0);
    const binormal = new THREE.Vector3(0, 1, 0);

    useEffect(() => {
        // boundary.current = { x: camera.position.x, z: camera.position.z };
        const nextSteps = [];
        if (steps.current){
            nextSteps.push(steps.current[steps.current.length - 2]);
            nextSteps.push(steps.current[steps.current.length - 1]);
        } else {
            nextSteps.push(camera.position);
        }
        const startPos = nextSteps[nextSteps.length - 1];
        nextSteps.push(...buildPath({ startPos, stepSize, numPathSteps }));
        steps.current = nextSteps;
        console.log("ADD ROAD w", steps.current)
        var closedSpline = new THREE.CatmullRomCurve3(steps.current);
        const tubeGeometry = new THREE.TubeBufferGeometry(closedSpline, extrusionSegments, radius, radiusSegments, closed);
        if (!curSection.current) curSection.current = tubeGeometry;
        else nextSection.current = tubeGeometry;
        setGeneratingRoad(false);
    }, [generatingRoad])

    // Drive camera along road
    useRender((state, time) => {
        var t = (time % numSteps) / numSteps;
        if (!curSection.current || (t >= .2 && !generatingRoad && !nextSection.current)) {
            console.log("GENERATING ROAD")
            setGeneratingRoad(true);
        }
        if (t >= .9 && nextSection.current) {
            console.log("SETTING NEXT ROAD SECTION")
            curSection.current = nextSection.current;
            nextSection.current = undefined;
            t = 2 / steps.current.length;
        }
        var pos = curSection.current.parameters.path.getPointAt(t);
        // console.log('pos on road', pos, 'cam pos', camera.position);
        pos.multiplyScalar(scale);
        // interpolation
        var segments = curSection.current.tangents.length;
        var pickt = t * segments;
        var pick = Math.floor(pickt);
        var pickNext = (pick + 1) % segments;
        // console.log("t", t, 'pickNext', pickNext, 'pick', pick, 'pickt', pickt, 'num segs', segments)
        binormal.subVectors(curSection.current.binormals[pickNext], curSection.current.binormals[pick]);
        binormal.multiplyScalar(pickt - pick).add(curSection.current.binormals[pick]);
        var dir = curSection.current.parameters.path.getTangentAt(t);
        normal.copy(binormal).cross(dir);
        // We move on a offset on its binormal
        pos.add(normal.clone().multiplyScalar(offset));
        // console.log("POS IS NOW", pos)
        camera.position.copy(pos);
        // Using arclength for stablization in look ahead.
        // var lookAt = road.current.parameters.path.getPointAt((step.current + 1) / numSteps).multiplyScalar(scale);
        var lookAt = curSection.current.parameters.path.getPointAt((t + 30 / curSection.current.parameters.path.getLength()) % 1).multiplyScalar(scale);
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
        {cloudMaterialRef && curSection.current &&
            <mesh
                geometry={curSection.current}
                material={cloudMaterial}
                scale={[scale, scale, scale]}
            />
        }
        {nextSection.current &&
            <mesh
                geometry={nextSection.current}
                material={cloudMaterial}
                scale={[scale, scale, scale]}
            />
        }
    </>
}