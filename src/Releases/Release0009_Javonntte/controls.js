import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { extend, useRender, useThree } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import { isMobile } from '../../Utils/BrowserDetection';

extend({ OrbitControls, FlyControls });

// function getAngle(position) {
//     // get the 2Dtangent to the curve
//     var tangent = path.getTangent(position).normalize();
//     // change tangent to 3D
//     const angle = - Math.atan(tangent.x / tangent.y);
//     return angle;
// }

// function move() {
//     // add up to position for movement
//     position += 0.001;
//     // get the point at position
//     var point = path.getPointAt(position);
//     mesh.position.x = point.x;
//     mesh.position.y = point.y;
//     var angle = getAngle(position);
//     // set the quaternion
//     mesh.quaternion.setFromAxisAngle(up, angle);
//     mesh2.position.x += (point.x - previousPoint.x);
//     mesh2.position.y += (point.y - previousPoint.y);
//     // set the quaternion
//     mesh2.rotation.z += (angle - previousAngle);
//     previousPoint = point;
//     previousAngle = angle;
// }


export function Controls({ radius, road, ...props }) {
    const controls = useRef();
    const { camera } = useThree();
    // const position = useRef();
    // const delta = useRef();
    // useEffect(() => {
    //     position.current = 0;
    //     delta.current = .001;
    // })
    // var up = new THREE.Vector3(0, 0, 1);
    const delta = .001;
    useRender(() => { controls.current && controls.current.update(delta) });
    useRender(() => {
        // if (position.current == undefined) return;
        // const roadCurve = road.parameters.shapes.curves[0];
        // if (position.current == 0) {
        //     position.current = roadCurve.getPointAt(0);
        // } else {
        //     position.current += delta.current;
        // }
        // console.log('road curve', roadCurve, 'position', position);
        // var point = roadCurve.getPointAt(position);
        // console.log(point);
        // camera.position.copy(point);
        // // get the 2Dtangent to the curve
        // var tangent = roadCurve.getTangent(position).normalize();
        // // change tangent to 3D
        // const angle = - Math.atan(tangent.x / tangent.y);
        // // set the quaternion
        // camera.quaternion.setFromAxisAngle(up, angle);
        // console.log(camera.position)
        // animate camera along spline
        // var time = Date.now();
        // var looptime = 20 * 1000;
        // var t = (time % looptime) / looptime;
        // console.log(road)
        // const roadCurve = road.parameters.shapes.curves[0];
        // var pos = roadCurve.getPointAt(t);
        // // pos.multiplyScalar(params.scale);
        // // // interpolation
        // var segments = roadCurve.arcLengthDivision;//tubeGeometry.tangents.length;
        // var pickt = t * segments;
        // var pick = Math.floor(pickt);
        // var pickNext = (pick + 1) % segments;
        // binormal.subVectors(tubeGeometry.binormals[pickNext], tubeGeometry.binormals[pick]);
        // binormal.multiplyScalar(pickt - pick).add(tubeGeometry.binormals[pick]);
        // var dir = tubeGeometry.parameters.path.getTangentAt(t);
        // var offset = 15;
        // normal.copy(binormal).cross(dir);
        // // we move on a offset on its binormal
        // pos.add(normal.clone().multiplyScalar(offset));
        // splineCamera.position.copy(pos);
        // cameraEye.position.copy(pos);
        // // using arclength for stablization in look ahead
        // var lookAt = tubeGeometry.parameters.path.getPointAt((t + 30 / tubeGeometry.parameters.path.getLength()) % 1).multiplyScalar(params.scale);
        // // camera orientation 2 - up orientation via normal
        // if (!params.lookAhead) lookAt.copy(pos).add(dir);
        // splineCamera.matrix.lookAt(splineCamera.position, lookAt, normal);
        // splineCamera.quaternion.setFromRotationMatrix(splineCamera.matrix);
        // cameraHelper.update();
        // renderer.render(scene, params.animationView === true ? splineCamera : camera);
    })
    return (
        isMobile ?
            <orbitControls
                ref={controls}
                args={[camera]}
                {...props}
            />
            :
            <flyControls
                ref={controls}
                args={[camera]}
                {...props}
            />
    );
}