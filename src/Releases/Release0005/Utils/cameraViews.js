import * as THREE from "three";

function getView1(camera) {
    camera.position.x = -25;
    camera.position.z = 17;
    camera.fov = 60;

    this.isView1 = true;
    return camera;
}

function getView2(camera) {
    camera.position.x = 10;
    camera.position.z = 17;
    camera.fov = 60;

    this.isView1 = true;
    return camera;
}

function getView3(camera) {
    camera.position.x = 50;
    camera.position.z = 17;
    camera.rotation.x = Math.sin(0.2);
    //camera.rotation.y = -1;
    camera.fov = 60;

    this.isView1 = true;
    return camera;
}

function getView4(camera) {
    camera.position.x = 7;
    camera.rotation.y = Math.sin(0.6);
    camera.position.z = 10;
    camera.fov = 60;
    this.isView1 = false;
}

function getView5(camera) {
    camera.position.x = 0;
    camera.rotation.x = Math.tan(0.6);
    camera.position.z = 500;
    camera.fov = 60;
    this.isView1 = false;
    return camera;
}

function getView6(camera) {
    camera.position.x = 0;
    // camera.rotation.y = Math.PI / 2;
    camera.position.z = 10;
    camera.position.y = 20;
    camera.lookAt(new THREE.Vector3());
    camera.fov = 8;
    this.isView1 = false;
    return camera;
}

function getView7(camera) {
    camera.position.x = 0;
    camera.position.z = 0;
    camera.position.y = 4500;
    camera.lookAt(new THREE.Vector3());
    camera.fov = 100;
    this.isView1 = false;
    return camera;
}

export const cameraViews = [
    getView1,
    getView2,
    // getView3,
    // getView4,
    // getView5,
    // getView6,
    // getView7,
];