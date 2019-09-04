import React, { useState, useEffect, useRef } from 'react';
import { extend, useRender, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
// import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";
import { FirstPersonControls } from "three-full";
extend({ OrbitControls, TrackballControls, FirstPersonControls });


export function Controls({ dampingFactor = 0.5, rotateSpeed = 0.2, target }) {
    const controls = useRef();
    const { canvas, camera } = useThree();
    useEffect(() => {


        //     // if (target) controls.current.target.copy(target);
        // }, [target])
    }, []);
    useRender(() => { controls.current && controls.current.update() });

    return (
        <orbitControls
            ref={controls}
            args={[camera, canvas]}
            enableDamping
            dampingFactor={dampingFactor}
            rotateSpeed={rotateSpeed}
        />
    );
}

// Def not working hack/exp
export function Controls2({ target, radius }) {
    const [updated, setUpdated] = useState(false);
    const quaternion = new THREE.Quaternion();
    document.addEventListener('keydown', handleKeyPress);
    useEffect(() => {
        var qx = quaternion.x;
        var qy = quaternion.y;
        var qz = quaternion.z;
        var qw = quaternion.w;
        target.position.x = 2 * (qy * qw + qz * qx) * radius;
        target.position.y = 2 * (qz * qy - qw * qx) * radius;
        target.position.z = ((qz * qz + qw * qw) - (qx * qx + qy * qy)) * radius;
        console.log("UPDATED TARGET")
    }, [updated]);
    function handleKeyPress(f) {
        setUpdated(false);
        // console.log('press:', f);
        switch (f.key) {
            case "ArrowUp":
                quaternion.multiply(new THREE.Quaternion(Math.sin(-0.01), 0, 0, Math.cos(-0.01)));
                // console.log("ARROW UP")
                break;
            case "ArrowDown":
                // console.log("ARROW DOWN")
                quaternion.multiply(new THREE.Quaternion(Math.sin(-0.01), 0, 0, Math.cos(-0.01)));
                break;
            case "ArrowLeft":
                // console.log("ARROW LEFT")
                quaternion.multiply(new THREE.Quaternion(0, Math.sin(-0.01), 0, Math.cos(-0.01)));
                break;
            case "ArrowRight":
                // console.log("ARROW RIGHT")
                quaternion.multiply(new THREE.Quaternion(0, Math.sin(0.01), 0, Math.cos(0.01)));
                break;
        }
        // if (game.isKeyDown(37)) { // left
        //     this.quaternion.multiply(new THREE.Quaternion(0, Math.sin(-0.01), 0, Math.cos(-0.01)));
        // }

        // if (game.isKeyDown(39)) { // right
        //     this.quaternion.multiply(new THREE.Quaternion(0, Math.sin(0.01), 0, Math.cos(0.01)));
        // }

        // if (game.isKeyDown(38)) { // up
        //     this.quaternion.multiply(new THREE.Quaternion(Math.sin(-0.01), 0, 0, Math.cos(-0.01)));
        // }

        // if (game.isKeyDown(40)) { // down
        //     this.quaternion.multiply(new THREE.Quaternion(Math.sin(0.01), 0, 0, Math.cos(0.01)));
        // }
        setUpdated(true);
    }
    return <></>;



    // var qx = this.quaternion.x;
    // var qy = this.quaternion.y;
    // var qz = this.quaternion.z;
    // var qw = this.quaternion.w;
    // this.obj.position.x = 2 * (qy * qw + qz * qx) * radius;
    // this.obj.position.y = 2 * (qz * qy - qw * qx) * radius;
    // this.obj.position.z = ((qz * qz + qw * qw) - (qx * qx + qy * qy)) * radius;
}