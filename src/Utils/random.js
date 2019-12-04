import * as THREE from 'three';
import { cloneDeep } from 'lodash';


export function cryptoRandom(arrayLength) {
    const pickFromArray = new Uint32Array(arrayLength);
    return window.crypto.getRandomValues(pickFromArray);
}


export function randomArrayVal(array) {
    const randInt = THREE.Math.randInt(0, array.length - 1);
    return array[randInt];
}

/**
* Shuffles array in place. ES6 version
* https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
* @param {Array} a items An array containing the items.
*/
export function shuffleArray(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}


export function selectNRandomFromArray(arr, numElts, canShuffleArray=true) {
    let newArr = [];
    if (arr.length < numElts) {
        for (let i = 0; i < numElts - arr.length; i++) {
            newArr.push(arr[THREE.Math.randInt(0, arr.length - 1)])
        }
        arr.push(...newArr);
    }
    // more performant to allow shuffling
    const shuffleArr = canShuffleArray ? arr : cloneDeep(arr);
    const shuffled = shuffleArray(shuffleArr);
    if (shuffled.length > numElts) {
        return shuffled.slice(0, numElts);
    } else {
        return shuffled;
    }
}

/*
Returns a random point of a sphere, evenly distributed over the sphere.
The sphere is centered at (x0,y0,z0) with the passed in radius.
The returned point is returned as a three element array [x,y,z]. 
*/
export function randomPointOnSphere(center, radius) {
    var u = Math.random();
    var v = Math.random();
    var theta = 2 * Math.PI * u;
    var phi = Math.acos(2 * v - 1);
    var x = center.x + (radius * Math.sin(phi) * Math.cos(theta));
    var y = center.y + (radius * Math.sin(phi) * Math.sin(theta));
    var z = center.z + (radius * Math.cos(phi));
    return new THREE.Vector3(x, y, z);
}

export function randomPointsOnSphere(radius, center, numPoints) {
    const pointsOnSphere = [];
    for (let i = 0; i < numPoints; i++) {
        const point = randomPointOnSphere(center, radius);
        pointsOnSphere.push(point);
    }
    return pointsOnSphere;
}

// source: https://karthikkaranth.me/blog/generating-random-points-in-a-sphere/
export function randomPointInSphere(radius, center) {
    var theta = Math.random() * 2.0 * Math.PI;
    var phi = Math.random() * Math.PI;
    var sinTheta = Math.sin(theta); var cosTheta = Math.cos(theta);
    var sinPhi = Math.sin(phi); var cosPhi = Math.cos(phi);
    var x = center.x + radius * sinPhi * cosTheta;
    var y = center.y + radius * sinPhi * sinTheta;
    var z = center.z + radius * cosPhi;
    return new THREE.Vector3(x, y, z);
}
export function randomPointsInSphere(radius, center, numPoints) {
    const pointsInSphere = [];
    for (let i = 0; i < numPoints; i++) {
        const point = randomPointOnSphere(radius, center);
        pointsInSphere.push(point);
    }
    return pointsInSphere;
}