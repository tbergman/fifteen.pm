import * as THREE from "three";

function getView1(camera) {
    camera.position.x = 0;
    // camera.rotation.y = Math.PI / 2;
    camera.position.z = -10;
    camera.position.y = 10;
    camera.lookAt(new THREE.Vector3());
    camera.fov = 60;
    this.isView1 = false;
    return camera;

}

function getView2(camera) {
    camera.position.set(-15.5, 2.9, 5.7);

    camera.rotation.x = -0.15;
    camera.rotation.y = -1;
    camera.rotation.z = -0.14;
    camera.fov = 60;

    this.isView1 = true;
    return camera;
}

function getView3(camera) {
    camera.position.set(-6.5, 2.9, 5.7);

    camera.rotation.x = -0.14;
    camera.rotation.y = -1.1;
    camera.rotation.z = -0.14;
    camera.fov = 60;

    this.isView1 = true;
    return camera;
}

function getView4(camera) {
    camera.position.set(-12.5, 2.9, -14.7);

    camera.rotation.x = 1;
    camera.rotation.y = -0.9;
    camera.rotation.z = -0.14;
    camera.fov = 60;

    this.isView1 = true;
    return camera;
}

function getView5(camera) {
    camera.position.set(-5.5, 1.3, 19.7);

    camera.rotation.x = 0;
    camera.rotation.y = -0.5;
    camera.rotation.z = 0;
    camera.fov = 60;

    this.isView1 = true;
    return camera;
}

function getView6(camera) {
    camera.position.x = 0;
    // camera.rotation.y = Math.PI / 2;
    camera.position.z = -1;
    camera.position.y = 10;
    camera.lookAt(new THREE.Vector3());
    camera.fov = 16;
    this.isView1 = false;
    return camera;
}

// function getView7(camera) {
//     camera.position.set(-1.5, 0.3, 2.1);
//
//     camera.rotation.x = 0;
//     camera.rotation.y = 0.04;
//     camera.rotation.z = 0;
//     camera.fov = 60;
//
//     this.isView1 = true;
//     return camera;
// }

function getView7(camera) {
    camera.position.set(-1.5, 1.3, 5.1);

    camera.rotation.x = 0;
    camera.rotation.y = 0.04;
    camera.rotation.z = 0;
    camera.fov = 60;

    this.isView1 = true;
    return camera;
}

// really nice closeup
// camera.position.x = 0;
// // camera.rotation.y = Math.PI / 2;
// camera.position.z = -10;
// camera.position.y = 10;
// camera.lookAt(new THREE.Vector3());
// camera.fov = 60;
// this.isView1 = false;
// return camera;

export const cameraViews = [
    getView1,
    getView2,
    getView3,
    //getView4,
    getView5,
    getView6,
    getView7,
];